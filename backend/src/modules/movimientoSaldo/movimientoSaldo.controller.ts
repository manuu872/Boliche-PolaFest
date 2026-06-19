import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { MovimientoSaldoService } from './movimientoSaldo.service';
import { MovimientoSaldo } from './entities/movimientoSaldo.entity';
import { CrearMovimientoSaldoDto } from './dto/crear-movimientoSaldo.dto';

@Controller('movimientos-saldo')
export class MovimientoSaldoController {
    constructor(private readonly movimientoSaldoService: MovimientoSaldoService) {}
  
    @Post()
    create(@Body() dto: CrearMovimientoSaldoDto): Promise<MovimientoSaldo> {
        return this.movimientoSaldoService.crearMovimientoSaldo(dto);
    }
  
    @Get()
    findAll(): Promise<MovimientoSaldo[]> {
        return this.movimientoSaldoService.obtenerMovimietoSaldo();
    }
  
    @Delete(':id')
    delete(@Param('id') id: string): Promise<void> {
        return this.movimientoSaldoService.eliminarConsumo(id);
    }
}