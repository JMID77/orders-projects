import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';

import { Customer } from './models/customer.entity';
import { ProductsModule } from './products/products.module';
import { Product } from './models/product.entity';
import { OrdersModule } from './orders/orders.module';
import { OrderHeader, OrderLine } from './models/order.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './models/user.entity';
import { SecurityModule } from './core/auth/security.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DatabaseCommonModule } from './core/database/database.module';
import { PdfModule } from './pdf/pdf.module';
import { VatCodeModule } from './core/vat/vat.module';
import { VatCode } from './models/vat-code.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Gestion variable d'environnement
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      // Connexion DB
      imports: [ConfigModule, AuthModule, UsersModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        database: configService.get<string>('DB_NAME'),
        port: parseInt(configService.get<string>('DB_PORT') || '3306', 10),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        entities: [Customer, Product, OrderHeader, OrderLine, User, VatCode],
        synchronize: true,
      }),
    }),
    CustomersModule,
    ProductsModule,
    OrdersModule,
    AuthModule,
    UsersModule,
    SecurityModule,
    DashboardModule,
    DatabaseCommonModule,
    PdfModule,
    VatCodeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }
