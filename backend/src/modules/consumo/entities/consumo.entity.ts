import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Consumo')
export class Consumo {
    @PrimaryGeneratedColumn({ name: 'id_consumo' })
    id_consumo: number;

    @Column({ type: 'datetime' })
    fecha: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    monto: number;

    @Column({ type: 'int' })
    id_usuario: number;

    @Column({ type: 'int' })
    id_evento: number;
}