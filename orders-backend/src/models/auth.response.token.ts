import { UserResponseDto } from "./user.response.dto";

export class AuthResponseToken {
    token: string;
    expiresIn: number;
    tokenType: string="Bearer";
    user: UserResponseDto;
}