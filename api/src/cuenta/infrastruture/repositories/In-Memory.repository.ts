import { CrearClaseDto } from '../../domain/dto/crear-clase.dto.js';
import { CrearGrupoDto } from '../../domain/dto/crear-grupo.dto.js';
import { CrearSubCuentaDto } from '../../domain/dto/crear-sub-cuenta.dto.js';
import { Cuenta } from '../../domain/entities/cuenta.entity.js';
import { CuentaRepository } from '../../domain/repositories/cuenta.repository.js';

export class InMemoryRepository implements CuentaRepository {
  private cuentas: Cuenta[] = [];

  async crearClase(cuenta: CrearClaseDto): Promise<Cuenta> {
    // validaciones
    const cuentaExist = this.cuentas.find((c: any) => {
      c.getCodigo == cuenta.codigo;
    });
    if (cuentaExist) new Error('La cuenta ya existe');

    const cuentaCrear = Cuenta.create(
      cuenta.codigo,
      cuenta.nombre,
      cuenta.naturaleza,
    );

    this.cuentas.push(cuentaCrear);
    return cuentaCrear;
  }
  async crearGrupo(cuenta: CrearGrupoDto): Promise<Cuenta> {
    // validaciones
    const padre = cuenta.codigo.at(0);
    const cuentaExist = this.cuentas.find((c: any) => {
      c.getCodigo == padre;
    });

    if (!cuentaExist) throw new Error('No existe un padre');
    const cuentaCrear = Cuenta.create(
      cuenta.codigo,
      cuenta.nombre,
      undefined,
      padre,
    );

    this.cuentas.push(cuentaCrear);
    return cuentaCrear;
  }
  crearSubCuenta(cuenta: CrearSubCuentaDto): Promise<Cuenta> {
    throw new Error('Method not implemented.');
  }
}
