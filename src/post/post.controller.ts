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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBody({ type: CreatePostDto })
  @ApiCreatedResponse({
    example: {
      statusCode: 201,
      message: 'Post created successfully',
      data: {
        id: 1,
        title: 'Title',
        body: 'Body',
        user_id: 1,
      },
    },
  })
  @ApiBadRequestResponse({
    example: {
      statusCode: 400,
      message: 'Body is not valid',
    },
  })
  @ApiUnauthorizedResponse({
    example: {
      statusCode: 401,
      message: 'Malformed token',
    },
  })
  @ApiInternalServerErrorResponse({
    example: {
      statusCode: 500,
      message: 'Error creating post',
    },
  })
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: UserRequest,
  ) {
    return this.postService.create(createPostDto, user);
  }

  @ApiOkResponse({
    example: {
      statusCode: 200,
      message: 'Posts retrieved successfully',
      data: {
        placeholder_post: [
          {
            id: 1,
            title: 'Title',
            body: 'Body',
            user_id: 1,
          },
        ],
        db_post: {
          id: 1,
          title: 'Title',
          body: 'Body',
          user_id: 1,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    example: {
      statusCode: 401,
      message: 'Malformed token',
    },
  })
  @ApiInternalServerErrorResponse({
    example: {
      statusCode: 500,
      message: 'Error fetching posts',
    },
  })
  @Get()
  findAll(@CurrentUser() user: UserRequest) {
    return this.postService.findAll(user);
  }

  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    example: {
      statusCode: 200,
      message: 'Post fetched successfully',
      data: {
        placeholder_post: {
          id: 1,
          title: 'Title',
          body: 'Body',
          user_id: 1,
        },
        db_post: {
          id: 1,
          title: 'Title',
          body: 'Body',
          user_id: 1,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    example: {
      statusCode: 401,
      message: 'Malformed token',
    },
  })
  @ApiNotFoundResponse({
    example: {
      statusCode: 404,
      message: 'Post not found',
    },
  })
  @ApiInternalServerErrorResponse({
    example: {
      statusCode: 500,
      message: 'Error fetching post',
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @ApiParam({ name: 'id' })
  @ApiBody({ type: CreatePostDto })
  @ApiOkResponse({
    example: {
      statusCode: 200,
      message: 'Post updated successfully',
      data: {
        put_response: {
          id: 1,
          title: 'Updated Title',
          body: 'Updated Body',
          user_id: 1,
        },
        patch_response: {
          id: 1,
          title: 'Updated Title',
          body: 'Updated Body',
          user_id: 1,
        },
        db_post: {
          id: 1,
          title: 'Updated Title',
          body: 'Updated Body',
          user_id: 1,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    example: {
      statusCode: 401,
      message: 'Malformed token',
    },
  })
  @ApiNotFoundResponse({
    example: {
      statusCode: 404,
      message: 'Post not found',
    },
  })
  @ApiInternalServerErrorResponse({
    example: {
      statusCode: 500,
      message: 'Error updating post',
    },
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: CreatePostDto,
    @CurrentUser() user: UserRequest,
  ) {
    return this.postService.update(+id, updatePostDto, user);
  }

  @ApiParam({ name: 'id' })
  @ApiOkResponse({
    example: {
      statusCode: 200,
      message: 'Post deleted successfully',
      data: null,
    },
  })
  @ApiUnauthorizedResponse({
    example: {
      statusCode: 401,
      message: 'Malformed token',
    },
  })
  @ApiNotFoundResponse({
    example: {
      statusCode: 404,
      message: 'Post not found',
    },
  })
  @ApiInternalServerErrorResponse({
    example: {
      statusCode: 500,
      message: 'Error deleting post',
    },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
