import { Inject } from '@nestjs/common';
import { Cuenta } from '../../domain/entities/cuenta.entity.js';
import { CrearCuentaDto } from '../../domain/dto/crear-cuenta.dto.js';
import type { CuentaRepository } from '../../domain/repositories/cuenta.repository.js';
import { CUENTA_REPOSITORY } from '../../infrastruture/repositories/repository.symbol.js';

export class CrearCuentaUseCase {
  constructor(@Inject(CUENTA_REPOSITORY) private readonly cuentaRepository: CuentaRepository) {}

  execute(input: CrearCuentaDto): Promise<Cuenta> {
    return this.cuentaRepository.crearCuenta(input);
  }
}
