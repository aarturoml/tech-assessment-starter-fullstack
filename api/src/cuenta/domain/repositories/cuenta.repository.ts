import { CrearClaseDto } from '../dto/crear-clase.dto.js';
import { CrearGrupoDto } from '../dto/crear-grupo.dto.js';
import { CrearCuentaDto } from '../dto/crear-cuenta.dto.js';
import { CrearSubCuentaDto } from '../dto/crear-sub-cuenta.dto.js';
import { Cuenta } from '../entities/cuenta.entity.js';

export interface CuentaRepository {
  crearClase(cuenta: CrearClaseDto): Promise<Cuenta>;
  crearGrupo(cuenta: CrearGrupoDto): Promise<Cuenta>;
  crearCuenta(cuenta: CrearCuentaDto): Promise<Cuenta>;
  crearSubCuenta(cuenta: CrearSubCuentaDto): Promise<Cuenta>;
  listar(): Promise<Cuenta[]>;
  buscarPorCodigo(codigo: string): Promise<Cuenta | undefined>;
  eliminar(codigo: string): Promise<void>;
}
