import { Module } from '@nestjs/common';
import { CuentaController } from './cuenta.controller.js';
import { CuentaService } from './cuenta.service.js';
import { CUENTA_REPOSITORY } from './infrastruture/repositories/repository.symbol.js';
import { InMemoryRepository } from './infrastruture/repositories/In-Memory.repository.js';
import { CrearClaseUseCase } from './application/use-cases/crear-clase.use-case.js';
import { CuentaRepository } from './domain/repositories/cuenta.repository.js';
import { CrearGrupoUseCase } from './application/use-cases/crear-grupo.use-case.js';

@Module({
  controllers: [CuentaController],
  providers: [
    CuentaService,
    {
      provide: CUENTA_REPOSITORY,
      useClass: InMemoryRepository,
    },
    {
      provide: CrearClaseUseCase,
      useFactory: (cuentaRepository: CuentaRepository) =>
        new CrearClaseUseCase(cuentaRepository),
      inject: [CUENTA_REPOSITORY],
    },
    {
      provide: CUENTA_REPOSITORY,
      useClass: InMemoryRepository,
    },
    {
      provide: CrearGrupoUseCase,
      useFactory: (cuentaRepository: CuentaRepository) =>
        new CrearGrupoUseCase(cuentaRepository),
      inject: [CUENTA_REPOSITORY],
    },
  ],
})
export class CuentaModule {}
