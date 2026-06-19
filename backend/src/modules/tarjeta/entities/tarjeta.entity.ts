import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('Tarjeta')
export class Tarjeta {
  @PrimaryGeneratedColumn({ name: 'id_tarjeta' })
  id_tarjeta: number;

  @Column({ length: 50 })
  codigo: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  saldo: number;

  @Column({ default: true })
  activa: boolean;

  @Column({ name: 'id_usuario' })
  id_usuario: number;

  
  @ManyToOne(() => Usuario, (usuario) => usuario.tarjetas, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
