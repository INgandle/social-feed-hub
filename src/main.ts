import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Social feed hub API')
  .setDescription('소셜 미디어 통합 feed 서비스 (가제) 의 API 문서입니다.')
  .setVersion('1.0')
  .addTag('SocialFeedHub')
  .build();

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
};
bootstrap();
