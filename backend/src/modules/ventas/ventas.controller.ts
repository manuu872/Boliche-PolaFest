import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CrearVentaDto } from './dto/crear-venta.dto';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  
  @Post()
  async registrarVenta(@Body() dto: CrearVentaDto) {
    return await this.ventasService.registrarVenta(dto);
  }

  
  @Get()
  async obtenerVentas() {
    return await this.ventasService.obtenerVentas();
  }

  
  @Get('evento/:id_evento')
  async obtenerVentasPorEvento(@Param('id_evento') id_evento: string) {
    return await this.ventasService.obtenerVentasPorEvento(Number(id_evento));
  }

  @Get('tarjeta/:id_tarjeta')
  async obtenerVentasPorTarjeta(@Param('id_tarjeta') id_tarjeta: string) {
    return await this.ventasService.obtenerVentasPorTarjeta(Number(id_tarjeta));
  }
}
