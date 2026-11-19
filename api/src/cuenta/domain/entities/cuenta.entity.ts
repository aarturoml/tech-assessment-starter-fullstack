export type Naturaleza = 'débito' | 'crédito';
export type Nivel = 'Clase' | 'Grupo' | 'Cuenta' | 'Subcuenta';

export class Cuenta {
  private constructor(
    private readonly codigo: string,
    private readonly nombre: string,
    private readonly nivel: Nivel,
    private readonly padre: string | null,
    private readonly naturaleza: Naturaleza,
    private readonly hijos: string[],
  ) {}

  static create(
    codigo: string,
    nombre: string,
    nivel: Nivel,
    padre: string | null,
    naturaleza: Naturaleza,
    hijos: string[] = [],
  ): Cuenta {
    return new Cuenta(codigo, nombre, nivel, padre, naturaleza, hijos);
  }

  getCodigo() {
    return this.codigo;
  }
  getNombre() {
    return this.nombre;
  }

  getNivel() {
    return this.nivel;
  }

  getPadre() {
    return this.padre;
  }

  getNaturaleza() {
    return this.naturaleza;
  }

  getHijos() {
    return [...this.hijos];
  }

  conHijos(hijos: string[]) {
    return new Cuenta(
      this.codigo,
      this.nombre,
      this.nivel,
      this.padre,
      this.naturaleza,
      [...hijos],
    );
  }

  puedeRecibirMovimientos() {
    return this.hijos.length === 0;
  }

  toJSON() {
    return {
      codigo: this.codigo,
      nombre: this.nombre,
      nivel: this.nivel,
      padre: this.padre,
      naturaleza: this.naturaleza,
      hijos: [...this.hijos],
      puedeRecibirMovimientos: this.puedeRecibirMovimientos(),
    };
  }
}
