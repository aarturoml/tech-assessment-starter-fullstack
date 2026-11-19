import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CrearClaseDto } from './domain/dto/crear-clase.dto.js';
import { CrearCuentaCatalogoDto } from './domain/dto/crear-cuenta-catalogo.dto.js';
import { CrearCuentaDto } from './domain/dto/crear-cuenta.dto.js';
import { CrearGrupoDto } from './domain/dto/crear-grupo.dto.js';
import { CrearSubCuentaDto } from './domain/dto/crear-sub-cuenta.dto.js';
import { CrearClaseUseCase } from './application/use-cases/crear-clase.use-case.js';
import { CrearGrupoUseCase } from './application/use-cases/crear-grupo.use-case.js';
import { CrearCuentaUseCase } from './application/use-cases/crear-cuenta.use-case.js';
import { CrearSubCuentaUseCase } from './application/use-cases/crear-subCuenta.use-case.js';
import { EliminarCuentaUseCase } from './application/use-cases/eliminar-cuenta.use-case.js';
import { ListarCuentasUseCase } from './application/use-cases/listar-cuentas.use-case.js';
import { CuentaError } from './domain/errors/cuenta.errors.js';
import type { CuentaRepository } from './domain/repositories/cuenta.repository.js';
import { CUENTA_REPOSITORY } from './infrastruture/repositories/repository.symbol.js';

@Controller('cuenta')
export class CuentaController {
  constructor(
    private readonly crearClaseUseCase: CrearClaseUseCase,
    private readonly crearGrupoUseCase: CrearGrupoUseCase,
    private readonly crearCuentaUseCase: CrearCuentaUseCase,
    private readonly crearSubCuentaUseCase: CrearSubCuentaUseCase,
    private readonly listarCuentasUseCase: ListarCuentasUseCase,
    private readonly eliminarCuentaUseCase: EliminarCuentaUseCase,
    @Inject(CUENTA_REPOSITORY)
    private readonly cuentaRepository: CuentaRepository,
  ) {}

  @Get()
  listar() {
    return this.listarCuentasUseCase.execute();
  }

  @Get(':codigo')
  async buscar(@Param('codigo') codigo: string) {
    const cuenta = await this.cuentaRepository.buscarPorCodigo(codigo);
    if (!cuenta) {
      throw new NotFoundException(`No existe la cuenta ${codigo}`);
    }
    return cuenta;
  }

  @Post()
  crear(@Body() input: CrearCuentaCatalogoDto) {
    if (input.codigo.length === 1) {
      if (!input.naturaleza) {
        throw new BadRequestException(
          'La naturaleza es obligatoria para una clase',
        );
      }
      return this.ejecutar(() =>
        this.crearClaseUseCase.execute({
          codigo: input.codigo,
          nombre: input.nombre,
          naturaleza: input.naturaleza!,
        }),
      );
    }
    if (input.naturaleza) {
      throw new BadRequestException(
        'La naturaleza solo se define para las clases',
      );
    }
    if (input.codigo.length === 2) {
      return this.ejecutar(() =>
        this.crearGrupoUseCase.execute({ codigo: input.codigo, nombre: input.nombre }),
      );
    }
    if (input.codigo.length === 4) {
      return this.ejecutar(() =>
        this.crearCuentaUseCase.execute({ codigo: input.codigo, nombre: input.nombre }),
      );
    }
    return this.ejecutar(() =>
      this.crearSubCuentaUseCase.execute({ codigo: input.codigo, nombre: input.nombre }),
    );
  }

  @Post('crear-clase')
  crearClase(@Body() input: CrearClaseDto) {
    return this.ejecutar(() => this.crearClaseUseCase.execute(input));
  }

  @Post('crear-grupo')
  crearGrupo(@Body() input: CrearGrupoDto) {
    return this.ejecutar(() => this.crearGrupoUseCase.execute(input));
  }

  @Post('crear-cuenta')
  crearCuenta(@Body() input: CrearCuentaDto) {
    return this.ejecutar(() => this.crearCuentaUseCase.execute(input));
  }

  @Post('crear-subcuenta')
  crearSubCuenta(@Body() input: CrearSubCuentaDto) {
    return this.ejecutar(() => this.crearSubCuentaUseCase.execute(input));
  }

  @Delete(':codigo')
  eliminar(@Param('codigo') codigo: string) {
    return this.ejecutar(async () => {
      await this.eliminarCuentaUseCase.execute(codigo);
      return { mensaje: `La cuenta ${codigo} fue eliminada` };
    });
  }

  private async ejecutar<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (!(error instanceof CuentaError)) {
        throw error;
      }
      if (error.code === 'CUENTA_DUPLICADA') {
        throw new ConflictException(error.message);
      }
      if (
        error.code === 'CUENTA_INEXISTENTE' ||
        error.code === 'PADRE_INEXISTENTE'
      ) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }
}
