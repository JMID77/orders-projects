import {
  IsString,
  IsNotEmpty,
  Length,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CustomerRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  @MaxLength(10, {message: 'The \'code\' must be a maximum of 10 characters.'})
  @MinLength(3, {message: 'The \'code\' must be a minimum of 3 characters.'})
  code!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100, {message: 'The \'name\' must be a maximum of 100 characters.'})
  @MinLength(2, {message: 'The \'name\' must be a minimum of 2 characters.'})
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {message: 'The \'address\' must be a maximum of 500 characters.'})
  address!: string;

  @IsEmail({}, {message: 'The email format is invalid.'})
  @IsNotEmpty()
  @MaxLength(255)
  email!: string;
}