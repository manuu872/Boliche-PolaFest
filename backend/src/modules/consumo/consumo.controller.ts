import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ConsumoService } from './consumo.service';
import { Consumo } from './entities/consumo.entity';
import { CrearConsumoDto } from './dto/crear-cosumo.dto';

@Controller('consumos')
export class ConsumoController {
    constructor(private readonly consumoService: ConsumoService) {}
  
    @Post()
    create(@Body() dto: CrearConsumoDto): Promise<Consumo> {
        return this.consumoService.crearConsumos(dto);
    }
  
    @Get()
    findAll(): Promise<Consumo[]> {
        return this.consumoService.obtenerConsumos();
    }

    @Get('usuario/:id_usuario')
    findByUsuario(@Param('id_usuario') id_usuario: string): Promise<Consumo[]> {
        return this.consumoService.obtenerConsumosPorUsuario(Number(id_usuario));
    }
  
    @Delete(':id')
    delete(@Param('id') id: string): Promise<void> {
        return this.consumoService.eliminarConsumo(id);
    }
}