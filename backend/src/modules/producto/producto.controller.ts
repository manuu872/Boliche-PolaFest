import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from './entities/producto.entity';
import { CrearProductoDto } from './dto/crear-producto.dto';

@Controller('productos') 
export class ProductoController {
constructor(private readonly productoService: ProductoService) {}

  
  @Post()
  create(@Body() dto: CrearProductoDto): Promise<Producto> {
    return this.productoService.crearProductos(dto);
  }
  
  @Get()
  findAll(): Promise<Producto[]> {
    return this.productoService.obtenerProductos();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Producto> {
    return this.productoService.obtenerProductoPorId(id);
  }

  
  @Put(':id')
  update(@Param('id') id: string, @Body() usuario: Producto): Promise<Producto> {
    return this.productoService.actualizarProducto(id, usuario);
  }
 
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.productoService.eliminarProducto(id);
  }


}