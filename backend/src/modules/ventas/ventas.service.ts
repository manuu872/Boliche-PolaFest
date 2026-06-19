import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { Tarjeta } from '../tarjeta/entities/tarjeta.entity';
import { MovimientoSaldo } from '../movimientoSaldo/entities/movimientoSaldo.entity';
import { Evento } from '../evento/entities/evento.entity';
import { Producto } from '../producto/entities/producto.entity'; 
import { CrearVentaDto } from './dto/crear-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepo: Repository<Venta>,

    @InjectRepository(DetalleVenta)
    private detalleRepo: Repository<DetalleVenta>,

    @InjectRepository(Tarjeta)
    private tarjetaRepo: Repository<Tarjeta>,

    @InjectRepository(MovimientoSaldo)
    private movRepo: Repository<MovimientoSaldo>,

    @InjectRepository(Evento)
    private eventoRepo: Repository<Evento>,

    @InjectRepository(Producto)
    private productoRepo: Repository<Producto>, 
  ) {}

  async registrarVenta(dto: CrearVentaDto) {
    const tarjeta = await this.tarjetaRepo.findOne({
      where: { id_tarjeta: dto.id_tarjeta },
      relations: ['usuario'],
    });

    if (!tarjeta || !tarjeta.activa) {
      throw new Error('Tarjeta inválida o inactiva');
    }

    if (tarjeta.saldo < dto.total) {
      throw new Error('Saldo insuficiente');
    }

    const evento = await this.eventoRepo.findOne({
      where: { id_evento: dto.id_evento },
    });

    if (!evento) {
      throw new Error('Evento no encontrado');
    }

    const venta = this.ventaRepo.create({
      total: dto.total,
      tarjeta,
      evento,
      fecha: new Date(),
    });

    const ventaGuardada = await this.ventaRepo.save(venta);

    for (const p of dto.productos) {
      const producto = await this.productoRepo.findOne({
        where: { id_producto: p.id_producto },
      });

      if (!producto) {
        throw new Error(`Producto con ID ${p.id_producto} no encontrado`);
      }

      if (producto.stock < p.cantidad) {
        throw new Error(
          `Stock insuficiente para el producto "${producto.nombre}" (stock actual: ${producto.stock})`
        );
      }

      producto.stock -= p.cantidad;
      await this.productoRepo.save(producto);

      const detalle = this.detalleRepo.create({
        venta: ventaGuardada,
        producto,
        cantidad: p.cantidad,
        subtotal: p.subtotal,
      });

      await this.detalleRepo.save(detalle);
    }

    tarjeta.saldo -= dto.total;
    await this.tarjetaRepo.save(tarjeta);

    const movimiento = this.movRepo.create({
      tipo: 'consumo',
      monto: dto.total,
      fecha: new Date(),
      id_tarjeta: tarjeta.id_tarjeta,
    });
    await this.movRepo.save(movimiento);

    return {
      mensaje: 'Venta registrada correctamente y stock actualizado',
      usuario: `${tarjeta.usuario?.nombre || ''} ${tarjeta.usuario?.apellido || ''}`,
      evento: evento.nombre,
      venta: ventaGuardada,
    };
  }

  async obtenerVentas() {
    return await this.ventaRepo.find({
      relations: ['tarjeta', 'tarjeta.usuario', 'detalles', 'evento'],
    });
  }

  async obtenerVentasPorEvento(id_evento: number) {
    return await this.ventaRepo.find({
      where: { evento: { id_evento } },
      relations: ['tarjeta', 'tarjeta.usuario', 'detalles', 'evento'],
      order: { fecha: 'DESC' },
    });
  }

  async obtenerVentasPorTarjeta(id_tarjeta: number) {
    return await this.ventaRepo.find({
      where: { tarjeta: { id_tarjeta } },
      relations: ['detalles', 'detalles.producto', 'evento'],
      order: { fecha: 'DESC' },
    });
  }
}
