import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Producto')
export class Producto {
    @PrimaryGeneratedColumn({ name: 'id_producto' })
    id_producto: number;

    @Column({ length: 150 })
    nombre: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio: number;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ length: 100 })
    tipo: string;
}