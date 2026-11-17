// Tests de caracterización: fijan lo que enfermo.js hace HOY (incluidos sus defectos)
// antes de tocarlo. Son la red de seguridad del refactor.
const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { calc } = require('../enfermo');
const { casos, CODIGO_LEGACY } = require('./casos');

describe('enfermo.js · calc()', () => {
  let logOriginal;
  let llamadasLog;

  beforeEach(() => {
    logOriginal = console.log;
    llamadasLog = [];
    console.log = (...args) => llamadasLog.push(args);
  });

  afterEach(() => {
    console.log = logOriginal;
  });

  for (const c of casos) {
    test(c.nombre, () => {
      const paciente = { ...c.paciente };
      assert.equal(calc(paciente, CODIGO_LEGACY[c.tipo], c.examenes, c.isv), c.esperado);
    });
  }

  test('[defecto] tipo desconocido devuelve -1 en vez de fallar', () => {
    assert.equal(calc({ edad: 30 }, 9, 0, false), -1);
  });

  test('[defecto] modifica al paciente que recibe (efecto secundario)', () => {
    const paciente = { edad: 30 };
    calc(paciente, 1, 0, false);
    assert.equal(paciente.ultimoTotal, 500);
  });

  test('[defecto] escribe los datos del paciente en consola', () => {
    calc({ edad: 30, nombre: 'Ana' }, 1, 0, false);
    assert.equal(llamadasLog.length, 1);
    assert.equal(llamadasLog[0][1].nombre, 'Ana');
  });
});
