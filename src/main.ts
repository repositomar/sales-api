import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

function configurationSwagger(app: NestFastifyApplication) {
  const config = new DocumentBuilder()
    .setTitle('Sales REST API')
    .setDescription('API for Sales')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('sales-api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  // await app.listen(process.env.PORT ?? 3000);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const configService = app.get(ConfigService);
  const port = configService.get('http.port');

  configurationSwagger(app);

  await app
    .listen(port, '0.0.0.0')
    .then(() =>
      new Logger('bootstrap').log(`Application listening on port ${port}`),
    );
}
bootstrap().then(() => Logger.log('Bootstrap ended'));