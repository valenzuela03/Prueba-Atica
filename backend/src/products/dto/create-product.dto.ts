import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(150, { message: 'El nombre no puede pasar de 150 caracteres' })
  name: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un numero valido' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El stock debe ser un numero entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number;

  @IsString({ message: 'La categoría debe ser texto' })
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  @MaxLength(100, { message: 'La categoría no puede pasar de 100 caracteres' })
  category: string;

  @IsOptional()
  @IsBoolean({ message: 'is_active debe ser true o false' })
  is_active?: boolean;
}
