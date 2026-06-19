import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarjeta } from './entities/tarjeta.entity';
import { TarjetaService } from './tarjeta.service';
import { TarjetaController } from './tarjeta.controller';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tarjeta, Usuario]) 
  ],
  controllers: [TarjetaController],
  providers: [TarjetaService],
  exports: [TarjetaService],
})
export class TarjetaModule {}
