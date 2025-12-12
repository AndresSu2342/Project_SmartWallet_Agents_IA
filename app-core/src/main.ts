import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5179', 'http://localhost:5173'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3002);
  console.log('Server running on http://localhost:3002');
}
void bootstrap();
