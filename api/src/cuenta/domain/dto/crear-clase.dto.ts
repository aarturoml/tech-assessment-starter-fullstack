import { IsNotEmpty, IsString } from 'class-validator';

export class CrearClaseDto {
  @IsString()
  @IsNotEmpty()
  public codigo: string;
  @IsString()
  @IsNotEmpty()
  public nombre: string;
  @IsString()
  @IsNotEmpty()
  public naturaleza: string;

  constructor(codigo: string, nombre: string, naturaleza: string) {}
}
