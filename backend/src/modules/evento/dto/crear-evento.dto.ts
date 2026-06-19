import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CrearEventoDto {
    @IsString()
    nombre: string;

    @IsDateString()
    fecha_inicio: Date;

    @IsDateString()
    fecha_fin: Date;

    @IsInt()
    max_gente: number;

    @IsOptional()
    @IsString()
    imagen?: string;
}