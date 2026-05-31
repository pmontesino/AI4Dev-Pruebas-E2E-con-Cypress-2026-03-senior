# Tasks: Validar Carga de Position (Feature 001)

**Input**: Design documents from /specs/001-position-page-load-e2e/
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Esta feature cambia flujo de usuario y contrato E2E, por lo que las pruebas son obligatorias.

**Organization**: Tareas agrupadas por historia de usuario para implementación y validación independiente.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar base de Cypress para ejecutar la primera prueba en la ruta solicitada por la especificación.

- [X] T001 Crear estructura base de Cypress en cypress/integration/, cypress/fixtures/ y cypress/support/
- [X] T002 Configurar descubrimiento de specs para cypress/integration en cypress.config.js
- [X] T003 [P] Añadir scripts npm de ejecución E2E (open/run) en package.json
- [X] T004 [P] Crear comandos reutilizables de login UI en cypress/support/commands.js
- [X] T005 [P] Definir fixture base de datos esperados en cypress/fixtures/position-page-e2e.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establecer datos determinísticos y contrato técnico que bloquea todas las historias.

**⚠️ CRITICAL**: Ninguna historia puede comenzar antes de completar esta fase.

- [X] T006 Implementar seed dedicado E2E para recruiter, position, phases y candidates en backend/prisma/seed.e2e.position.ts
- [X] T007 Integrar ejecución del seed E2E mediante script npm en backend/package.json
- [X] T008 [P] Ajustar seed principal para soportar modo determinístico E2E en backend/prisma/seed.ts
- [X] T009 [P] Documentar variables y comandos de seed E2E en specs/001-position-page-load-e2e/quickstart.md
- [X] T010 Estabilizar contrato de selectores phase/candidate con data-testid en frontend/src/components/StageColumn.js y frontend/src/components/CandidateCard.js

**Checkpoint**: Fundaciones completas; historias pueden avanzar.

---

## Phase 3: User Story 1 - Ver vista de position completa (Priority: P1) 🎯 MVP

**Goal**: Validar carga de página, login, título y orden exacto de fases.

**Independent Test**: Ejecutar cypress/integration/position.spec.js con seed dedicado y comprobar login, título y fases en orden.

### Tests for User Story 1

- [X] T011 [P] [US1] Crear archivo de prueba principal en cypress/integration/position.spec.js
- [X] T012 [P] [US1] Implementar test de login UI y navegación a position target en cypress/integration/position.spec.js
- [X] T013 [P] [US1] Añadir aserciones de título visible según seed en cypress/integration/position.spec.js
- [X] T014 [P] [US1] Añadir aserciones de conjunto exacto y orden de fases en cypress/integration/position.spec.js

### Implementation for User Story 1

- [X] T015 [US1] Exponer data-testid estable por columna de fase en frontend/src/components/StageColumn.js
- [X] T016 [US1] Alinear render de columnas por orderIndex en frontend/src/components/PositionDetails.js
- [X] T017 [US1] Verificar servicio de carga de fases de Position en backend/src/application/services/positionService.ts
- [X] T018 [US1] Ajustar mapeo de respuesta para IDs de fase en frontend/src/services/candidateService.js

**Checkpoint**: US1 funcional y testeable de forma independiente.

---

## Phase 4: User Story 2 - Ver candidatos en su fase actual (Priority: P2)

**Goal**: Confirmar que cada candidato se muestra solo en su columna de fase actual.

**Independent Test**: Ejecutar cypress/integration/position.spec.js con múltiples candidatos por fase y validar mapeo candidato-fase y ausencia de duplicados.

### Tests for User Story 2

- [X] T019 [P] [US2] Añadir aserciones candidate to phase por data-testid en cypress/integration/position.spec.js
- [X] T020 [P] [US2] Añadir aserciones de no duplicidad entre columnas en cypress/integration/position.spec.js
- [X] T021 [P] [US2] Añadir fixture con dos candidatos en la misma fase en cypress/fixtures/position-page-e2e.json

### Implementation for User Story 2

- [X] T022 [US2] Exponer data-testid estable por tarjeta de candidato en frontend/src/components/CandidateCard.js
- [X] T023 [US2] Asegurar filtrado por fase actual en frontend/src/components/PositionDetails.js
- [X] T024 [US2] Validar currentPhaseId contra fases de la posición en backend/src/application/services/candidateService.ts
- [X] T025 [US2] Añadir protección ante render duplicado por key en frontend/src/components/StageColumn.js

**Checkpoint**: US1 y US2 independientes y validados.

---

## Phase 5: User Story 3 - Estado consistente con datos incompletos (Priority: P3)

**Goal**: Mantener columnas visibles y estables cuando hay fases sin candidatos.

**Independent Test**: Ejecutar cypress/integration/position.spec.js con al menos una fase vacía y validar columna vacía sin ruptura visual.

### Tests for User Story 3

- [X] T026 [P] [US3] Añadir escenario de fase vacía en cypress/integration/position.spec.js
- [X] T027 [P] [US3] Añadir fixture de fase sin candidatos en cypress/fixtures/position-page-e2e.json

### Implementation for User Story 3

- [X] T028 [US3] Garantizar render de todas las fases sin candidatos en frontend/src/components/PositionDetails.js
- [X] T029 [US3] Ajustar estado vacío estable en frontend/src/components/StageColumn.js

**Checkpoint**: Todas las historias funcionales y testables por separado.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar documentación, CI y métricas de estabilidad.

- [X] T030 [P] Actualizar guía final de ejecución en specs/001-position-page-load-e2e/quickstart.md
- [X] T031 [P] Añadir workflow de ejecución E2E headless en .github/workflows/e2e-position-page.yml
- [X] T032 Medir tiempo de ejecución y registrar SC-003 en specs/001-position-page-load-e2e/quickstart.md
- [X] T033 Ejecutar 20 corridas y registrar flakiness SC-004 en specs/001-position-page-load-e2e/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): sin dependencias.
- Foundational (Phase 2): depende de Setup y bloquea historias.
- User Stories (Phase 3 a 5): dependen de Foundational.
- Polish (Phase 6): depende de historias completadas.

### User Story Dependencies

- User Story 1 (P1): inicia tras Foundational; define MVP.
- User Story 2 (P2): inicia tras Foundational; debe ser validable de forma independiente.
- User Story 3 (P3): inicia tras Foundational; robustez de columnas vacías.

### Within Each User Story

- Pruebas primero, en rojo antes de ajustar implementación.
- Contrato de selectores antes de aserciones de mapeo.
- Cambios de frontend alineados con seed determinístico.

### Dependency Graph

- Setup -> Foundational -> US1 -> US2 -> US3 -> Polish
- Setup -> Foundational -> US2 (si hay capacidad y sin conflicto)
- Setup -> Foundational -> US3 (si hay capacidad y sin conflicto)

### Parallel Opportunities

- Setup: T003, T004 y T005 en paralelo.
- Foundational: T008 y T009 en paralelo con T006/T007.
- US1: T011 a T014 en paralelo por bloques de prueba.
- US2: T019 a T021 en paralelo.
- US3: T026 y T027 en paralelo.
- Polish: T030 y T031 en paralelo.

---

## Parallel Example: User Story 1

- Ejecutar en paralelo T011 y T012 en cypress/integration/position.spec.js.
- Ejecutar en paralelo T015 en frontend/src/components/StageColumn.js y T017 en backend/src/application/services/positionService.ts.

## Parallel Example: User Story 2

- Ejecutar en paralelo T019 y T020 en cypress/integration/position.spec.js.
- Ejecutar en paralelo T022 en frontend/src/components/CandidateCard.js y T024 en backend/src/application/services/candidateService.ts.

## Parallel Example: User Story 3

- Ejecutar en paralelo T026 y T027 para preparar y validar fase vacía.
- Ejecutar en paralelo T028 en frontend/src/components/PositionDetails.js y T029 en frontend/src/components/StageColumn.js.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 y Phase 2.
2. Completar US1 (T011 a T018).
3. Validar de forma aislada ejecutando cypress/integration/position.spec.js.

### Incremental Delivery

1. Entregar MVP con US1.
2. Añadir US2 para mapeo candidato-fase y no duplicidad.
3. Añadir US3 para robustez con fases vacías.
4. Cerrar con métricas y CI en Phase 6.

### Parallel Team Strategy

1. Equipo A: Setup y Foundational.
2. Equipo B: US1 y base de test principal.
3. Equipo C: US2 y US3 con hardening de aserciones.

---

## Notes

- Todas las tareas usan formato checklist estricto con ID secuencial y rutas de archivo.
- [P] indica tareas paralelizables sin bloqueo lógico directo.
- Se ajusta explícitamente la ruta de prueba al requisito FR-012.
