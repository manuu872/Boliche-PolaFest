import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { EventoModule } from './modules/evento/evento.module';
import { TarjetaModule } from './modules/tarjeta/tarjeta.module';
import { ProductoModule } from './modules/producto/producto.module';
import { ConsumoModule } from './modules/consumo/consumo.module';
import { MovimientoSaldoModule } from './modules/movimientoSaldo/movimientoSaldo.module';
import { VentasModule } from './modules/ventas/ventas.module';
import { EstadisticasModule } from './modules/estadisticas/estadisticas.module';
import { AuthModule } from './modules/auth/auth.module';
import { PagosModule } from './modules/pagos/pagos.module';

@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<any>('DB_TYPE'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    
    UsuarioModule,
    EventoModule,
    TarjetaModule,
    ProductoModule,
    ConsumoModule,
    VentasModule,
    EstadisticasModule,
    MovimientoSaldoModule,
    AuthModule,
    PagosModule,
  ],
})
export class AppModule {}
