import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import * as Joi from 'joi';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        DATABASE_URL: Joi.string().required(),
        SECRET: Joi.string().required(),
      }),
      envFilePath: '.env',
    }),
    CacheModule.register({ isGlobal: true, ttl: 1000 * 60 * 60 * 2, max: 10 }),
    PrismaModule,
    UserModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
