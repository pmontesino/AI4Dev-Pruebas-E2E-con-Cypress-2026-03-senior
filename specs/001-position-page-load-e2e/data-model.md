# Data Model - E2E Position Page (Feature 002)

## Entity: E2ERecruiterUser
- Fields:
  - id: string/uuid
  - email: string
  - password: string (solo entorno de test)
  - role: string (must be `recruiter`)
  - active: boolean
- Validation:
  - role MUST ser recruiter.
  - active MUST ser true para login exitoso.

## Entity: E2EPosition
- Fields:
  - id: string/uuid
  - title: string
  - status: string
- Relationships:
  - 1:N con E2EHiringPhase
  - 1:N con E2ECandidate
- Validation:
  - title no vacío.

## Entity: E2EHiringPhase
- Fields:
  - id: string/uuid
  - positionId: string/uuid
  - name: string
  - orderIndex: number
- Relationships:
  - N:1 con E2EPosition
  - 1:N con E2ECandidate
- Validation:
  - orderIndex único por posición.
  - name no vacío.

## Entity: E2ECandidate
- Fields:
  - id: string/uuid
  - positionId: string/uuid
  - fullName: string
  - currentPhaseId: string/uuid
- Relationships:
  - N:1 con E2EPosition
  - N:1 con E2EHiringPhase
- Validation:
  - currentPhaseId MUST existir en fases de la misma posición.

## Entity: E2EUiSelectorContract
- Fields:
  - phaseColumnTestIdPattern: string (ej. `phase-column-{phaseId}`)
  - candidateCardTestIdPattern: string (ej. `candidate-card-{candidateId}`)
- Validation:
  - IDs estables entre renders para evitar inestabilidad de pruebas.

## Entity: E2ETestFileContract
- Fields:
  - path: string (must be `cypress/integration/position.spec.js`)
  - testScope: string (must include carga de página, título, fases y mapeo candidato-fase)
- Validation:
  - path MUST coincidir con FR-012.

## State Transitions
- Candidate phase transition no se evalúa en esta iteración (solo lectura de estado actual).
