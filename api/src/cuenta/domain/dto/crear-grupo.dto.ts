import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CrearGrupoDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}$/, { message: 'El código de un grupo debe tener 2 dígitos' })
  public codigo!: string;
  @IsString()
  @IsNotEmpty()
  public nombre!: string;
}
