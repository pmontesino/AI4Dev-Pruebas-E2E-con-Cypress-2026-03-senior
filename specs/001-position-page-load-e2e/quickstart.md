# Quickstart - E2E Position Page (Feature 001)

## Prerrequisitos
- Node.js 20+
- Docker levantado para PostgreSQL
- Dependencias instaladas en raíz, backend y frontend

## 1) Levantar base de datos
```bash
docker-compose up -d
```

## 2) Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run build
npm run dev
```

## 3) Frontend
```bash
cd frontend
npm install
npm start
```

## 4) Seed dedicado E2E
- Ejecutar el seed de test para crear:
  - usuario recruiter de prueba
  - posición target
  - fases con orden explícito
  - candidatos con fase válida

```bash
cd backend
npm run seed:e2e:position
```

## 5) Archivo de prueba requerido
- Crear y mantener la prueba principal en:
  - `cypress/integration/position.spec.js`
- Este archivo debe contener aserciones para:
  - login UI
  - título de la posición
  - conjunto y orden exacto de fases
  - mapeo candidato -> fase

## 6) Ejecutar Cypress
```bash
npm run e2e:open
# o
npm run e2e:run:position
```

## 7) Validaciones esperadas
- Login UI exitoso con recruiter de seed.
- Título de posición coincide con seed.
- Conjunto y orden de fases coincide exactamente con seed.
- Cada tarjeta aparece en su columna de fase según seed.

## 8) Métricas de ejecución (SC-003 y SC-004)
- Fecha de medición: 2026-05-31
- Entorno: ejecución local en Windows con Docker Desktop activo

### SC-003 - Tiempo de ejecución
- Comando: `npm run e2e:run:position`
- Resultado: exit code 0
- Tiempo total medido: 15.38s

### SC-004 - Flakiness en 20 corridas
- Comando: `npm run e2e:run:position` repetido 20 veces (headless)
- Total corridas: 20
- Exitosas: 20
- Fallidas: 0
- Flakiness: 0.00%
- Tiempo promedio: 17.85s
- Tiempo mínimo: 16.07s
- Tiempo máximo: 20.61s

## Troubleshooting rápido
- Si falla por datos, volver a ejecutar seed dedicado.
- Si falla por selectores, verificar `data-testid` estables en columnas y tarjetas.
- Si falla por timing, revisar esperas explícitas en Cypress sobre carga de datos.
- Si no se detecta la prueba, verificar ruta exacta `cypress/integration/position.spec.js`.
