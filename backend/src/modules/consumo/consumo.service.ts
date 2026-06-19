import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consumo } from './entities/consumo.entity';
import { CrearConsumoDto } from './dto/crear-cosumo.dto';

@Injectable()
export class ConsumoService {
    constructor(
        @InjectRepository(Consumo)
        private usersRepository: Repository<Consumo>,
    ) {}

    async obtenerConsumos(): Promise<Consumo[]> {
        return this.usersRepository.find({ order: { fecha: 'DESC' } });
    }

    async obtenerConsumosPorUsuario(id_usuario: number): Promise<Consumo[]> {
        return this.usersRepository.find({
            where: { id_usuario },
            order: { fecha: 'DESC' },
        });
    }

    async crearConsumos(consumo: CrearConsumoDto){
        const nuevoConsumo = new Consumo();
        nuevoConsumo.fecha = new Date(); 
        nuevoConsumo.monto = consumo.monto;
        nuevoConsumo.id_usuario = consumo.id_usuario;
        nuevoConsumo.id_evento = consumo.id_evento;
        await this.usersRepository.save(nuevoConsumo);
        return nuevoConsumo;
    }

    async eliminarConsumo(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }

}