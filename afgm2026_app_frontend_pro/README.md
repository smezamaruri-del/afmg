# AFGM Mundial 2026 · Pronósticos

Primera versión mobile-first de la web grupal de pronósticos.

## Qué incluye

- `index.html`: app web responsive con ranking, filtro por grupo, detalle por participante y calendario de partidos ordenado cronológicamente.
- `data/pronosticos_mundial_2026.json`: base estructurada de partidos y pronósticos.
- `data/pronosticos_mundial_2026.csv`: base larga en CSV, una fila por participante/partido.
- `data/pronosticos_mundial_2026_matriz.csv`: matriz limpia similar al PDF original.
- `api/resultados.js`: función serverless para Vercel. Consulta football-data.org sin exponer la API key al navegador.

## Publicación recomendada en Vercel

1. Crea un proyecto en Vercel y sube esta carpeta.
2. En Project Settings > Environment Variables agrega:

   `FOOTBALL_DATA_API_KEY = tu_api_key_de_football_data`

3. Deploy.
4. Comparte el link público con tus amigos.

## Prueba local simple

Desde esta carpeta puedes ejecutar:

```bash
python3 -m http.server 8000
```

Luego abre `http://localhost:8000`. En modo local simple no funcionará la API `/api/resultados`; solo verás la estructura base. Para probar la API local, usa `vercel dev` y define la variable de entorno.

## Regla cargada

- Fase de grupos: 1 punto por acierto.

## Siguiente mejora sugerida

Agregar selección de campeón y reglas de eliminatorias cuando tengan esa base.

## Mejora aplicada: calendario

Los partidos ahora incluyen campo `fecha` y la vista de calendario se ordena cronológicamente, manteniendo filtros por grupo y detalle de pronósticos.


## Actualización UI/UX

Versión con paleta visual revisada: fondo azul noche, superficies con mejor separación, amarillo solo como acento principal, azul para navegación/acciones, verde para aciertos, rosa para errores y mayor contraste en chips, ranking y calendario.


## Versión front-end destacada

Esta versión usa una propuesta visual más editorial/deportiva: tipografías Bricolage Grotesque + IBM Plex Mono, fondo tipo estadio nocturno, acentos lime/gold/cyan/pink y tarjetas glass premium.
