import { Controller, Get } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';

@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  
  @Get('ventas-por-evento')
  ventasPorEvento() {
    return this.estadisticasService.obtenerVentasPorEvento();
  }

  
  @Get('productos-mas-vendidos')
  productosMasVendidos() {
    return this.estadisticasService.obtenerProductosMasVendidos();
  }

 
  @Get('usuarios-top')
  usuariosTop() {
    return this.estadisticasService.obtenerUsuariosTop();
  }

  
  @Get('estado-tarjetas')
  estadoTarjetas() {
    return this.estadisticasService.obtenerEstadoTarjetas();
  }

  @Get('resumen')
  resumen() {
    return this.estadisticasService.obtenerResumenGeneral();
  }

  @Get('stock-critico')
  stockCritico() {
    return this.estadisticasService.obtenerStockCritico();
  }
}
