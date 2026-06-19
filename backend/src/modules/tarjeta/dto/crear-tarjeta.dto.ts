import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CrearTarjetaDto {
    @IsString()
    codigo: string;

    @IsNumber()
    @IsOptional() 
    saldo?: number;

    @IsBoolean()
    @IsOptional() 
    activa?: boolean;

    @IsNumber()
    id_usuario: number;
}