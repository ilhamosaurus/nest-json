import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty()
  @IsString({ message: 'Body must be a string' })
  body: string;
}
