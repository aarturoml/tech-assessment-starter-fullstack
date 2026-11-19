import { CrearClaseDto } from '../../domain/dto/crear-clase.dto.js';
import { CrearCuentaDto } from '../../domain/dto/crear-cuenta.dto.js';
import { CrearGrupoDto } from '../../domain/dto/crear-grupo.dto.js';
import { CrearSubCuentaDto } from '../../domain/dto/crear-sub-cuenta.dto.js';
import { Cuenta, Nivel, Naturaleza } from '../../domain/entities/cuenta.entity.js';
import { CuentaError } from '../../domain/errors/cuenta.errors.js';
import { CuentaRepository } from '../../domain/repositories/cuenta.repository.js';

export class InMemoryRepository implements CuentaRepository {
  private readonly cuentas = new Map<string, Cuenta>();

  async crearClase(input: CrearClaseDto): Promise<Cuenta> {
    return this.crear(input.codigo, input.nombre, 'Clase', null, input.naturaleza);
  }

  async crearGrupo(input: CrearGrupoDto): Promise<Cuenta> {
    return this.crearDescendiente(input.codigo, input.nombre, 'Grupo');
  }

  async crearCuenta(input: CrearCuentaDto): Promise<Cuenta> {
    return this.crearDescendiente(input.codigo, input.nombre, 'Cuenta');
  }

  async crearSubCuenta(input: CrearSubCuentaDto): Promise<Cuenta> {
    return this.crearDescendiente(input.codigo, input.nombre, 'Subcuenta');
  }

  async listar(): Promise<Cuenta[]> {
    return [...this.cuentas.values()].sort((a, b) =>
      a.getCodigo().localeCompare(b.getCodigo(), undefined, { numeric: true }),
    );
  }

  async buscarPorCodigo(codigo: string): Promise<Cuenta | undefined> {
    return this.cuentas.get(codigo);
  }

  async eliminar(codigo: string): Promise<void> {
    const cuenta = this.getRequired(codigo);
    if (cuenta.getHijos().length > 0) {
      throw new CuentaError(
        'CUENTA_CON_HIJOS',
        `No se puede eliminar ${codigo} porque tiene cuentas hijas`,
      );
    }
    this.cuentas.delete(codigo);
    if (cuenta.getPadre()) {
      const padre = this.cuentas.get(cuenta.getPadre()!);
      if (padre) {
        this.cuentas.set(
          padre.getCodigo(),
          padre.conHijos(padre.getHijos().filter((hijo) => hijo !== codigo)),
        );
      }
    }
  }

  private async crearDescendiente(
    codigo: string,
    nombre: string,
    nivel: Exclude<Nivel, 'Clase'>,
  ): Promise<Cuenta> {
    this.validarCodigo(codigo, nivel);
    const padre = this.obtenerCodigoPadre(codigo);
    const cuentaPadre = this.getRequired(padre, 'PADRE_INEXISTENTE');
    return this.crear(
      codigo,
      nombre,
      nivel,
      padre,
      cuentaPadre.getNaturaleza(),
    );
  }

  private crear(
    codigo: string,
    nombre: string,
    nivel: Nivel,
    padre: string | null,
    naturaleza: Naturaleza,
  ): Cuenta {
    this.validarCodigo(codigo, nivel);
    if (!nombre.trim()) {
      throw new CuentaError('CODIGO_INVALIDO', 'El nombre es obligatorio');
    }
    if (this.cuentas.has(codigo)) {
      throw new CuentaError('CUENTA_DUPLICADA', `La cuenta ${codigo} ya existe`);
    }

    const cuenta = Cuenta.create(codigo, nombre.trim(), nivel, padre, naturaleza);
    this.cuentas.set(codigo, cuenta);
    if (padre) {
      const cuentaPadre = this.cuentas.get(padre);
      if (cuentaPadre) {
        this.cuentas.set(
          padre,
          cuentaPadre.conHijos([...cuentaPadre.getHijos(), codigo]),
        );
      }
    }
    return cuenta;
  }

  private validarCodigo(codigo: string, nivel: Nivel): void {
    const longitudes: Record<Nivel, number> = {
      Clase: 1,
      Grupo: 2,
      Cuenta: 4,
      Subcuenta: 6,
    };
    if (
      typeof codigo !== 'string' ||
      !new RegExp(`^\\d{${longitudes[nivel]}}$`).test(codigo)
    ) {
      throw new CuentaError(
        'CODIGO_INVALIDO',
        `El código de ${nivel.toLowerCase()} debe tener ${longitudes[nivel]} dígito(s) numérico(s)`,
      );
    }
  }

  private obtenerCodigoPadre(codigo: string): string {
    const longitudPadre = codigo.length === 2 ? 1 : codigo.length === 4 ? 2 : 4;
    return codigo.slice(0, longitudPadre);
  }

  private getRequired(
    codigo: string,
    errorCode: 'CUENTA_INEXISTENTE' | 'PADRE_INEXISTENTE' = 'CUENTA_INEXISTENTE',
  ): Cuenta {
    const cuenta = this.cuentas.get(codigo);
    if (!cuenta) {
      throw new CuentaError(
        errorCode,
        errorCode === 'PADRE_INEXISTENTE'
          ? `No existe la cuenta padre ${codigo}`
          : `No existe la cuenta ${codigo}`,
      );
    }
    return cuenta;
  }
}
