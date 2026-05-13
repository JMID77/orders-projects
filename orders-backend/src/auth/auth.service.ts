import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRequestDto } from '../models/user.request.dto';
import { AuthRegisterDto } from '../models/auth.register.dto';
import { hash, compare } from 'bcrypt';
import { UserResponseDto } from '../models/user.response.dto';
import { AuthLoginDto } from '../models/auth.login.dto';
import { AuthResponseToken } from '../models/auth.response.token';
import { User } from '../models/user.entity';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { UserMapper } from '../models/user.mapper';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService, private configService: ConfigService) { }

    async register(register: AuthRegisterDto): Promise<AuthResponseToken> {
        const token: AuthResponseToken = new AuthResponseToken();
        const user: UserRequestDto = new UserRequestDto();
        const hash = await this.hashPassword(register.password);

        user.name = register.name
        user.email = register.email
        user.password = hash
        
        const userDto: UserResponseDto = await this.userService.createUser(user)

        const payloadSign = {sub: userDto.id, email: userDto.email};
        token.token = this.jwtService.sign(payloadSign);
        token.expiresIn = this.getExpiresTokenInSecondes();
        token.user = userDto;

        return token;
    }

    async login(login: AuthLoginDto): Promise<AuthResponseToken> {
        const userEntity: User = await this.userService.getUserByEmail(login.email);
        if (!userEntity || !(await compare(login.password, userEntity.password))) {
            throw new UnauthorizedException();
        }
        const payloadSign = {sub: userEntity.id, email: userEntity.email};
        const token: AuthResponseToken = new AuthResponseToken();
        
        token.token = this.jwtService.sign(payloadSign);
        token.expiresIn = this.getExpiresTokenInSecondes();
        token.user = UserMapper.toDtoResponse(userEntity);
        return token;
    }

    private async hashPassword(password: string): Promise<string> {
        const hashedPwd = await hash(password, 9);
        return hashedPwd;
    }

    private getExpiresTokenInSecondes(): number {
        const expireIn = this.configService.get<string>('JWT_EXPIRES_IN');
        return (ms(expireIn as ms.StringValue) / 1000);
    }
}
