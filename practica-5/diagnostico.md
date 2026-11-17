# Práctica 5 · Clínica de código completa

**Paciente:** `enfermo.js` → función `calc()` que calcula el total a cobrar por una consulta en una clínica (tarifa por tipo de consulta, descuentos por edad y seguro, exámenes e ISV).
**Alta médica:** `sano.js` → `calcularTotalConsulta()`.

## Cómo correr los tests

```bash
cd practica-5
npm test        # o: node --test   (Node 18+, sin dependencias)
```

- `test/casos.js`: 15 casos compartidos (tarifas, límites de edad 11/12/60, seguros A/B/desconocido, descuentos acumulados, exámenes, ISV, centavos).
- `test/enfermo.test.js`: **tests de caracterización**. Fijan lo que el código enfermo hace hoy, incluidos sus defectos, *antes* de tocarlo.
- `test/sano.test.js`: los **mismos 15 casos** contra `sano.js` (prueba de que el refactor no cambió el comportamiento) + tests de los defectos curados.

## Diagnóstico

| # | Síntoma (smell) | Dónde en `enfermo.js` | Por qué es un problema | Tratamiento en `sano.js` |
|---|---|---|---|---|
| 1 | Nombres que no revelan intención | `calc`, `p`, `t`, `d`, `f`, `r` | Hace falta un comentario para saber qué es cada parámetro | `calcularTotalConsulta`, `paciente`, `tipoConsulta`, `cantidadExamenes`, `incluirISV` |
| 2 | Números mágicos | `500`, `800`, `1200`, `0.3`, `0.2`, `0.5`, `0.25`, `150`, `1.15`, `60`, `12` | No se sabe qué significan y cambiar una tarifa obliga a buscar en todo el código | Constantes con nombre (`COSTO_POR_EXAMEN`, `TASA_ISV`, `EDAD_TERCERA_EDAD`…) |
| 3 | Códigos numéricos para tipos | `t == 1`, `t == 2`, `t == 3` | `1` no dice "general"; fácil equivocarse | Claves legibles: `'general'`, `'especialista'`, `'emergencia'` |
| 4 | Condicionales encadenados / anidados | `if/else if` de tarifas y `if` dentro de `else` en edad y seguro | Difícil de leer y de extender (agregar un seguro "C" = otro `else`) | Tablas de búsqueda (`TARIFA_POR_TIPO_CONSULTA`, `DESCUENTO_POR_TIPO_SEGURO`) y *guard clauses* |
| 5 | Código de error en vez de excepción | `return -1` con tipo inválido | `-1` parece un total válido y se podría cobrar o sumar sin que nadie lo note | `throw new Error('Tipo de consulta desconocido: …')` |
| 6 | Efecto secundario oculto | `p.ultimoTotal = r` | Modifica el objeto que recibe, sin redondear y sin que el nombre lo avise | Función pura: no toca al paciente (test con `Object.freeze`) |
| 7 | Debug olvidado / fuga de datos | `console.log("calculando...", p)` | Imprime datos del paciente en consola | Eliminado (test que verifica que no hay logs) |
| 8 | Bucle innecesario | `for` que suma `150` `d` veces | Una multiplicación hace lo mismo | `Math.max(cantidad, 0) * COSTO_POR_EXAMEN` |
| 9 | Comparaciones flojas | `==`, `p.seguro == true` | Coerciones sorpresa (`seguro: 1` contaría como `true`) | `===` / `!==` |
| 10 | `var` y variable mutable | `var r`, `var i` reasignadas en toda la función | Alcance de función y estado que cambia en 8 lugares | `const` y pasos con nombre que devuelven valores |
| 11 | Función larga con muchas responsabilidades | `calc` hace tarifa + edad + seguro + exámenes + ISV + log + mutación | Viola SRP: no se puede probar ni reusar cada regla por separado | Funciones chicas: `tarifaBase`, `descuentoPorEdad`, `descuentoPorSeguro`, `aplicarDescuento`, `costoExamenes`, `agregarISV`, `redondearACentavos` |
| 12 | Argumento bandera y parámetros posicionales | `calc(p, 2, 1, true)` | En la llamada no se entiende qué es `2`, `1` ni `true` | Un objeto con nombres: `{ paciente, tipoConsulta, cantidadExamenes, incluirISV }` |

## Tratamiento aplicado (refactorings)

1. **Red de seguridad primero:** tests de caracterización sobre `enfermo.js` (verde antes de tocar nada).
2. *Replace Magic Number with Symbolic Constant* → constantes con nombre.
3. *Replace Conditional with Lookup Table* → objetos congelados para tarifas y seguros.
4. *Extract Function* → una función por regla de negocio.
5. *Replace Error Code with Exception* → `throw` en tipo desconocido.
6. *Remove Side Effects* / *Remove Dead Code* → sin mutación ni `console.log`.
7. *Introduce Parameter Object* → un solo objeto con nombres en lugar de 4 posicionales.
8. Correr los **mismos casos** contra `sano.js`: 38/38 en verde.

## Cambio de contrato (a propósito)

`sano.js` no es un reemplazo "drop-in": cambia la firma, usa nombres de tipo en vez de códigos y lanza error en lugar de devolver `-1`. Las reglas de negocio (montos, orden de descuentos, ISV sobre el subtotal, redondeo a centavos) se mantienen idénticas, y eso es lo que prueban los casos compartidos.

## Historia en Git

La práctica se subió en commits pequeños con mensajes convencionales (`chore`, `feat`, `test`, `refactor`, `docs`), siguiendo el flujo de la [Práctica 2](../practica-2/flujo.md): primero el código enfermo, luego los tests, luego el refactor y al final el diagnóstico.
