import { Inject } from '@nestjs/common';
import { Cuenta } from '../../domain/entities/cuenta.entity.js';
import type { CuentaRepository } from '../../domain/repositories/cuenta.repository.js';
import { CUENTA_REPOSITORY } from '../../infrastruture/repositories/repository.symbol.js';

export class CrearClaseUseCase {
  constructor(@Inject(CUENTA_REPOSITORY) private cuentaRepository: CuentaRepository) {}

  async execute(input: { codigo: string; nombre: string; naturaleza: 'débito' | 'crédito' }): Promise<Cuenta> {
    return this.cuentaRepository.crearClase(input);
  }
}
