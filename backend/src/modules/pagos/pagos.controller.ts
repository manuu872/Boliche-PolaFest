import { Controller, Post, Get, Query, Body, HttpCode } from '@nestjs/common';
import { PagosService } from './pagos.service';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post('crear-preferencia')
  crearPreferencia(@Body() body: { monto: number; id_tarjeta: number }) {
    return this.pagosService.crearPreferencia(body.monto, body.id_tarjeta);
  }

  @Get('confirmar')
  confirmarPago(@Query('payment_id') paymentId: string) {
    return this.pagosService.confirmarPago(paymentId);
  }

  @Get('confirmar-preferencia')
  confirmarPorPreferencia(
    @Query('id_tarjeta') idTarjeta: string,
    @Query('exclude_payment_id') excludePaymentId?: string,
  ) {
    return this.pagosService.confirmarPorPreferencia(idTarjeta, excludePaymentId);
  }

  @Post('webhook')
  @HttpCode(200)
  webhook(@Body() body: any) {
    return this.pagosService.procesarWebhook(body);
  }
}
