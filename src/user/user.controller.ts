import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtGuard } from './guard';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    example: {
      statusCode: 201,
      message: 'User created successfully, please login',
      data: null,
    },
  })
  @ApiBadRequestResponse({
    example: {
      statusCode: 400,
      message: 'Body is not valid',
    },
  })
  @ApiUnprocessableEntityResponse({
    example: {
      statusCode: 422,
      message: 'User already exists',
    },
  })
  @ApiInternalServerErrorResponse({
    example: {
      statusCode: 500,
      message: 'Error creating user',
    },
  })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({
    example: {
      statusCode: 201,
      message: 'User created successfully, please login',
      access_token: 'token',
    },
  })
  @ApiBadRequestResponse({
    example: {
      statusCode: 400,
      message: 'Body is not valid',
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
  @ApiUnauthorizedResponse({
    example: {
      statusCode: 401,
      message: 'Malformed token',
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
