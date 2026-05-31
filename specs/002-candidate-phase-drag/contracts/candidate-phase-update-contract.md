# Contract: Candidate Phase Update (E2E)

## Purpose
Definir el contrato observable que la prueba E2E valida al mover un candidato entre fases en PositionDetails.

## Backend Endpoint Contract
- Method: PUT
- Path: /candidates/:id
- Path params:
  - id: number (candidateId)
- Request body:
  - applicationId: number
  - currentInterviewStep: number (fase destino)

## Success Response Contract
- HTTP status: 200
- Body shape:
  - message: string
  - data: object con al menos `currentInterviewStep`

## Error Response Contract
- HTTP status: 4xx/5xx
- Body shape:
  - message: string
  - error: string

## E2E Assertions Bound to Contract
1. Tras un drag válido se emite una solicitud PUT al candidato objetivo.
2. El body enviado incluye `applicationId` y `currentInterviewStep` válidos.
3. Con respuesta 200 la tarjeta queda en la columna destino.
4. Con respuesta de error la UI mantiene consistencia (sin duplicar tarjeta y sin estado ambiguo).

## Non-Goals
- No redefine el contrato API existente.
- No cambia esquema de base de datos.
