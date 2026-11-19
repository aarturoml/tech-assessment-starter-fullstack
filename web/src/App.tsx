import { useCallback, useEffect, useState } from 'react'
import { crearCuenta, eliminarCuenta, listarCuentas } from './api'
import type { FormEvent } from 'react'
import type { Cuenta, Naturaleza } from './api'
import './index.css'

const niveles = { '1': 'Clase', '2': 'Grupo', '4': 'Cuenta', '6': 'Subcuenta' } as const

function App() {
  const [cuentas, setCuentas] = useState<Cuenta[]>([])
  const [codigo, setCodigo] = useState('')
  const [nombre, setNombre] = useState('')
  const [naturaleza, setNaturaleza] = useState<Naturaleza>('débito')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const cargarCuentas = useCallback(async () => {
    try {
      setError('')
      setCuentas(await listarCuentas())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar el catálogo')
    }
  }, [])

  useEffect(() => {
    let activo = true
    listarCuentas()
      .then((data) => {
        if (activo) setCuentas(data)
      })
      .catch((e: unknown) => {
        if (activo) setError(e instanceof Error ? e.message : 'No se pudo cargar el catálogo')
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [])

  const nivel = niveles[String(codigo.length) as keyof typeof niveles]

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    try {
      setGuardando(true)
      setMensaje('')
      setError('')
      await crearCuenta({
        codigo,
        nombre,
        ...(codigo.length === 1 ? { naturaleza } : {}),
      })
      setCodigo('')
      setNombre('')
      setMensaje('Cuenta creada correctamente')
      await cargarCuentas()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear la cuenta')
    } finally {
      setGuardando(false)
    }
  }

  async function borrar(cuenta: Cuenta) {
    if (!window.confirm(`¿Eliminar la cuenta ${cuenta.codigo} - ${cuenta.nombre}?`)) return
    try {
      setError('')
      setMensaje('')
      await eliminarCuenta(cuenta.codigo)
      setMensaje('Cuenta eliminada correctamente')
      await cargarCuentas()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo eliminar la cuenta')
    }
  }

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">ARAVIA · CONTABILIDAD</p>
          <h1>Catálogo de cuentas</h1>
          <p className="subtitle">Administra la estructura jerárquica de cuentas de tu empresa.</p>
        </div>
        <div className="summary">
          <strong>{cuentas.length}</strong>
          <span>cuentas registradas</span>
        </div>
      </header>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Nueva cuenta</h2>
            <p>El nivel y el padre se determinan a partir del código.</p>
          </div>
        </div>
        <form className="account-form" onSubmit={enviar}>
          <label>
            Código
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Ej. 110505"
              inputMode="numeric"
              required
            />
            {nivel && <small>Nivel: {nivel}</small>}
          </label>
          <label>
            Nombre
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Caja general"
              required
            />
          </label>
          {codigo.length === 1 && (
            <label>
              Naturaleza
              <select value={naturaleza} onChange={(e) => setNaturaleza(e.target.value as Naturaleza)}>
                <option value="débito">Débito</option>
                <option value="crédito">Crédito</option>
              </select>
            </label>
          )}
          <button disabled={guardando || !nivel} type="submit">
            {guardando ? 'Guardando…' : 'Crear cuenta'}
          </button>
        </form>
        {mensaje && <p className="feedback success">{mensaje}</p>}
        {error && <p className="feedback error">{error}</p>}
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Estructura del catálogo</h2>
            <p>Las cuentas hoja pueden recibir movimientos contables.</p>
          </div>
          <button className="secondary" onClick={() => void cargarCuentas()}>Actualizar</button>
        </div>
        {cargando ? (
          <p className="empty">Cargando catálogo…</p>
        ) : cuentas.length === 0 ? (
          <p className="empty">Todavía no hay cuentas. Crea la primera clase para empezar.</p>
        ) : (
          <div className="table">
            <div className="table-row table-header">
              <span>Código</span><span>Nombre</span><span>Nivel</span><span>Naturaleza</span><span />
            </div>
            {cuentas.map((cuenta) => (
              <div className="table-row" key={cuenta.codigo}>
                <span className="code" style={{ paddingLeft: `${(cuenta.codigo.length - 1) * 18}px` }}>
                  {cuenta.codigo}
                </span>
                <span className="account-name">{cuenta.nombre}</span>
                <span><span className="badge">{cuenta.nivel}</span></span>
                <span className={cuenta.naturaleza === 'débito' ? 'debit' : 'credit'}>
                  {cuenta.naturaleza}
                </span>
                <span className="actions">
                  {cuenta.puedeRecibirMovimientos && <span className="leaf">Hoja</span>}
                  <button className="delete" onClick={() => void borrar(cuenta)}>Eliminar</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App
