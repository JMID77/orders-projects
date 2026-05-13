import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserResponseDto } from '../models/user.response.dto';
import { AuthRegisterDto } from '../models/auth.register.dto';
import { AuthLoginDto } from '../models/auth.login.dto';
import { AuthResponseToken } from '../models/auth.response.token';
import { Public } from './public-decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('register')
    async register(@Body() register: AuthRegisterDto, @Res({ passthrough: true }) res: Response): Promise<UserResponseDto> {
        const userToken = await this.authService.register(register);
        const isProd = this.authService.isProduction();

        res.cookie('access_token', userToken.token, {
            httpOnly: true,
            secure: isProd, // true en prod HTTPS
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 1000 * 60 * 60 * 24,
        });

        return userToken.user;
    }

    @Public()
    @Post('login')
    async login(@Body() login: AuthLoginDto, @Res({ passthrough: true }) res: Response): Promise<UserResponseDto> {
        const userToken = await this.authService.login(login);
        const isProd = this.authService.isProduction();

        res.cookie('access_token', userToken.token, {
            httpOnly: true,
            secure: isProd, // true en prod HTTPS
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 1000 * 60 * 60 * 24,
        });

        return userToken.user;
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token');

        return {
            message: 'Logged out',
        };
    }
}
