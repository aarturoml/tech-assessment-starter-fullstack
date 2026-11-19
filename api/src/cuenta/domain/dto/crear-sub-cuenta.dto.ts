import { IsString, IsNotEmpty } from 'class-validator';

export class CrearSubCuentaDto {
  @IsString()
  @IsNotEmpty()
  public codigo: string;
  @IsString()
  @IsNotEmpty()
  public nombre: string;
  constructor(codigo: string, nombre: string) {}
}
