import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarjeta } from './entities/tarjeta.entity';
import { CrearTarjetaDto } from './dto/crear-tarjeta.dto';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class TarjetaService {
  constructor(
    @InjectRepository(Tarjeta)
    private tarjetaRepo: Repository<Tarjeta>,

    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  
  async crearTarjetas(dto: CrearTarjetaDto): Promise<Tarjeta> {
    const nueva = this.tarjetaRepo.create(dto);
    return await this.tarjetaRepo.save(nueva);
  }

 
  async crearTarjetaParaUsuario(usuarioId: number): Promise<Tarjeta> {
    const usuario = await this.usuarioRepo.findOne({
      where: { id_usuario: usuarioId },
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const tarjeta = this.tarjetaRepo.create({
      codigo: `TARJ-${usuarioId.toString().padStart(4, '0')}`,
      saldo: 0,
      activa: true,
      id_usuario: usuarioId,
    });

    return await this.tarjetaRepo.save(tarjeta);
  }

  
  async obtenerTarjetas(): Promise<Tarjeta[]> {
    return await this.tarjetaRepo.find({ relations: ['usuario'] });
  }

  
  async obtenerTarjetaPorId(id: string): Promise<Tarjeta> {
    const tarjeta = await this.tarjetaRepo.findOne({
      where: { id_tarjeta: Number(id) },
      relations: ['usuario'],
    });

    if (!tarjeta) {
      throw new NotFoundException('Tarjeta no encontrada');
    }

    return tarjeta;
  }

 
  async obtenerPorCodigo(codigo: string): Promise<Tarjeta> {
    const tarjeta = await this.tarjetaRepo.findOne({
      where: { codigo },
      relations: ['usuario'],
    });

    if (!tarjeta) {
      throw new NotFoundException('Tarjeta no encontrada');
    }

    return tarjeta;
  }

 
  async actualizarTarjeta(id: string, datos: Partial<Tarjeta>): Promise<Tarjeta> {
    const tarjeta = await this.tarjetaRepo.findOne({
      where: { id_tarjeta: Number(id) },
    });

    if (!tarjeta) throw new NotFoundException('Tarjeta no encontrada');

    Object.assign(tarjeta, datos);
    return await this.tarjetaRepo.save(tarjeta);
  }

 
  async eliminarTarjeta(id: string): Promise<void> {
    const tarjeta = await this.tarjetaRepo.findOne({
      where: { id_tarjeta: Number(id) },
    });

    if (!tarjeta) throw new NotFoundException('Tarjeta no encontrada');

    await this.tarjetaRepo.remove(tarjeta);
  }

  
  async descontarSaldo(codigo: string, monto: number): Promise<Tarjeta> {
    const tarjeta = await this.tarjetaRepo.findOne({ where: { codigo } });

    if (!tarjeta) throw new NotFoundException('Tarjeta no encontrada');
    if (tarjeta.saldo < monto) throw new Error('Saldo insuficiente');

    tarjeta.saldo -= monto;
    return await this.tarjetaRepo.save(tarjeta);
  }

  
 async cargarSaldo(id: number, monto: number): Promise<Tarjeta> {
  const tarjeta = await this.tarjetaRepo.findOne({
    where: { id_tarjeta: id },
  });

  if (!tarjeta) throw new NotFoundException('Tarjeta no encontrada');

  tarjeta.saldo = Number(tarjeta.saldo) + Number(monto); 
  return await this.tarjetaRepo.save(tarjeta); 
}


 
  async toggleActiva(id: number): Promise<Tarjeta> {
    const tarjeta = await this.tarjetaRepo.findOne({
      where: { id_tarjeta: id },
    });

    if (!tarjeta) throw new NotFoundException('Tarjeta no encontrada');

    tarjeta.activa = !tarjeta.activa;
    return await this.tarjetaRepo.save(tarjeta);
  }
}
