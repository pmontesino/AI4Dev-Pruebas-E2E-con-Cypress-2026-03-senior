# Implementation Plan: Cambio de Fase por Arrastre

**Branch**: `002-position-page-load` | **Date**: 2026-05-31 | **Spec**: `specs/002-candidate-phase-drag/spec.md`
**Input**: Feature specification from `/specs/002-candidate-phase-drag/spec.md`

## Summary

Extender la cobertura E2E del tablero de posición para validar el flujo completo de cambio de fase por arrastre: movimiento visual de la tarjeta, emisión de actualización backend y comportamiento consistente ante éxito y error del update.

## Technical Context

**Language/Version**: TypeScript 4.9 (backend), JavaScript React 18 (frontend), Node.js 20  
**Primary Dependencies**: Express, Prisma, React, react-beautiful-dnd, Cypress 15  
**Storage**: PostgreSQL (Docker local)  
**Testing**: Cypress E2E (principal), Jest existente para no regresión  
**Target Platform**: Web full-stack en entorno local y CI Linux  
**Project Type**: Aplicación web (frontend + backend)  
**Performance Goals**: Corrida E2E de arrastre < 3 minutos en CI (SC-003)  
**Constraints**: Flakiness <= 5% en 20 corridas, sin romper contratos actuales de candidatos/fases  
**Scale/Scope**: 1 escenario E2E adicional sobre flujo existente de PositionDetails

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Brownfield impact documented for backend, frontend, data model, and existing tests
- [x] Backward compatibility assessed for public contracts (API/routes/schemas)
- [x] Test strategy defined per user story with required evidence level (unit/integration/E2E)
- [x] Rollback or mitigation path defined for risky or breaking changes
- [x] Traceability established: spec requirements -> plan decisions -> tasks

## Project Structure

### Documentation (this feature)

```text
specs/002-candidate-phase-drag/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── candidate-phase-update-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── presentation/controllers/candidateController.ts
│   ├── application/services/candidateService.ts
│   └── routes/candidateRoutes.ts

frontend/
├── src/
│   ├── components/PositionDetails.js
│   ├── components/StageColumn.js
│   └── services/candidateService.js

cypress/
├── integration/
│   ├── position.spec.js
│   └── candidate-phase-drag.spec.js
├── fixtures/
└── support/
```

**Structure Decision**: Se mantiene estructura brownfield existente y se añade una spec E2E dedicada para arrastre de fase, reutilizando seed determinístico y servicios actuales para minimizar riesgo de regresión.

## Phase 0: Research Output

Las decisiones de alcance, patrones de prueba e integración drag-and-drop quedan documentadas en `research.md`.

## Phase 1: Design Output

Se generan `data-model.md`, `contracts/candidate-phase-update-contract.md` y `quickstart.md` para cubrir contrato de actualización, datos de prueba y pasos de ejecución/validación.

## Post-Design Constitution Check

- [x] Se preserva compatibilidad del contrato existente de actualización de candidato.
- [x] La evidencia E2E cubre éxito y error del flujo de arrastre.
- [x] Se mantiene trazabilidad entre FR de la spec y artefactos de diseño.
- [x] El plan limita cambios a componentes impactados en frontend, backend y suite E2E.

## Complexity Tracking

Sin violaciones de constitución ni excepciones requeridas.
