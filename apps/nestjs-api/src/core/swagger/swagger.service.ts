import { type INestApplication, Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class SwaggerService {
  init(app: INestApplication<unknown>) {
    const config = new DocumentBuilder()
      .setTitle('Auth Playground API')
      .setVersion('1.0.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      })
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(process.env.DOCS_PATH!, app, document);
  }
}
