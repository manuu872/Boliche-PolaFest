import { IsDateString, IsInt, IsNumber } from 'class-validator';

export class CrearConsumoDto {
    @IsDateString()
    fecha: Date;

    @IsNumber()
    monto: number;

    @IsInt()
    id_usuario: number;

    @IsInt()
    id_evento: number;
}