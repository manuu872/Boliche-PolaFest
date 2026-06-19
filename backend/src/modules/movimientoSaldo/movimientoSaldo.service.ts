import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimientoSaldo } from './entities/movimientoSaldo.entity';
import { CrearMovimientoSaldoDto } from './dto/crear-movimientoSaldo.dto';

@Injectable()
export class MovimientoSaldoService {
    constructor(
        @InjectRepository(MovimientoSaldo)
        private usersRepository: Repository<MovimientoSaldo>,
    ) {}

    async obtenerMovimietoSaldo(): Promise<MovimientoSaldo[]> {
        const movimientoSaldo = await this.usersRepository.find();
        return movimientoSaldo;
    }

    async crearMovimientoSaldo(movimientoSaldo: CrearMovimientoSaldoDto){
        const nuevoMovimientoSaldo = new MovimientoSaldo();
        nuevoMovimientoSaldo.fecha = new Date(); 
        nuevoMovimientoSaldo.tipo = movimientoSaldo.tipo;
        nuevoMovimientoSaldo.monto = movimientoSaldo.monto;
        nuevoMovimientoSaldo.id_tarjeta = movimientoSaldo.id_tarjeta;
        await this.usersRepository.save(nuevoMovimientoSaldo);
        return nuevoMovimientoSaldo;
    }

    async eliminarConsumo(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }

}