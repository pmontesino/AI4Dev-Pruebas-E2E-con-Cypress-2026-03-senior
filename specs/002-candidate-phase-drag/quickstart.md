# Quickstart: E2E Cambio de Fase por Arrastre

## Prerrequisitos
- Docker Desktop en ejecución
- Base de datos levantada por `docker-compose up -d`
- Dependencias instaladas en raíz, backend y frontend
- Archivo `backend/.env` alineado con el puerto real del contenedor (5433 en entorno local de este proyecto)

## 1) Preparar backend
```bash
cd backend
npm ci
npm run prisma:generate
npm run seed:e2e:position
npm run dev
```

## 2) Preparar frontend
```bash
cd frontend
npm ci
npm start
```

## 3) Ejecutar prueba E2E de arrastre
```bash
npm run e2e:run:candidate-phase-drag
```

## 4) Evidencia mínima esperada
- La tarjeta arrastrada desaparece de fase origen.
- La tarjeta arrastrada aparece en fase destino.
- Se observa la solicitud de actualización backend del candidato con fase destino.
- En escenario de error simulado, la UI mantiene estado consistente.

## 5) Medición de estabilidad
- SC-003 (tiempo):
```bash
npm run e2e:run:candidate-phase-drag
```
- SC-004 (flakiness):
```powershell
for ($i = 1; $i -le 20; $i++) { npm run e2e:run:candidate-phase-drag }
```
- Calcular porcentaje de fallos para contrastar SC-004 (<= 5%).

## 6) Resultados medidos
- SC-003 tiempo de ejecución: 19.62s.
- SC-004 flakiness (20 corridas): 20 exitosas, 0 fallidas, 0.00%.

## Troubleshooting
- Si no carga datos, reejecutar `npm run seed:e2e:position`.
- Si falla drag-and-drop, verificar `droppableId` y `draggableId` estables y foco en tarjeta arrastrable.
- Si falla persistencia, validar body enviado en PUT de actualización.
