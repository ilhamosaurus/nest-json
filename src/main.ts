import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  await app.listen(PORT).then(() => {
    Logger.log(`Listening at http://localhost:${PORT}/${globalPrefix}  🚀🚀🚀`);
  });
}
bootstrap();
