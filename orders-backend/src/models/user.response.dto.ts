import { Expose } from "class-transformer";

export class UserResponseDto {
  id: number;
  name: string;
  email!: string;
  @Expose({name: 'is_admin'})
  isAdmin: boolean;
  @Expose({name: 'is_active'})
  isActive: boolean;
}