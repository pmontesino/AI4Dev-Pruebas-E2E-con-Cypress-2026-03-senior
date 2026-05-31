# Research - Validar Carga de Position (Feature 002)

## Decision 1: Mantener seed dedicado y determinístico para E2E
- Rationale: Aísla pruebas del estado mutable y reduce flakiness en pipelines.
- Alternatives considered:
  - Reusar datos existentes del entorno: descartado por baja reproducibilidad.
  - Mock de API en Cypress: descartado para esta primera iteración por menor cobertura real.

## Decision 2: Mantener alcance inicial solo para candidatos con fase válida
- Rationale: Limita complejidad y asegura una primera entrega estable.
- Alternatives considered:
  - Incluir candidatos sin fase: descartado para evitar ampliar reglas de negocio en esta iteración.

## Decision 3: Selectores principales con data-testid estables
- Rationale: Disminuye fragilidad ante cambios visuales/textuales y mejora mantenibilidad.
- Alternatives considered:
  - Selectores por texto como principal: descartado por fragilidad.
  - Selectores estructurales CSS: descartado por alto acoplamiento al DOM.

## Decision 4: Validar conjunto exacto y orden de fases definido en seed
- Rationale: Asegura fidelidad entre datos esperados y representación visual.
- Alternatives considered:
  - Verificar solo presencia de columnas: descartado por baja precisión.

## Decision 5: Login UI con recruiter de prueba pre-creado
- Rationale: Cobertura end-to-end real sin bypass de autenticación.
- Alternatives considered:
  - Inyectar token de sesión: descartado por menor valor funcional.

## Decision 6: Materializar la prueba en cypress/integration/position.spec.js
- Rationale: Cumple explícitamente FR-012 y mantiene un artefacto verificable de negocio.
- Alternatives considered:
  - Usar cypress/e2e/position-page-load.cy.js: descartado en esta feature por no cumplir el requisito de ubicación/nombre.
