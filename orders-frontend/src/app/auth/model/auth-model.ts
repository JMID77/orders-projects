import { UserDto } from "@angular/users/model/user.model";

export interface AuthPost {
    name?: string;
    email: string;
    password: string;
}

export interface AuthData {
    name?: string;
    email: string;
    password: string;
    user: UserDto;
}

export interface AuthStorage {
    token: string;
    tokenType: string;
    expireIn: number;
    user: UserDto;
}