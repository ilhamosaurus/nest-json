import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

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
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
