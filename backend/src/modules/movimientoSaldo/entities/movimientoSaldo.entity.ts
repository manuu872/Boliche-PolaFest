import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('MovimientoSaldo')
export class MovimientoSaldo {
    @PrimaryGeneratedColumn({ name: 'id_movimiento' })
    id_movimiento: number;

    @Column({ length: 50 })
    tipo: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    monto: number;

    @Column({ type: 'datetime' })
    fecha: Date;

    @Column({ type: 'int' })
    id_tarjeta: number;
}