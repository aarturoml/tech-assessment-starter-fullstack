export class Cuenta {
  private constructor(
    private readonly codigo: string,
    private readonly nombre: string,
    private readonly nivel: string,
    private readonly padre: string,
    private readonly naturaleza: string,
    private readonly hijos: string[],
  ) {}

  static create(
    codigo: string,
    nombre: string,
    nivel?: string,
    padre?: string,
    naturaleza?: string,
    hijos?: string[],
  ) {
    return new Cuenta(codigo, nombre, nivel!, padre!, naturaleza!, hijos!);
  }

  getCodigo() {
    return this.codigo;
  }
  getNombre() {
    return this.nombre;
  }
  getNaturaleza() {
    return this.naturaleza;
  }
}
