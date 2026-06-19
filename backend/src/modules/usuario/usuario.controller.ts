import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './entities/usuario.entity';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}


  @Post()
  create(@Body() usuario: CrearUsuarioDto): Promise<Usuario> {
    return this.usuarioService.crearUsuarios(usuario);
  }

  
  @Get()
  findAll(): Promise<Usuario[]> {
    return this.usuarioService.obtenerUsuarios();
  }

 
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Usuario> {
    return this.usuarioService.obtenerUsuarioPorId(id);
  }

  
  @Put(':id')
  update(@Param('id') id: string, @Body() usuario: Usuario): Promise<Usuario> {
    return this.usuarioService.actualizarUsuario(id, usuario);
  }

  
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.usuarioService.eliminarUsuario(id);
  }
}