import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerService } from 'src/core/swagger/swagger.service';
import { IS_DEV } from 'src/shared/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: IS_DEV
      ? ['log', 'error', 'warn', 'debug', 'verbose']
      : ['log', 'error', 'warn'],
    cors: {
      origin: '*',
    },
  });

  const configService = app.get(ConfigService);
  const swaggerService = app.get(SwaggerService);

  if (IS_DEV) {
    swaggerService.init(app);
  }

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.getOrThrow<number>('PORT'));
  console.log(
    `🚀 API is running on: ${await app.getUrl()}/${process.env.DOCS_PATH}`,
  );
}

void bootstrap().catch((err) => {
  console.error('Error during app bootstrap:', err);
  process.exit(1);
});
