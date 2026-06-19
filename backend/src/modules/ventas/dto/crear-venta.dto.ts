import { IsArray, IsNumber, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductoVentaDto {
  @IsNumber()
  @IsNotEmpty()
  id_producto: number;

  @IsNumber()
  @IsNotEmpty()
  cantidad: number;

  @IsNumber()
  @IsNotEmpty()
  subtotal: number;
}

export class CrearVentaDto {
  @IsNumber()
  @IsNotEmpty()
  id_tarjeta: number;

  @IsNumber()
  @IsNotEmpty()
  id_evento: number; 

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoVentaDto)
  productos: ProductoVentaDto[];
}
