import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EventoService } from './evento.service';
import { Evento } from './entities/evento.entity';
import { CrearEventoDto } from './dto/crear-evento.dto';

@Controller('eventos')
export class EventoController {
constructor(private readonly eventoService: EventoService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads/eventos',
      filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
        cb(null, unique + extname(file.originalname));
      },
    }),
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif|webp)/)) {
        return cb(new Error('Solo se permiten imágenes'), false);
      }
      cb(null, true);
    },
  }))
  uploadImagen(@UploadedFile() file: Express.Multer.File) {
    return { filename: file.filename };
  }

  @Post()
  create(@Body() dto: CrearEventoDto): Promise<Evento> {
    return this.eventoService.crearEvento(dto);
  }
  
  @Get()
  findAll(): Promise<Evento[]> {
    return this.eventoService.obtenerEventos();
  }

  
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Evento> {
    return this.eventoService.obtenerEventoPorId(id);
  }
    
  
  @Put(':id')
  update(@Param('id') id: string, @Body() usuario: Evento): Promise<Evento> {
    return this.eventoService.actualizarEvento(id, usuario);
  }
  
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.eventoService.eliminarEvento(id);
  }
}