import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './helper/exception.filter';
import { ValidationPipe } from './helper/validation.Pipe';

import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // Apply global validation pipe
  app.useGlobalPipes(new ValidationPipe());
  // Apply global HTTP exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT);
}
bootstrap();
