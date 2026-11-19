import { Cuenta } from '../../domain/entities/cuenta.entity.js';
import { CuentaRepository } from '../../domain/repositories/cuenta.repository.js';

export class CrearClaseUseCase {
  constructor(private cuentaRepository: CuentaRepository) {}

  async execute(input: {
    codigo: string;
    nombre: string;
    naturaleza: string;
  }): Promise<Cuenta> {
    return this.cuentaRepository.crearClase(input);
  }
}
