import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { Tarjeta } from '../tarjeta/entities/tarjeta.entity';
import { MovimientoSaldo } from '../movimientoSaldo/entities/movimientoSaldo.entity';
import { Evento } from '../evento/entities/evento.entity';
import { Producto } from '../producto/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, DetalleVenta, Tarjeta, MovimientoSaldo, Evento, Producto])],
  providers: [VentasService],
  controllers: [VentasController],
})
export class VentasModule {}