import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async create(createPostDto: CreatePostDto, user: UserRequest) {
    try {
      const response = await axios.post(
        'https://jsonplaceholder.typicode.com/posts',
        {
          title: createPostDto.title,
          body: createPostDto.body,
          userId: user.id,
        },
      );

      await this.prisma.post.create({
        data: {
          ...createPostDto,
          user_id: user.id,
          id: response.data.id,
        },
      });

      return {
        statusCode: 201,
        message: 'Post created successfully',
        data: response.data,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Error creating post: ${error}`);
    }
  }

  async findAll(user: UserRequest) {
    try {
      let response;
      response = await this.cacheManager.get(user.username);
      const dbPosts = await this.prisma.post.findMany({
        skip: 0,
        take: 15,
        orderBy: {
          created_at: 'desc',
        },
      });
      if (!response) {
        const result = await axios.get(
          'https://jsonplaceholder.typicode.com/posts?_page=1&_limit=15',
        );

        await this.cacheManager.set(user.username, result.data, 1000 * 60 * 15);
        response = result.data;
      }

      return {
        statusCode: 200,
        message: 'Posts fetched successfully',
        data: {
          placeholder_posts: response,
          db_posts: dbPosts,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching posts: ${error}`);
    }
  }

  async findOne(id: number) {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
      );
      const dbPosts = await this.prisma.post.findUnique({
        where: {
          id,
        },
      });

      return {
        statusCode: 200,
        message: 'Post fetched successfully',
        data: {
          placeholder_post: response.data,
          db_post: dbPosts,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching post: ${error}`);
    }
  }

  async update(id: number, updatePostDto: CreatePostDto, user: UserRequest) {
    try {
      const existedPost = await this.findOne(id);
      if (!existedPost.data.db_post) {
        throw new NotFoundException('Post not found');
      }

      const putResponse = await axios.put(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        {
          title: updatePostDto.title,
          body: updatePostDto.body,
          userId: user.id,
        },
      );

      const patchResponse = await axios.patch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        {
          title: updatePostDto.title,
          body: updatePostDto.body,
          userId: user.id,
        },
      );

      const dbPost = await this.prisma.post.update({
        where: {
          id,
        },
        data: {
          ...updatePostDto,
          user_id: user.id,
        },
      });

      return {
        statusCode: 200,
        message: 'Post updated successfully',
        data: {
          put_response: putResponse.data,
          patch_response: patchResponse.data,
          db_post: dbPost,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(`Error updating post: ${error}`);
    }
  }

  async remove(id: number) {
    try {
      const existedPost = await this.findOne(id);
      if (!existedPost.data.db_post) {
        throw new NotFoundException('Post not found');
      }

      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
      await this.prisma.post.delete({
        where: {
          id,
        },
      });

      return {
        statusCode: 200,
        message: 'Post deleted successfully',
        data: null,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(`Error deleting post: ${error}`);
    }
  }
}
