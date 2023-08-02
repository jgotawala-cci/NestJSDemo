import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // app.use(cookieSession({ keys: ['asdfasdf'] }));
  console.log(process.env);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
