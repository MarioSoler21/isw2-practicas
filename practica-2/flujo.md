# Práctica 2 · GitFlow vs trunk-based

**GitFlow** usa ramas de larga vida: `main` (lo que está en producción), `develop` (integración), y ramas `feature/`, `release/` y `hotfix/`. Cada release pasa por su propia rama, donde se estabiliza y se prueba antes de llegar a `main`.
Funciona bien cuando hay versiones numeradas, QA formal antes de publicar, o hay que mantener varias versiones a la vez (por ejemplo, una app móvil que sale a las tiendas cada cierto tiempo).
Su costo: las ramas viven mucho, se alejan de `main` y los merges se vuelven grandes y con más conflictos.

**Trunk-based** tiene una sola rama principal (`main`) que siempre está lista para desplegar. Las ramas de trabajo son cortas (horas o pocos días), entran por un PR pequeño con review y CI, y mueren al hacer merge.
Las funciones a medio terminar se esconden con feature flags en lugar de quedarse en una rama larga.

**Para una app web usaría trunk-based.** En la web se puede desplegar muchas veces al día y no hay que mantener versiones viejas en paralelo, así que integrar seguido y en pasos pequeños da conflictos chicos, reviews reales y feedback rápido de producción. GitFlow solo lo usaría si el equipo tuviera releases versionados con QA formal.
