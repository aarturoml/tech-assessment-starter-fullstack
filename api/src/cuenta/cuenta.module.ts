import { Module } from '@nestjs/common';
import { CuentaController } from './cuenta.controller.js';
import { CUENTA_REPOSITORY } from './infrastruture/repositories/repository.symbol.js';
import { InMemoryRepository } from './infrastruture/repositories/In-Memory.repository.js';
import { CrearClaseUseCase } from './application/use-cases/crear-clase.use-case.js';
import { CrearGrupoUseCase } from './application/use-cases/crear-grupo.use-case.js';
import { CrearCuentaUseCase } from './application/use-cases/crear-cuenta.use-case.js';
import { CrearSubCuentaUseCase } from './application/use-cases/crear-subCuenta.use-case.js';
import { ListarCuentasUseCase } from './application/use-cases/listar-cuentas.use-case.js';
import { EliminarCuentaUseCase } from './application/use-cases/eliminar-cuenta.use-case.js';

@Module({
  controllers: [CuentaController],
  providers: [
    {
      provide: CUENTA_REPOSITORY,
      useClass: InMemoryRepository,
    },
    CrearClaseUseCase,
    CrearGrupoUseCase,
    CrearCuentaUseCase,
    CrearSubCuentaUseCase,
    ListarCuentasUseCase,
    EliminarCuentaUseCase,
  ],
})
export class CuentaModule {}
