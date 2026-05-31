# Tasks: Cambio de Fase por Arrastre (Feature 002)

**Input**: Design documents from `/specs/002-candidate-phase-drag/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Esta feature cambia flujo de usuario y contrato observable backend, por lo que las pruebas son obligatorias.

**Organization**: Tareas agrupadas por historia de usuario para implementación y validación independiente.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar base de pruebas E2E dedicada para arrastre de fase.

- [X] T001 Crear archivo de spec E2E de arrastre en cypress/integration/candidate-phase-drag.spec.js
- [X] T002 [P] Crear fixture determinístico para drag-and-drop en cypress/fixtures/candidate-phase-drag-e2e.json
- [X] T003 [P] Añadir script npm para ejecutar spec de arrastre en package.json
- [X] T004 [P] Añadir comando reutilizable de navegación a detalle de posición en cypress/support/commands.js
- [X] T005 [P] Registrar import de comandos E2E en cypress/support/e2e.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Asegurar contrato base y estabilidad de selectores antes de historias.

**⚠️ CRITICAL**: Ninguna historia puede comenzar antes de completar esta fase.

- [X] T006 Verificar disponibilidad y shape del endpoint de update en backend/src/routes/candidateRoutes.ts
- [X] T007 Alinear respuesta de error/control en backend/src/presentation/controllers/candidateController.ts
- [X] T008 [P] Encapsular llamada de actualización de fase en frontend/src/services/candidateService.js
- [X] T009 [P] Añadir data-testid estable para zona droppable por fase en frontend/src/components/StageColumn.js
- [X] T010 Documentar preparación de entorno y seed para drag E2E en specs/002-candidate-phase-drag/quickstart.md

**Checkpoint**: Contrato y base técnica listos; historias pueden avanzar.

---

## Phase 3: User Story 1 - Mover candidato entre fases (Priority: P1) 🎯 MVP

**Goal**: Validar que un candidato se mueve visualmente de fase origen a fase destino mediante arrastre.

**Independent Test**: Ejecutar cypress/integration/candidate-phase-drag.spec.js y comprobar que la tarjeta desaparece de origen y aparece en destino tras el drag.

### Tests for User Story 1

- [X] T011 [P] [US1] Implementar escenario de arrastre exitoso en cypress/integration/candidate-phase-drag.spec.js
- [X] T012 [P] [US1] Añadir aserción de ausencia en fase origen en cypress/integration/candidate-phase-drag.spec.js
- [X] T013 [P] [US1] Añadir aserción de presencia en fase destino en cypress/integration/candidate-phase-drag.spec.js
- [X] T014 [P] [US1] Añadir validación de no duplicidad de tarjeta tras drag en cypress/integration/candidate-phase-drag.spec.js

### Implementation for User Story 1

- [X] T015 [US1] Ajustar onDragEnd para movimiento entre columnas en frontend/src/components/PositionDetails.js
- [X] T016 [US1] Mantener identidad estable de tarjeta en drag en frontend/src/components/CandidateCard.js
- [X] T017 [US1] Verificar droppableId por id de fase en frontend/src/components/StageColumn.js
- [X] T018 [US1] Sincronizar payload base de candidato para drag en frontend/src/services/candidateService.js

**Checkpoint**: US1 funcional y testeable de forma independiente.

---

## Phase 4: User Story 2 - Persistir cambio en backend (Priority: P2)

**Goal**: Confirmar que cada arrastre válido dispara y valida la actualización backend del candidato.

**Independent Test**: Ejecutar cypress/integration/candidate-phase-drag.spec.js interceptando PUT /candidates/:id y validar request/response de actualización.

### Tests for User Story 2

- [X] T019 [P] [US2] Añadir intercept de actualización de candidato en cypress/integration/candidate-phase-drag.spec.js
- [X] T020 [P] [US2] Validar method/path de la solicitud PUT en cypress/integration/candidate-phase-drag.spec.js
- [X] T021 [P] [US2] Validar body con applicationId y currentInterviewStep en cypress/integration/candidate-phase-drag.spec.js
- [X] T022 [P] [US2] Validar respuesta 200 y consistencia final de columna en cypress/integration/candidate-phase-drag.spec.js

### Implementation for User Story 2

- [X] T023 [US2] Consolidar cliente de updateCandidateStage en frontend/src/services/candidateService.js
- [X] T024 [US2] Reemplazar fetch inline por servicio tipado en frontend/src/components/PositionDetails.js
- [X] T025 [US2] Asegurar validación de fase destino por posición en backend/src/application/services/candidateService.ts
- [X] T026 [US2] Homogeneizar contrato de éxito de update en backend/src/presentation/controllers/candidateController.ts

**Checkpoint**: US1 y US2 independientes y validados.

---

## Phase 5: User Story 3 - Consistencia ante error de actualización (Priority: P3)

**Goal**: Mantener estado UI consistente cuando falla la actualización backend tras un arrastre.

**Independent Test**: Simular error del update en cypress/integration/candidate-phase-drag.spec.js y verificar rollback/consistencia sin duplicación.

### Tests for User Story 3

- [X] T027 [P] [US3] Añadir escenario de error forzado del update en cypress/integration/candidate-phase-drag.spec.js
- [X] T028 [P] [US3] Validar rollback visual a fase origen en cypress/integration/candidate-phase-drag.spec.js
- [X] T029 [P] [US3] Validar no duplicación en error en cypress/integration/candidate-phase-drag.spec.js

### Implementation for User Story 3

- [X] T030 [US3] Implementar rollback de estado cuando falle update en frontend/src/components/PositionDetails.js
- [X] T031 [US3] Exponer error controlado de actualización en frontend/src/services/candidateService.js
- [X] T032 [US3] Devolver mensajes de error consistentes de dominio en backend/src/application/services/candidateService.ts

**Checkpoint**: Todas las historias funcionales y testeables de forma independiente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar métricas de calidad y documentación operativa.

- [X] T033 [P] Registrar guía final de ejecución de la spec de arrastre en specs/002-candidate-phase-drag/quickstart.md
- [X] T034 [P] Añadir ejecución de spec de arrastre al workflow E2E en .github/workflows/e2e-position-page.yml
- [X] T035 Medir tiempo de ejecución y registrar SC-003 en specs/002-candidate-phase-drag/quickstart.md
- [X] T036 Ejecutar 20 corridas y registrar flakiness SC-004 en specs/002-candidate-phase-drag/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): sin dependencias.
- Foundational (Phase 2): depende de Setup y bloquea historias.
- User Stories (Phase 3 a 5): dependen de Foundational.
- Polish (Phase 6): depende de historias completadas.

### User Story Dependencies

- User Story 1 (P1): inicia tras Foundational; define el MVP del arrastre visual.
- User Story 2 (P2): inicia tras Foundational; valida persistencia backend del arrastre.
- User Story 3 (P3): inicia tras Foundational; robustez de error y consistencia.

### Within Each User Story

- Pruebas primero (en rojo) antes de ajustes de implementación.
- Estabilidad de selectores antes de aserciones de persistencia.
- Integración frontend/backend antes de cerrar métricas.

### Dependency Graph

- Setup -> Foundational -> US1 -> US2 -> US3 -> Polish
- Setup -> Foundational -> US2 (si hay capacidad y sin conflicto)
- Setup -> Foundational -> US3 (si hay capacidad y sin conflicto)

### Parallel Opportunities

- Setup: T002, T003, T004 y T005 en paralelo.
- Foundational: T008 y T009 en paralelo con T006/T007.
- US1: T011 a T014 en paralelo por bloques de aserción.
- US2: T019 a T022 en paralelo.
- US3: T027 a T029 en paralelo.
- Polish: T033 y T034 en paralelo.

---

## Parallel Example: User Story 1

- Ejecutar en paralelo T011 y T012 en cypress/integration/candidate-phase-drag.spec.js.
- Ejecutar en paralelo T016 en frontend/src/components/CandidateCard.js y T017 en frontend/src/components/StageColumn.js.

## Parallel Example: User Story 2

- Ejecutar en paralelo T019 y T021 en cypress/integration/candidate-phase-drag.spec.js.
- Ejecutar en paralelo T023 en frontend/src/services/candidateService.js y T025 en backend/src/application/services/candidateService.ts.

## Parallel Example: User Story 3

- Ejecutar en paralelo T027 y T028 para validar error y rollback.
- Ejecutar en paralelo T031 en frontend/src/services/candidateService.js y T032 en backend/src/application/services/candidateService.ts.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 y Phase 2.
2. Completar US1 (T011 a T018).
3. Validar de forma aislada ejecutando cypress/integration/candidate-phase-drag.spec.js.

### Incremental Delivery

1. Entregar MVP con US1.
2. Añadir US2 para persistencia backend validada por contrato.
3. Añadir US3 para consistencia en error.
4. Cerrar con métricas SC-003 y SC-004 en Phase 6.

### Parallel Team Strategy

1. Equipo A: Setup y Foundational.
2. Equipo B: US1 (arrastre visual y selectores).
3. Equipo C: US2/US3 (persistencia y manejo de error).

---

## Notes

- Todas las tareas usan formato checklist estricto con ID secuencial y rutas de archivo.
- [P] indica tareas paralelizables sin bloqueo lógico directo.
- El enfoque mantiene compatibilidad brownfield y trazabilidad con FR-001..FR-008.
