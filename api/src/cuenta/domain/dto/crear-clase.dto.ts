import { IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CrearClaseDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d$/, { message: 'El código de una clase debe tener 1 dígito' })
  public codigo!: string;
  @IsString()
  @IsNotEmpty()
  public nombre!: string;
  @IsString()
  @IsNotEmpty()
  @IsIn(['débito', 'crédito'])
  public naturaleza!: 'débito' | 'crédito';
}
