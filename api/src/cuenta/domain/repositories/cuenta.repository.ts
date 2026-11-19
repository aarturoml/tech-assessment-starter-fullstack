import { CrearClaseDto } from '../dto/crear-clase.dto.js';
import { CrearGrupoDto } from '../dto/crear-grupo.dto.js';
import { CrearSubCuentaDto } from '../dto/crear-sub-cuenta.dto.js';
import { Cuenta } from '../entities/cuenta.entity.js';

export interface CuentaRepository {
  crearClase(cuenta: CrearClaseDto): Promise<Cuenta>;
  crearGrupo(cuenta: CrearGrupoDto): Promise<Cuenta>;
  crearSubCuenta(cuenta: CrearSubCuentaDto): Promise<Cuenta>;
}
