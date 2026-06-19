import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Tarjeta } from '../../tarjeta/entities/tarjeta.entity';
import { DetalleVenta } from './detalle-venta.entity';
import { Evento } from '../../evento/entities/evento.entity';

@Entity('Venta')
export class Venta {
  @PrimaryGeneratedColumn()
  id_venta: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

 
  @ManyToOne(() => Tarjeta)
  @JoinColumn({ name: 'id_tarjeta' })
  tarjeta: Tarjeta;

  
  @ManyToOne(() => Evento)
  @JoinColumn({ name: 'id_evento' })
  evento: Evento;


  @OneToMany(() => DetalleVenta, (detalle) => detalle.venta)
  detalles: DetalleVenta[];
}
