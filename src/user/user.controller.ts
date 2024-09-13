import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtGuard } from './guard';
import { CurrentUser } from 'src/decorator/current-user.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }

  @UseGuards(JwtGuard)
  @Get('User')
  async getUser(@CurrentUser() user: UserRequest) {
    return this.userService.getUser(user);
  }
}
