import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoSaldo } from './entities/movimientoSaldo.entity';
import { MovimientoSaldoService } from './movimientoSaldo.service';
import { MovimientoSaldoController } from './movimientoSaldo.controller';

@Module({
    imports: [TypeOrmModule.forFeature([MovimientoSaldo])],
    providers: [MovimientoSaldoService],
    controllers: [MovimientoSaldoController],
})
export class MovimientoSaldoModule {}