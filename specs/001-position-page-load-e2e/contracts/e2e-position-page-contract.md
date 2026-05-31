# Contract - E2E Position Page Verification (Feature 002)

## Objective
Definir el contrato verificable entre seed de datos, UI de Position y prueba Cypress.

## Seed Contract
- Debe existir exactamente una posición target de prueba con:
  - title esperado
  - lista de fases con orden fijo
  - candidatos asignados a fase válida
- Debe existir un usuario recruiter válido para login UI.

## UI Contract
- La página de Position debe exponer:
  - `data-testid` estable por columna de fase
  - `data-testid` estable por tarjeta de candidato
- El título visible de la posición debe coincidir con el seed.

## Test File Contract (FR-012)
- El archivo principal de prueba MUST existir en:
  - `cypress/integration/position.spec.js`
- El archivo MUST contener validaciones de:
  1. Login UI con recruiter de seed.
  2. Navegación a página de Position target.
  3. Aserción de título.
  4. Aserción de conjunto exacto y orden de fases (seed vs UI).
  5. Aserción de mapeo candidato -> columna de fase.
  6. No duplicidad de tarjetas en múltiples columnas.

## Out of Scope (iteración actual)
- Candidatos sin fase.
- Drag and drop de tarjetas.
- Reordenación dinámica de fases.
