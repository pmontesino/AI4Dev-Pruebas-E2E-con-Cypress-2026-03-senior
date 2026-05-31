# Research: Cambio de Fase por Arrastre

## Decision 1: Crear una spec E2E dedicada para arrastre de fase
- Decision: Añadir `cypress/integration/candidate-phase-drag.spec.js` en lugar de ampliar en exceso `position.spec.js`.
- Rationale: Aísla cobertura funcional y facilita diagnóstico de fallos del flujo drag-and-drop.
- Alternatives considered:
  - Reutilizar solo `position.spec.js`: descartado por mezclar objetivos y aumentar fragilidad.

## Decision 2: Validar persistencia mediante intercept de actualización de candidato
- Decision: Interceptar la solicitud de actualización backend y validar payload/respuesta durante el arrastre.
- Rationale: Conecta el movimiento visual con persistencia real exigida por la feature.
- Alternatives considered:
  - Validar solo cambio visual: descartado por no cubrir persistencia.
  - Validar solo endpoint sin UI: descartado por no cubrir journey del usuario.

## Decision 3: Reutilizar seed determinístico de posición existente
- Decision: Mantener `seed:e2e:position` como precondición para el escenario de arrastre.
- Rationale: Proporciona datos reproducibles (fases + candidatos) y reduce mantenimiento.
- Alternatives considered:
  - Nuevo seed específico para esta feature: descartado por duplicación innecesaria.

## Decision 4: Cubrir explícitamente éxito y error del update
- Decision: Implementar dos casos en E2E: respuesta exitosa y respuesta de error simulada.
- Rationale: La spec exige consistencia ante fallo y no solo el happy path.
- Alternatives considered:
  - Solo escenario exitoso: descartado por cobertura incompleta de FR-006/FR-008.

## Decision 5: Mantener contrato backend compatible
- Decision: No cambiar ruta ni estructura principal de actualización, solo validar su uso correcto.
- Rationale: Evita breaking changes en brownfield y cumple constitución de compatibilidad.
- Alternatives considered:
  - Rediseñar endpoint de actualización: descartado por riesgo y fuera de alcance.
