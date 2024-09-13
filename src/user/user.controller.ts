import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtGuard } from './guard';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({
    example: {
      statusCode: 201,
      message: 'User created successfully, please login',
      data: null,
    },
  })
  @ApiUnprocessableEntityResponse({
    example: {
      statusCode: 422,
      message: 'User already exists',
      data: null,
    },
  })
  @ApiInternalServerErrorResponse({
    example: {
      statusCode: 500,
      message: 'Error creating user',
      data: null,
    },
  })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @ApiCreatedResponse({
    example: {
      statusCode: 201,
      message: 'User created successfully, please login',
      access_token: 'token',
    },
  })
  @ApiForbiddenResponse({
    example: {
      statusCode: 403,
      message: 'Invalid credentials',
    },
  })
  @ApiInternalServerErrorResponse({
    example: {
      statusCode: 500,
      message: 'Error logging in user',
    },
  })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    example: {
      statusCode: 200,
      message: 'User found',
      data: {
        id: 1,
        email: '7cZJt@example.com',
        username: 'test',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    example: {
      statusCode: 500,
      message: 'Error fetching user',
    },
  })
  @Get('User')
  async getUser(@CurrentUser() user: UserRequest) {
    return this.userService.getUser(user);
  }
}
