import { Body, Controller, Post } from '@nestjs/common';
import { CrearClaseDto } from './domain/dto/crear-clase.dto.js';
import { CrearClaseUseCase } from './application/use-cases/crear-clase.use-case.js';
import { CrearGrupoUseCase } from './application/use-cases/crear-grupo.use-case.js';
import { CrearSubCuentaUseCase } from './application/use-cases/crear-subCuenta.use-case.js';
import { CrearGrupoDto } from './domain/dto/crear-grupo.dto.js';

@Controller('cuenta')
export class CuentaController {
  constructor(
    private readonly crearClaseUseCase: CrearClaseUseCase,
    private readonly crearGrupoUseCase: CrearGrupoUseCase,
    //private readonly crearSubCuentaUseCase: CrearSubCuentaUseCase,
  ) {}

  @Post('crear-clase')
  crearClase(@Body() input: CrearClaseDto) {
    return this.crearClaseUseCase.execute(input);
  }
  @Post('crear-grupo')
  crearGrupo(@Body() input: CrearGrupoDto) {
    return this.crearGrupoUseCase.execute(input);
  }
}
