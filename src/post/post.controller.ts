import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtGuard } from 'src/user/guard';
import { CurrentUser } from 'src/decorator/current-user.decorator';

@UseGuards(JwtGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: UserRequest,
  ) {
    return this.postService.create(createPostDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: UserRequest) {
    return this.postService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: CreatePostDto,
    @CurrentUser() user: UserRequest,
  ) {
    return this.postService.update(+id, updatePostDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
