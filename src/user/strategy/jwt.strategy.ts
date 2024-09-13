import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('SECRET'),
    });
  }

  async validate(payload: TokenPayload): Promise<UserRequest> {
    try {
      const cachedUser = await this.cacheManager.get<UserRequest>(
        payload.email,
      );
      if (!cachedUser) {
        const user = await this.userService.getUserByEmail(payload.email);

        if (!user) {
          throw new UnauthorizedException('Malformed token');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...rest } = user;
        await this.cacheManager.set(payload.email, rest, 1000 * 60 * 15);
        return rest;
      }

      return cachedUser;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error validating token: ${error}`,
      );
    }
  }
}
