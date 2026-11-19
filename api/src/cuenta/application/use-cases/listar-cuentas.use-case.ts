import { Inject } from '@nestjs/common';
import { Cuenta } from '../../domain/entities/cuenta.entity.js';
import type { CuentaRepository } from '../../domain/repositories/cuenta.repository.js';
import { CUENTA_REPOSITORY } from '../../infrastruture/repositories/repository.symbol.js';

export class ListarCuentasUseCase {
  constructor(@Inject(CUENTA_REPOSITORY) private readonly cuentaRepository: CuentaRepository) {}

  execute(): Promise<Cuenta[]> {
    return this.cuentaRepository.listar();
  }
}
