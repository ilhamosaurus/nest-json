import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [JwtModule.register({}), PassportModule],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
