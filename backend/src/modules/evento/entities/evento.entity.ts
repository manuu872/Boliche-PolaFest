import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Evento')
export class Evento {
    @PrimaryGeneratedColumn({ name: 'id_evento' })
    id_evento: number;

    @Column({ length: 150 })
    nombre: string;

    @Column({ type: 'datetime', name: 'fecha_inicio' })
    fecha_inicio: Date;

    @Column({ type: 'datetime', name: 'fecha_fin' })
    fecha_fin: Date;

    @Column({ type: 'int', name: 'max_gente' })
    max_gente: number;

    @Column({ length: 255, nullable: true })
    imagen: string;
}