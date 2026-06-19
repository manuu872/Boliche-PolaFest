import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from '../ventas/entities/venta.entity';
import { DetalleVenta } from '../ventas/entities/detalle-venta.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Tarjeta } from '../tarjeta/entities/tarjeta.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Evento } from '../evento/entities/evento.entity';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(Venta) private ventaRepo: Repository<Venta>,
    @InjectRepository(DetalleVenta) private detalleRepo: Repository<DetalleVenta>,
    @InjectRepository(Producto) private productoRepo: Repository<Producto>,
    @InjectRepository(Tarjeta) private tarjetaRepo: Repository<Tarjeta>,
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
    @InjectRepository(Evento) private eventoRepo: Repository<Evento>,
  ) {}

  
async obtenerVentasPorEvento() {
  const eventos = await this.eventoRepo.find();
  const ventas = await this.ventaRepo.find({ relations: ['evento'] });

  return eventos.map((e) => {
    const total = ventas
      .filter((v) => v.evento?.id_evento === e.id_evento)
      .reduce((sum, v) => sum + Number(v.total || 0), 0); 

    return { evento: e.nombre, total_recaudado: parseFloat(total.toFixed(2)) };
  });
}


  
  async obtenerProductosMasVendidos() {
    const detalles = await this.detalleRepo.find({ relations: ['producto'] });

    if (!detalles.length) return [];

    const map = new Map<string, number>();
    for (const d of detalles) {
      const nombre = d.producto?.nombre || 'Sin nombre';
      map.set(nombre, (map.get(nombre) || 0) + d.cantidad);
    }

    return Array.from(map.entries()).map(([producto, total_vendido]) => ({
      producto,
      total_vendido,
    }));
  }

  
async obtenerUsuariosTop() {
  const ventas = await this.ventaRepo.find({ relations: ['tarjeta', 'tarjeta.usuario'] });
  const map = new Map<string, number>();

  for (const v of ventas) {
    const nombre = v.tarjeta?.usuario?.nombre || 'Desconocido';
    map.set(nombre, (map.get(nombre) || 0) + Number(v.total || 0));
  }

  return Array.from(map.entries()).map(([usuario, gasto_total]) => ({
    usuario,
    gasto_total: parseFloat(gasto_total.toFixed(2)),
  }));
}



async obtenerEstadoTarjetas() {
  const todas = await this.tarjetaRepo.find();
  const activas = todas.filter((t) => {
    const valor = String(t.activa).toLowerCase();
    return valor === 'true' || valor === '1';
  }).length;
  return { activas, inactivas: todas.length - activas };
}

async obtenerResumenGeneral() {
  const ventas = await this.ventaRepo.find();
  const tarjetas = await this.tarjetaRepo.find();

  const totalRecaudado = ventas.reduce((sum, v) => sum + Number(v.total || 0), 0);
  const cantidadVentas = ventas.length;
  const ticketPromedio = cantidadVentas > 0 ? totalRecaudado / cantidadVentas : 0;
  const saldoEnTarjetas = tarjetas.reduce((sum, t) => sum + Number(t.saldo || 0), 0);
  const tarjetasActivas = tarjetas.filter((t) => String(t.activa).toLowerCase() === 'true' || String(t.activa) === '1').length;

  return {
    totalRecaudado: parseFloat(totalRecaudado.toFixed(2)),
    cantidadVentas,
    ticketPromedio: parseFloat(ticketPromedio.toFixed(2)),
    saldoEnTarjetas: parseFloat(saldoEnTarjetas.toFixed(2)),
    tarjetasActivas,
    tarjetasTotales: tarjetas.length,
  };
}

async obtenerStockCritico() {
  const productos = await this.productoRepo.find();
  return productos
    .filter((p) => p.stock <= 10)
    .sort((a, b) => a.stock - b.stock)
    .map((p) => ({ nombre: p.nombre, tipo: p.tipo, stock: p.stock }));
}

}
