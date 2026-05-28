import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('TenunKita API')
    .setDescription('Documentation for TenunKita API (Laravel style)')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('products')
    .addTag('categories')
    .addTag('orders')
    .addTag('carts')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port, '[IP_ADDRESS]');
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
