import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Title', description: 'Title of the post' })
  @IsNotEmpty()
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({ example: 'Body', description: 'Body of the post' })
  @IsNotEmpty()
  @IsString({ message: 'Body must be a string' })
  body: string;
}
