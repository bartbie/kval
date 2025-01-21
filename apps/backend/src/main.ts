import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(env.PORT ?? 3000);
}
bootstrap();
