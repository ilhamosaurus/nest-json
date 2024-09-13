import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(5, { message: 'Username must be at least 5 characters' })
  username: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Old password is required' })
  @IsString({ message: 'Old password must be a string' })
  @MinLength(6, { message: 'Old password must be at least 6 characters' })
  oldPassword: string;

  @IsNotEmpty({ message: 'New password is required' })
  @IsString({ message: 'New password must be a string' })
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  newPassword: string;
}
