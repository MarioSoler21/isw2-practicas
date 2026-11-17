'use strict';

const TARIFA_POR_TIPO_CONSULTA = Object.freeze({
  general: 500,
  especialista: 800,
  emergencia: 1200,
});

const COSTO_POR_EXAMEN = 150;
const TASA_ISV = 0.15;

const EDAD_TERCERA_EDAD = 60;
const EDAD_LIMITE_NINEZ = 12;
const DESCUENTO_TERCERA_EDAD = 0.3;
const DESCUENTO_NINEZ = 0.2;

const DESCUENTO_POR_TIPO_SEGURO = Object.freeze({ A: 0.5, B: 0.25 });

function tarifaBase(tipoConsulta) {
  const tarifa = TARIFA_POR_TIPO_CONSULTA[tipoConsulta];
  if (tarifa === undefined) {
    throw new Error(`Tipo de consulta desconocido: ${tipoConsulta}`);
  }
  return tarifa;
}

function descuentoPorEdad(edad) {
  if (edad >= EDAD_TERCERA_EDAD) return DESCUENTO_TERCERA_EDAD;
  if (edad < EDAD_LIMITE_NINEZ) return DESCUENTO_NINEZ;
  return 0;
}

function descuentoPorSeguro({ seguro, tipoSeguro }) {
  if (seguro !== true) return 0;
  return DESCUENTO_POR_TIPO_SEGURO[tipoSeguro] ?? 0;
}

const aplicarDescuento = (monto, descuento) => monto * (1 - descuento);
const costoExamenes = (cantidad) => Math.max(cantidad, 0) * COSTO_POR_EXAMEN;
const agregarISV = (monto) => monto * (1 + TASA_ISV);
const redondearACentavos = (monto) => Math.round(monto * 100) / 100;

/**
 * Calcula el total a cobrar por una consulta.
 * Los descuentos (edad y seguro) solo aplican a la tarifa de la consulta,
 * no a los exámenes. El ISV se aplica al final, sobre todo el subtotal.
 * Función pura: no modifica al paciente ni escribe en consola.
 */
function calcularTotalConsulta({ paciente, tipoConsulta, cantidadExamenes = 0, incluirISV = false }) {
  const descuentos = [descuentoPorEdad(paciente.edad), descuentoPorSeguro(paciente)];
  const consulta = descuentos.reduce(aplicarDescuento, tarifaBase(tipoConsulta));
  const subtotal = consulta + costoExamenes(cantidadExamenes);
  const total = incluirISV ? agregarISV(subtotal) : subtotal;
  return redondearACentavos(total);
}

module.exports = { calcularTotalConsulta, TARIFA_POR_TIPO_CONSULTA };
