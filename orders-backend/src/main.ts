import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MysqlExceptionFilter } from './core/database/mysql-exception.filter';
import { RequestContextInterceptor } from './core/database/request-context-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'verbose'],
  });

  app.enableCors({
    origin: 'http://localhost:4200', // ou ton domaine frontend
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés qui ne sont pas dans le DTO
      forbidNonWhitelisted: true, // Rejette la requête si des champs inconnus sont présents
      transform: true, // Transforme automatiquement les types (ex: string en number)
      exceptionFactory: (errors) => {
        // Ce log s'affichera dans ton terminal NestJS
        console.log('ERREUR DE VALIDATION DETECTÉE :', JSON.stringify(errors, null, 2));
        return new BadRequestException(errors);
      },
    }),
  );

  app.useGlobalFilters(new MysqlExceptionFilter());

  app.useGlobalInterceptors(app.get(RequestContextInterceptor), new ClassSerializerInterceptor(app.get(Reflector)));

  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 3000);

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Mon API REST NestJS')
    .setDescription('Documentation complète de l\'API Articles')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('articles', 'Gestion des articles')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
bootstrap().catch((err) => {
  console.log('Error bootstrap ::: ', err);
  process.exit(1);
});
