import { IsNotEmpty, IsSemVer, IsString } from 'class-validator';

export class CrearGrupoDto {
  @IsString()
  @IsNotEmpty()
  public codigo: string;
  @IsString()
  @IsNotEmpty()
  public nombre: string;
  constructor(codigo: string, nombre: string) {}
}
