import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Tarjeta } from '../../tarjeta/entities/tarjeta.entity';

@Entity('Usuario')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id_usuario: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ length: 20, unique: true })
  dni: string;

  @Column({ type: 'date', name: 'fecha_nacimiento' })
  fecha_nacimiento: Date;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 50 })
  rol: string;

  
  @OneToMany(() => Tarjeta, (tarjeta) => tarjeta.usuario)
  tarjetas: Tarjeta[];
}
