const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { calcularTotalConsulta } = require('../sano');
const { casos } = require('./casos');

describe('sano.js · calcularTotalConsulta()', () => {
  // Mismos casos que enfermo.js: el comportamiento se conserva
  for (const c of casos) {
    test(c.nombre, () => {
      const total = calcularTotalConsulta({
        paciente: c.paciente,
        tipoConsulta: c.tipo,
        cantidadExamenes: c.examenes,
        incluirISV: c.isv,
      });
      assert.equal(total, c.esperado);
    });
  }

  test('[curado] tipo desconocido lanza un error claro', () => {
    assert.throws(
      () => calcularTotalConsulta({ paciente: { edad: 30 }, tipoConsulta: 'dental' }),
      /Tipo de consulta desconocido: dental/,
    );
  });

  test('[curado] no modifica al paciente (función pura)', () => {
    const paciente = Object.freeze({ edad: 30, seguro: true, tipoSeguro: 'A' });
    assert.doesNotThrow(() => calcularTotalConsulta({ paciente, tipoConsulta: 'general' }));
  });

  test('[curado] no escribe en consola', () => {
    const logOriginal = console.log;
    let llamadas = 0;
    console.log = () => { llamadas += 1; };
    try {
      calcularTotalConsulta({ paciente: { edad: 30 }, tipoConsulta: 'general' });
    } finally {
      console.log = logOriginal;
    }
    assert.equal(llamadas, 0);
  });

  test('valores por defecto: sin exámenes y sin ISV', () => {
    assert.equal(calcularTotalConsulta({ paciente: { edad: 30 }, tipoConsulta: 'emergencia' }), 1200);
  });
});
