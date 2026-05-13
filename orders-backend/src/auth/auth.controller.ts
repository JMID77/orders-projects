import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserResponseDto } from '../models/user.response.dto';
import { AuthRegisterDto } from '../models/auth.register.dto';
import { AuthLoginDto } from '../models/auth.login.dto';
import { AuthResponseToken } from '../models/auth.response.token';
import { Public } from './public-decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('register')
    register(@Body() register: AuthRegisterDto): Promise<AuthResponseToken> {
        return this.authService.register(register);
    }

    @Public()
    @Post('login')
    login(@Body() login: AuthLoginDto): Promise<AuthResponseToken> {
        return this.authService.login(login);
    }
}
