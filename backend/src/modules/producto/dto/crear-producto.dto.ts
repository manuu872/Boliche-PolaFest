import { IsInt, IsNumber, IsString } from 'class-validator';

export class CrearProductoDto {
    @IsString()
    nombre: string;

    @IsNumber()
    precio: number;

    @IsInt()
    stock?: number;

    @IsString()
    tipo: string;
}