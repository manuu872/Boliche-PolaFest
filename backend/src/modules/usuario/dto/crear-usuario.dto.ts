import { IsInt, IsEmail, IsString, IsDate, IsNumber } from "class-validator";

export class CrearUsuarioDto {
    @IsString()
    nombre: string;

    @IsString()
    apellido: string;

    @IsNumber()
    dni: string;

    @IsString() @IsDate()
    fecha_nacimiento: Date;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    rol: string;
}