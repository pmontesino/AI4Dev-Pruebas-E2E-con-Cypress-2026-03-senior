# Data Model: Cambio de Fase por Arrastre

## Entity: CandidateCardState
- Description: Estado visual de la tarjeta de candidato en el tablero.
- Fields:
  - candidateId: number
  - applicationId: number
  - candidateName: string
  - currentInterviewStepId: number
  - sourcePhaseId: number
  - destinationPhaseId: number
- Validation rules:
  - candidateId y applicationId deben ser válidos y existentes.
  - destinationPhaseId debe pertenecer al flujo de la posición activa.

## Entity: PhaseColumnState
- Description: Estado de cada columna de fase en la vista de PositionDetails.
- Fields:
  - phaseId: number
  - title: string
  - orderIndex: number
  - candidateIds: number[]
- Validation rules:
  - phaseId único por posición.
  - orderIndex define orden estable de render.

## Entity: CandidatePhaseUpdateRequest
- Description: Solicitud backend enviada tras un arrastre válido.
- Fields:
  - routeCandidateId: number
  - applicationId: number
  - currentInterviewStep: number
- Validation rules:
  - routeCandidateId corresponde al candidato arrastrado.
  - currentInterviewStep corresponde a fase destino válida.

## Entity: CandidatePhaseUpdateResponse
- Description: Resultado de la actualización de fase.
- Fields:
  - message: string
  - data.currentInterviewStep: number
  - data.positionId: number
- Validation rules:
  - En éxito, `data.currentInterviewStep` coincide con fase destino.
  - En error, no debe consolidar estado visual inconsistente en UI.

## State Transitions
- Idle -> Dragging: usuario inicia arrastre de tarjeta.
- Dragging -> PendingUpdate: tarjeta soltada en fase destino válida y se dispara update backend.
- PendingUpdate -> Updated: respuesta exitosa; tarjeta queda en fase destino.
- PendingUpdate -> Reverted: respuesta error; tarjeta vuelve a fase origen o estado consistente equivalente.
