import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CrearProductoDto } from './dto/crear-producto.dto';

@Injectable()
export class ProductoService {
    constructor(
        @InjectRepository(Producto)
        private usersRepository: Repository<Producto>,
    ) {}

    async obtenerProductos(): Promise<Producto[]> {
        const producto = await this.usersRepository.find();
        return producto;
    }

    async crearProductos(producto: CrearProductoDto): Promise<Producto> {
        const nuevoProducto = new Producto();
        nuevoProducto.nombre = producto.nombre;
        nuevoProducto.precio = producto.precio;
        nuevoProducto.stock = producto.stock || 0;
        nuevoProducto.tipo = producto.tipo;
        await this.usersRepository.save(nuevoProducto);
        return nuevoProducto;
    }
    
    
    async obtenerProductoPorId(id: string): Promise<Producto> {
        const productoId = Number(id);
        const producto = await this.usersRepository.findOne({
            where: { id_producto: productoId },
        });
        if (!producto) {
            throw new Error(`No se encontró el usuario con ID ${productoId}`);
        }
        return producto;
    }
    
    async actualizarProducto(id: string, producto: Producto): Promise<Producto> {
        const productoId = Number(id);
        await this.usersRepository.update({ id_producto: productoId }, producto);
            const actualizado = await this.usersRepository.findOne({
            where: { id_producto: productoId },
        });
        if (!actualizado) {
            throw new Error(`No se encontró el usuario con ID ${productoId}`);
        }
        return actualizado;
    }
    // 
    async eliminarProducto(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }

}