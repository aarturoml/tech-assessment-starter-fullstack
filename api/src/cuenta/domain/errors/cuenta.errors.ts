export type CuentaErrorCode =
  | 'CODIGO_INVALIDO'
  | 'CUENTA_DUPLICADA'
  | 'PADRE_INEXISTENTE'
  | 'CUENTA_INEXISTENTE'
  | 'CUENTA_CON_HIJOS'
  | 'NATURALEZA_INVALIDA';

export class CuentaError extends Error {
  constructor(
    public readonly code: CuentaErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'CuentaError';
  }
}
