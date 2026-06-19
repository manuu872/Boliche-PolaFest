import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from './entities/evento.entity';
import { CrearEventoDto } from './dto/crear-evento.dto';

@Injectable()
export class EventoService {
    constructor(
        @InjectRepository(Evento)
        private usersRepository: Repository<Evento>,
    ) {}

    async obtenerEventos(): Promise<Evento[]> {
        const evento = await this.usersRepository.find();
        return evento;
    }

    async crearEvento(evento: CrearEventoDto){
        const nuevoEvento = new Evento();
        nuevoEvento.nombre = evento.nombre;
        nuevoEvento.fecha_inicio = evento.fecha_inicio;
        nuevoEvento.fecha_fin = evento.fecha_fin;
        nuevoEvento.max_gente = evento.max_gente;
        if (evento.imagen) nuevoEvento.imagen = evento.imagen;
        await this.usersRepository.save(nuevoEvento);
        return nuevoEvento;
    }

    
        async obtenerEventoPorId(id: string): Promise<Evento> {
            const eventoId = Number(id);
            const evento = await this.usersRepository.findOne({
                where: { id_evento: eventoId },
            });
            if (!evento) {
                throw new Error(`No se encontró el usuario con ID ${eventoId}`);
            }
            return evento;
        }
        
        async actualizarEvento(id: string, evento: Evento): Promise<Evento> {
        const eventoId = Number(id);
      
        await this.usersRepository.update({ id_evento: eventoId }, evento);
      
        const actualizado = await this.usersRepository.findOne({
            where: { id_evento: eventoId },
        });
        if (!actualizado) {
            throw new Error(`No se encontró el usuario con ID ${eventoId}`);
        }
            return actualizado;
        }

    async eliminarEvento(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }

}