import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from '../models/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponseDto } from '../models/user.response.dto';
import { UserRequestDto } from '../models/user.request.dto';
import { UserMapper } from '../models/user.mapper';


@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {

    }

    async getUsers(): Promise<UserResponseDto[]> {
        const users = await this.userRepository.find({ order: { name: 'ASC' } });
        return UserMapper.toDtoResponses(users);
    }

    async getUserById(id: number): Promise<UserResponseDto> {
        const user = await this.userRepository.findOne({ where: { id: id } });
        return UserMapper.toDtoResponse(user);
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email: email } });
        return user;
    }

    async createUser(user: UserRequestDto): Promise<UserResponseDto> {
        this.logTriggered('createUser');

        const isNameTaken: boolean = await this.userRepository.existsBy({
            name: user.name,
        });
        if (isNameTaken) {
            throw new ConflictException({
                message: `The name ${user.name} is already used.`,
                field: "name",
            });
        }
        const isEmailTaken: boolean = await this.userRepository.existsBy({
            email: user.email,
        });
        if (isEmailTaken) {
            throw new ConflictException({
                message: `The email ${user.email} is already used.`,
                field: "email",
            });
        }

        const entity: User = UserMapper.fromDtoRequest(user);
        return UserMapper.toDtoResponse(await this.userRepository.save(entity));
    }

    async updateUser(
        id: number,
        userDto: UserRequestDto,
    ): Promise<UserResponseDto> {
        const user = await this.userRepository.findOneBy({
            id: id,
        });

        this.logTriggered('updateUser');

        if (!user) {
            throw new NotFoundException(`User not found to update id ${id}`);
        }

        const updateUser = this.userRepository.merge(user, UserMapper.fromDtoRequest(userDto));

        return UserMapper.toDtoResponse(
            await this.userRepository.save(updateUser),
        );
    }

    async deleteUser(userId: number): Promise<void> {
        const result = await this.userRepository.delete(userId);

        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
    }

    private logTriggered(action: string, data: User | null = null) {
        if (!data) {
            console.log(`UsersService [${action}] - triggered`);
        } else {
            console.log(
                `UsersService [${action}] - triggered`,
                JSON.stringify(data),
            );
        }
    }
}
