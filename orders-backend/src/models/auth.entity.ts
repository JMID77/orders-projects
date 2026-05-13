import { IsNotEmpty, IsString } from 'class-validator';

export class AuthBodyDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  userPassword: string;
}
