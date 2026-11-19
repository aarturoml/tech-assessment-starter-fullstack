import { describe, expect, it } from 'vitest';
import { InMemoryRepository } from './In-Memory.repository.js';

describe('InMemoryRepository', () => {
  it('crea la jerarquía y hereda la naturaleza de la clase', async () => {
    const repository = new InMemoryRepository();

    await repository.crearClase({
      codigo: '1',
      nombre: 'Activo',
      naturaleza: 'débito',
    });
    await repository.crearGrupo({ codigo: '11', nombre: 'Disponible' });
    await repository.crearCuenta({ codigo: '1105', nombre: 'Caja' });
    const subcuenta = await repository.crearSubCuenta({
      codigo: '110505',
      nombre: 'Caja general',
    });

    expect(subcuenta.getPadre()).toBe('1105');
    expect(subcuenta.getNaturaleza()).toBe('débito');
    expect(subcuenta.puedeRecibirMovimientos()).toBe(true);
    expect((await repository.buscarPorCodigo('1'))?.getHijos()).toEqual(['11']);
    expect((await repository.buscarPorCodigo('1105'))?.getHijos()).toEqual([
      '110505',
    ]);
  });

  it('rechaza una cuenta sin padre y códigos duplicados', async () => {
    const repository = new InMemoryRepository();

    await expect(
      repository.crearGrupo({ codigo: '11', nombre: 'Disponible' }),
    ).rejects.toThrow('No existe la cuenta padre 1');

    await repository.crearClase({
      codigo: '1',
      nombre: 'Activo',
      naturaleza: 'débito',
    });
    await expect(
      repository.crearClase({
        codigo: '1',
        nombre: 'Otro activo',
        naturaleza: 'débito',
      }),
    ).rejects.toThrow('ya existe');
  });

  it('no elimina cuentas con hijos y sí elimina cuentas hoja', async () => {
    const repository = new InMemoryRepository();
    await repository.crearClase({
      codigo: '1',
      nombre: 'Activo',
      naturaleza: 'débito',
    });
    await repository.crearGrupo({ codigo: '11', nombre: 'Disponible' });

    await expect(repository.eliminar('1')).rejects.toThrow('cuentas hijas');
    await repository.eliminar('11');
    await expect(repository.buscarPorCodigo('11')).resolves.toBeUndefined();
    expect((await repository.buscarPorCodigo('1'))?.getHijos()).toEqual([]);
  });
});
