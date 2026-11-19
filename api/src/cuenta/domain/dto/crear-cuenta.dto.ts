import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CrearCuentaDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}$/, { message: 'El código de una cuenta debe tener 4 dígitos' })
  codigo!: string;

  @IsString()
  @IsNotEmpty()
  nombre!: string;
}
