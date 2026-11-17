// Casos compartidos: los mismos datos se corren contra enfermo.js y sano.js
// para demostrar que el refactor no cambió el comportamiento.
const casos = [
  { nombre: 'adulto sin seguro, consulta general', paciente: { edad: 30 }, tipo: 'general', examenes: 0, isv: false, esperado: 500 },
  { nombre: 'especialista sin descuentos', paciente: { edad: 40 }, tipo: 'especialista', examenes: 0, isv: false, esperado: 800 },
  { nombre: 'emergencia sin descuentos', paciente: { edad: 25 }, tipo: 'emergencia', examenes: 0, isv: false, esperado: 1200 },
  { nombre: 'tercera edad (60) tiene 30%', paciente: { edad: 60 }, tipo: 'general', examenes: 0, isv: false, esperado: 350 },
  { nombre: 'niño (11) tiene 20%', paciente: { edad: 11 }, tipo: 'general', examenes: 0, isv: false, esperado: 400 },
  { nombre: 'edad 12 ya no es niño', paciente: { edad: 12 }, tipo: 'general', examenes: 0, isv: false, esperado: 500 },
  { nombre: 'seguro A tiene 50%', paciente: { edad: 30, seguro: true, tipoSeguro: 'A' }, tipo: 'especialista', examenes: 0, isv: false, esperado: 400 },
  { nombre: 'seguro B tiene 25%', paciente: { edad: 30, seguro: true, tipoSeguro: 'B' }, tipo: 'especialista', examenes: 0, isv: false, esperado: 600 },
  { nombre: 'seguro de tipo desconocido no descuenta', paciente: { edad: 30, seguro: true, tipoSeguro: 'Z' }, tipo: 'general', examenes: 0, isv: false, esperado: 500 },
  { nombre: 'tipoSeguro sin seguro activo no descuenta', paciente: { edad: 30, seguro: false, tipoSeguro: 'A' }, tipo: 'general', examenes: 0, isv: false, esperado: 500 },
  { nombre: 'descuentos de edad y seguro se acumulan', paciente: { edad: 70, seguro: true, tipoSeguro: 'A' }, tipo: 'emergencia', examenes: 0, isv: false, esperado: 420 },
  { nombre: 'cada examen suma 150 sin descuento', paciente: { edad: 65 }, tipo: 'general', examenes: 3, isv: false, esperado: 800 },
  { nombre: 'examenes negativos se ignoran', paciente: { edad: 30 }, tipo: 'general', examenes: -2, isv: false, esperado: 500 },
  { nombre: 'ISV 15% sobre el subtotal', paciente: { edad: 30 }, tipo: 'general', examenes: 2, isv: true, esperado: 920 },
  { nombre: 'caso completo con centavos', paciente: { edad: 8, seguro: true, tipoSeguro: 'B' }, tipo: 'especialista', examenes: 1, isv: true, esperado: 724.5 },
];

// enfermo.js usa códigos numéricos para el tipo de consulta
const CODIGO_LEGACY = { general: 1, especialista: 2, emergencia: 3 };

module.exports = { casos, CODIGO_LEGACY };
