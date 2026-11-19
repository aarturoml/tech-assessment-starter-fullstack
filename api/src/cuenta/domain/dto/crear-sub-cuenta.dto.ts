import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CrearSubCuentaDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'El código de una subcuenta debe tener 6 dígitos' })
  public codigo!: string;
  @IsString()
  @IsNotEmpty()
  public nombre!: string;
}
