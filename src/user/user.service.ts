import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcryptjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: hashedPassword,
        },
      });

      return {
        statusCode: 201,
        message: 'User created successfully, please login',
        data: null,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UnprocessableEntityException('User already exists');
      }

      throw new InternalServerErrorException(`Error creating user: ${error}`);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          email: true,
          username: true,
          password: true,
        },
      });

      return user;
    } catch (error) {
      if (
        (error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025') ||
        (error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2001')
      ) {
        return null;
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.getUserByEmail(dto.email);
      if (!user) {
        throw new ForbiddenException('Invalid credentials');
      }

      const passwordMatch = await bcrypt.compare(dto.password, user.password);
      if (!passwordMatch) {
        throw new ForbiddenException('Invalid credentials');
      }

      const token = await this.generateToken(
        user.id,
        user.username,
        user.email,
      );

      return {
        statusCode: 200,
        message: 'User logged in successfully',
        access_token: token,
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error logging in: ${error}`);
    }
  }

  async generateToken(
    id: number,
    username: string,
    email: string,
  ): Promise<string> {
    const payload = {
      sub: id,
      username,
      email,
    };

    const secret = this.config.get<string>('SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '2h',
      algorithm: 'HS256',
      secret,
    });

    return token;
  }

  async getUser(user: UserRequest) {
    try {
      const cachedResponse = await this.cacheManager.get(
        'user_json_placeholder',
      );
      if (!cachedResponse) {
        const response = await axios.get(
          'https://jsonplaceholder.typicode.com/users',
        );

        await this.cacheManager.set(
          'user_json_placeholder',
          JSON.stringify(response.data),
          1000 * 60 * 15,
        );
        return {
          statusCode: 200,
          message: 'User fetched successfully',
          data: {
            current_user: user,
            placeholder_users: response.data,
          },
        };
      }

      return {
        statusCode: 200,
        message: 'User fetched successfully',
        data: {
          current_user: user,
          placeholder_users: JSON.parse(cachedResponse as string),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching user: ${error}`);
    }
  }
}
