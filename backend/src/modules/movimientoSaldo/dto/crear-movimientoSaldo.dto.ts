import { IsDateString, IsInt, IsNumber, IsString } from 'class-validator';

export class CrearMovimientoSaldoDto {
    @IsString()
    tipo: string; 

    @IsNumber()
    monto: number;

    @IsDateString()
    fecha: Date;

    @IsInt()
    id_tarjeta: number;
}