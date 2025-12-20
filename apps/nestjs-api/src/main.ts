import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  const port = config.getOrThrow<number>('PORT');

  await app.listen(port);
  console.log(`🚀 Metadata API is running on: http://localhost:${port}`);
}

void bootstrap().catch((err) => {
  console.error('Error during app bootstrap:', err);
  process.exit(1);
});
