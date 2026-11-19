import { IsIn, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CrearCuentaCatalogoDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{1,6}$/, { message: 'El código debe contener entre 1 y 6 dígitos' })
  codigo!: string;

  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsOptional()
  @IsIn(['débito', 'crédito'])
  naturaleza?: 'débito' | 'crédito';
}
