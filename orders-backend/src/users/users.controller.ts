import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from '../models/user.response.dto';
import { UserRequestDto } from '../models/user.request.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get()
    async getUsers(): Promise<UserResponseDto[]> {
        return this.userService.getUsers();;
    }

    @Get(':id')
    async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto | null> {
        return this.userService.getUserById(id);
    }

    @Post()
    async postUser(@Body() user: UserRequestDto): Promise<UserResponseDto> {
        console.log("postUser", user);
        return this.userService.createUser(user);
    }

    @Patch(':id')
    async patchUser(
        @Param('id', ParseIntPipe) id: number,
        @Body()
        user: UserRequestDto,
    ): Promise<UserResponseDto> {
        console.log("patchCustomer", user);
        return this.userService.updateUser(id, user);
    }

    @Put(':id')
    async putUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() user: UserRequestDto,
    ): Promise<UserResponseDto> {
        console.log("putUser", user);
        return this.userService.updateUser(id, user);
    }

    @Delete(':id')
    async deleteUser(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
        return this.userService.deleteUser(id);
    }
}
