import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { TarjetaService } from './tarjeta.service';
import { Tarjeta } from './entities/tarjeta.entity';
import { CrearTarjetaDto } from './dto/crear-tarjeta.dto';

@Controller('tarjetas')
export class TarjetaController {
  constructor(private readonly tarjetaService: TarjetaService) {}

  @Post()
  create(@Body() dto: CrearTarjetaDto): Promise<Tarjeta> {
    return this.tarjetaService.crearTarjetas(dto);
  }

  @Post('crear/:usuarioId')
  crearParaUsuario(@Param('usuarioId') usuarioId: string): Promise<Tarjeta> {
    return this.tarjetaService.crearTarjetaParaUsuario(Number(usuarioId));
  }

  @Get()
  findAll(): Promise<Tarjeta[]> {
    return this.tarjetaService.obtenerTarjetas();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Tarjeta> {
    return this.tarjetaService.obtenerTarjetaPorId(id);
  }

  @Get('codigo/:codigo')
  async obtenerPorCodigo(@Param('codigo') codigo: string): Promise<Tarjeta> {
    const tarjeta = await this.tarjetaService.obtenerPorCodigo(codigo);
    if (!tarjeta) throw new NotFoundException('No se encontró la tarjeta');
    return tarjeta;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() tarjeta: Tarjeta): Promise<Tarjeta> {
    return this.tarjetaService.actualizarTarjeta(id, tarjeta);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.tarjetaService.eliminarTarjeta(id);
  }

  @Put('descontar/:codigo')
  async descontar(@Param('codigo') codigo: string, @Body() body: { monto: number }): Promise<Tarjeta> {
    return this.tarjetaService.descontarSaldo(codigo, body.monto);
  }

 @Put('cargar/:id')
async cargarSaldo(
  @Param('id') id: string,
  @Body() body: { monto: number }
) {
  const monto = Number(body.monto);
  if (isNaN(monto) || monto <= 0) {
    throw new Error('Monto inválido');
  }
  return await this.tarjetaService.cargarSaldo(Number(id), monto);
}

 
  @Put('toggle/:id')
  async toggleActiva(@Param('id') id: string): Promise<Tarjeta> {
    return this.tarjetaService.toggleActiva(Number(id));
  }
}
