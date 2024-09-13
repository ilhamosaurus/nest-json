import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(5, { message: 'Username must be at least 5 characters' })
  username: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
