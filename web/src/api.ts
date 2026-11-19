const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export function apiUrl(ruta: string): string {
  return `${base}${ruta}`
}

export type Naturaleza = 'débito' | 'crédito'

export type Cuenta = {
  codigo: string
  nombre: string
  nivel: 'Clase' | 'Grupo' | 'Cuenta' | 'Subcuenta'
  padre: string | null
  naturaleza: Naturaleza
  hijos: string[]
  puedeRecibirMovimientos: boolean
}

async function leerRespuesta<T>(respuesta: Response): Promise<T> {
  const cuerpo = await respuesta.json().catch(() => null)
  if (!respuesta.ok) {
    const mensaje =
      typeof cuerpo?.message === 'string'
        ? cuerpo.message
        : Array.isArray(cuerpo?.message)
          ? cuerpo.message.join(', ')
          : 'No se pudo completar la operación'
    throw new Error(mensaje)
  }
  return cuerpo as T
}

export async function listarCuentas(): Promise<Cuenta[]> {
  return leerRespuesta<Cuenta[]>(await fetch(apiUrl('/cuenta')))
}

export async function crearCuenta(input: {
  codigo: string
  nombre: string
  naturaleza?: Naturaleza
}): Promise<Cuenta> {
  return leerRespuesta<Cuenta>(
    await fetch(apiUrl('/cuenta'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
  )
}

export async function eliminarCuenta(codigo: string): Promise<void> {
  await leerRespuesta<{ mensaje: string }>(
    await fetch(apiUrl(`/cuenta/${codigo}`), { method: 'DELETE' }),
  )
}
