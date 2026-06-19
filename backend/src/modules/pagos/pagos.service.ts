import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { Tarjeta } from '../tarjeta/entities/tarjeta.entity';

@Injectable()
export class PagosService {
  private mp: MercadoPagoConfig;

  constructor(
    @InjectRepository(Tarjeta)
    private tarjetaRepository: Repository<Tarjeta>,
    private configService: ConfigService,
  ) {
    this.mp = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('MP_ACCESS_TOKEN') || '',
    });
  }

  async crearPreferencia(monto: number, id_tarjeta: number) {
    const preference = new Preference(this.mp);

    const response = await preference.create({
      body: {
        items: [
          {
            id: `tarjeta-${id_tarjeta}`,
            title: 'Carga de saldo - Boliche GOD',
            quantity: 1,
            unit_price: monto,
            currency_id: 'ARS',
          },
        ],
        external_reference: String(id_tarjeta),
        back_urls: {
          success: 'http://localhost:5173/cliente',
          failure: 'http://localhost:5173/cliente',
          pending: 'http://localhost:5173/cliente',
        },
      },
    });

    return { init_point: response.sandbox_init_point, preference_id: response.id };
  }

  async confirmarPorPreferencia(idTarjeta: string, excludePaymentId?: string) {
    try {
      const accessToken = this.configService.get<string>('MP_ACCESS_TOKEN');
      const url = `https://api.mercadopago.com/v1/payments/search?external_reference=${idTarjeta}&status=approved&sort=date_created&criteria=desc&limit=1`;
      console.log('🔍 Buscando pago para id_tarjeta:', idTarjeta);
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      console.log('📦 Respuesta MP:', JSON.stringify(data));
      const payments = data?.results ?? [];

      if (!payments.length) return { ok: false, mensaje: 'Sin pago aprobado reciente' };

      const paymentData = payments[0];
      const paymentId = String(paymentData.id);

      if (excludePaymentId && excludePaymentId === paymentId) {
        return { ok: false, mensaje: 'Este pago ya fue acreditado' };
      }

      const id_tarjeta = Number(paymentData.external_reference);
      const monto = Number(paymentData.transaction_amount);

      const tarjeta = await this.tarjetaRepository.findOne({ where: { id_tarjeta } });
      if (!tarjeta) return { ok: false, mensaje: 'Tarjeta no encontrada' };

      tarjeta.saldo = Number(tarjeta.saldo) + monto;
      await this.tarjetaRepository.save(tarjeta);

      console.log(`✅ Saldo acreditado: $${monto} a tarjeta ${id_tarjeta}`);
      return { ok: true, saldo: tarjeta.saldo, payment_id: paymentId };
    } catch (err) {
      console.error('Error confirmando por preferencia:', err);
      return { ok: false, mensaje: 'Error al verificar pago' };
    }
  }

  async confirmarPago(paymentId: string) {
    try {
      const payment = new Payment(this.mp);
      const paymentData = await payment.get({ id: paymentId });

      if (paymentData.status !== 'approved') return { ok: false, mensaje: 'Pago no aprobado' };

      const id_tarjeta = Number(paymentData.external_reference);
      const monto = Number(paymentData.transaction_amount);

      const tarjeta = await this.tarjetaRepository.findOne({ where: { id_tarjeta } });
      if (!tarjeta) return { ok: false, mensaje: 'Tarjeta no encontrada' };

      tarjeta.saldo = Number(tarjeta.saldo) + monto;
      await this.tarjetaRepository.save(tarjeta);

      console.log(`✅ Saldo confirmado: $${monto} a tarjeta ${id_tarjeta}`);
      return { ok: true, saldo: tarjeta.saldo };
    } catch (err) {
      console.error('Error confirmando pago:', err);
      return { ok: false, mensaje: 'Error al confirmar pago' };
    }
  }

  async procesarWebhook(body: any) {
    if (body.type !== 'payment') return { ok: true };

    const paymentId = body.data?.id;
    if (!paymentId) return { ok: true };

    try {
      const payment = new Payment(this.mp);
      const paymentData = await payment.get({ id: paymentId });

      if (paymentData.status !== 'approved') return { ok: true };

      const id_tarjeta = Number(paymentData.external_reference);
      const monto = Number(paymentData.transaction_amount);

      const tarjeta = await this.tarjetaRepository.findOne({ where: { id_tarjeta } });
      if (!tarjeta) return { ok: true };

      tarjeta.saldo = Number(tarjeta.saldo) + monto;
      await this.tarjetaRepository.save(tarjeta);

      console.log(`✅ Saldo cargado: $${monto} a tarjeta ${id_tarjeta}`);
    } catch (err) {
      console.error('Error procesando webhook MP:', err);
    }

    return { ok: true };
  }
}
