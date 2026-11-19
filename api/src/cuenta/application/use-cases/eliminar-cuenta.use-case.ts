import { Inject } from '@nestjs/common';
import type { CuentaRepository } from '../../domain/repositories/cuenta.repository.js';
import { CUENTA_REPOSITORY } from '../../infrastruture/repositories/repository.symbol.js';

export class EliminarCuentaUseCase {
  constructor(@Inject(CUENTA_REPOSITORY) private readonly cuentaRepository: CuentaRepository) {}

  execute(codigo: string): Promise<void> {
    return this.cuentaRepository.eliminar(codigo);
  }
}
