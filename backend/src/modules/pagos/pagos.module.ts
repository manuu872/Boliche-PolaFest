import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { Tarjeta } from '../tarjeta/entities/tarjeta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tarjeta]), ConfigModule],
  providers: [PagosService],
  controllers: [PagosController],
})
export class PagosModule {}
