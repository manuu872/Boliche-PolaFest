import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private usersRepository: Repository<Usuario>,
    ) {}

    
    async obtenerUsuarios(): Promise<Usuario[]> {
        const usuarios = await this.usersRepository.find();
        return usuarios;
    }
   
    async crearUsuarios(usuario: CrearUsuarioDto){
        const nuevoUsuario = new Usuario();
        nuevoUsuario.nombre = usuario.nombre;
        nuevoUsuario.apellido = usuario.apellido;
        nuevoUsuario.dni = usuario.dni;
        nuevoUsuario.fecha_nacimiento = usuario.fecha_nacimiento;
        nuevoUsuario.email = usuario.email;
        nuevoUsuario.password = usuario.password;
        nuevoUsuario.rol = usuario.rol;
        await this.usersRepository.save(nuevoUsuario);
        return nuevoUsuario;
    }
   
    async obtenerUsuarioPorId(id: string): Promise<Usuario> {
        const usuarioId = Number(id);
        const usuario = await this.usersRepository.findOne({
            where: { id_usuario: usuarioId },
        });
        if (!usuario) {
            throw new Error(`No se encontró el usuario con ID ${usuarioId}`);
        }
        return usuario;
    }
    
    async actualizarUsuario(id: string, usuario: Usuario): Promise<Usuario> {
    const usuarioId = Number(id);
  
    await this.usersRepository.update({ id_usuario: usuarioId }, usuario);
  
    const actualizado = await this.usersRepository.findOne({
        where: { id_usuario: usuarioId },
    });
    if (!actualizado) {
        throw new Error(`No se encontró el usuario con ID ${usuarioId}`);
    }
        return actualizado;
    }
    
    async eliminarUsuario(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}