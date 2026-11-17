// Calcula el total a cobrar de una consulta en la clínica
// p = paciente, t = tipo, d = examenes, f = factura con impuesto
function calc(p, t, d, f) {
  var r = 0;
  console.log("calculando...", p);
  if (t == 1) {
    r = 500;
  } else if (t == 2) {
    r = 800;
  } else if (t == 3) {
    r = 1200;
  } else {
    return -1;
  }
  if (p.edad >= 60) {
    r = r - r * 0.3;
  } else {
    if (p.edad < 12) {
      r = r - r * 0.2;
    }
  }
  if (p.seguro == true) {
    if (p.tipoSeguro == "A") {
      r = r - r * 0.5;
    } else {
      if (p.tipoSeguro == "B") {
        r = r - r * 0.25;
      }
    }
  }
  if (d > 0) {
    for (var i = 0; i < d; i++) {
      r = r + 150;
    }
  }
  if (f) {
    r = r * 1.15;
  }
  p.ultimoTotal = r;
  return Math.round(r * 100) / 100;
}

module.exports = { calc };
