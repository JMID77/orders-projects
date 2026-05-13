import {
  IsString,
  IsNotEmpty,
  Length,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
} from 'class-validator';

export class ProductRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  @MaxLength(10, { message: "The 'code' must be a maximum of 10 characters." })
  @MinLength(3, { message: "The 'code' must be a minimum of 3 characters." })
  code!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255, {
    message: "The 'name' must be a maximum of 255 characters.",
  })
  @MinLength(2, { message: "The 'name' must be a minimum of 2 characters." })
  description!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;
}