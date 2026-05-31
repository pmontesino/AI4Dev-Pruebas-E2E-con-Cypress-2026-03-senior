# Feature Specification: Cambio de Fase por Arrastre

**Feature Branch**: `002-position-page-load`  
**Created**: 2026-05-31  
**Status**: Draft  
**Input**: User description: "Crear una prueba E2E: 1) Cambio de fase de un candidato simulando arrastre de tarjeta entre columnas. 2) Verificar que la tarjeta se mueve a la nueva columna. 3) Verificar que la fase del candidato se actualiza correctamente en el backend."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mover candidato entre fases (Priority: P1)

Como reclutador, quiero arrastrar una tarjeta de candidato de una columna a otra para actualizar su fase en el pipeline sin salir de la vista.

**Why this priority**: Es el flujo principal de negocio del tablero Kanban de reclutamiento y aporta valor inmediato operativo.

**Independent Test**: Se valida ejecutando una prueba E2E que arrastra un candidato de una fase origen a una fase destino y comprueba que la tarjeta aparece en la columna destino y desaparece de la origen.

**Acceptance Scenarios**:

1. **Given** un candidato visible en una columna de fase origen, **When** el reclutador arrastra la tarjeta a una columna destino válida, **Then** la tarjeta se muestra en la columna destino y no aparece en la columna origen.
2. **Given** una operación de arrastre completada con respuesta exitosa del backend, **When** se refresca la vista de posición, **Then** el candidato sigue apareciendo en la fase destino.

---

### User Story 2 - Persistir cambio de fase en backend (Priority: P2)

Como responsable técnico, quiero que cada arrastre de candidato invoque el endpoint de actualización para asegurar que el cambio queda persistido en el sistema.

**Why this priority**: Sin persistencia, el cambio visual no representa el estado real del proceso de selección.

**Independent Test**: Se valida verificando que durante el arrastre se dispara el mecanismo de actualización backend de la candidatura y que la respuesta exitosa mantiene estado consistente.

**Acceptance Scenarios**:

1. **Given** un arrastre desde una fase origen a una fase destino, **When** la UI emite la actualización, **Then** se envía exactamente una solicitud de actualización del candidato con la fase destino correcta.
2. **Given** una respuesta `2xx` del endpoint de actualización, **When** finaliza la petición, **Then** la UI mantiene el candidato en la fase destino.

---

### User Story 3 - Manejar error de actualización (Priority: P3)

Como reclutador, quiero que el sistema sea consistente cuando la actualización de fase falle, para no trabajar con datos inconsistentes.

**Why this priority**: Aumenta la confianza operativa y evita discrepancias entre interfaz y backend.

**Independent Test**: Se valida forzando respuesta de error del endpoint y comprobando que el candidato no queda en un estado visual inconsistente.

**Acceptance Scenarios**:

1. **Given** un arrastre válido y una respuesta de error del endpoint, **When** termina la petición fallida, **Then** el candidato vuelve a la fase origen o se muestra un estado de error consistente sin duplicación de tarjetas.

---

### Edge Cases

- Arrastre de candidato hacia la misma columna de origen.
- Arrastre cancelado antes de soltar la tarjeta en una columna válida.
- Intento de mover candidato a una fase que no pertenece al flujo de la posición.
- Reintento de actualización tras fallo transitorio del endpoint.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir arrastrar una tarjeta de candidato entre columnas de fases válidas en la vista de proceso de posición.
- **FR-002**: El sistema MUST actualizar la ubicación visual de la tarjeta en la columna destino cuando el arrastre sea válido.
- **FR-003**: El sistema MUST emitir una solicitud de actualización backend por cada cambio de fase confirmado por el usuario.
- **FR-004**: La petición de actualización MUST incluir el identificador de la fase destino asociado a la posición activa.
- **FR-005**: Tras una respuesta exitosa del backend, el sistema MUST mantener el candidato en la fase destino tras refrescar la vista.
- **FR-006**: Ante error de actualización, el sistema MUST preservar consistencia visual evitando duplicados y mostrando estado coherente para el candidato.
- **FR-007**: La prueba E2E MUST validar movimiento visual y persistencia backend en una misma ejecución.
- **FR-008**: La prueba E2E MUST cubrir al menos un caso de fallo del endpoint para verificar comportamiento consistente.

### Implementation Clarifications (2026-05-31)

- Para cumplir **FR-005**, la validación E2E debe incluir una recarga explícita de la vista (refresh) tras una actualización exitosa y volver a comprobar que el candidato permanece en la fase destino.
- La comprobación post-refresh forma parte del escenario exitoso de la misma prueba E2E de arrastre para evitar falsos positivos de estado solo en memoria de cliente.

### Key Entities *(include if feature involves data)*

- **Candidate Card**: Representa a una candidatura en el tablero e incluye identidad del candidato y fase actual.
- **Phase Column**: Representa una etapa del flujo de entrevistas para una posición concreta.
- **Phase Update Request**: Representa la actualización de fase enviada al backend con candidato objetivo y fase destino.
- **Position Pipeline State**: Estado agregado de fases y candidatos mostrado en la pantalla de detalle de posición.

## Existing System Impact *(mandatory for brownfield)*

### Affected Components

- **Backend**: Servicio de actualización de candidato y validación de fase destino por posición.
- **Frontend**: Componentes de tablero de posición, lógica de drag-and-drop y servicio de actualización de candidato.
- **Database**: Actualización del campo de fase actual de la candidatura; sin cambios de esquema.
- **Integrations**: Pruebas E2E de Cypress y pipeline CI que ejecuta la suite de posición.

### Compatibility & Migration

- **Backward Compatibility**: Compatible.
- **Migration Plan**: No requiere migración de datos ni cambios de contrato público fuera del comportamiento ya soportado por el endpoint existente.
- **Rollback Plan**: Revertir cambios de UI y prueba E2E; mantener endpoint sin modificaciones funcionales destructivas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En el 100% de las ejecuciones exitosas de la prueba E2E, la tarjeta del candidato aparece en la columna destino y no en la origen tras un arrastre válido.
- **SC-002**: En el 100% de las ejecuciones exitosas, se registra una solicitud backend de actualización por cada arrastre válido validado por la prueba.
- **SC-003**: La prueba E2E de cambio de fase completa su ejecución en menos de 3 minutos en entorno CI estándar.
- **SC-004**: La tasa de inestabilidad de la prueba E2E de cambio de fase es menor o igual al 5% en una muestra de 20 ejecuciones consecutivas.

## Assumptions

- Existe al menos una posición visible con flujo de fases y candidatos disponibles para mover entre columnas.
- El servicio backend de actualización de candidato ya está disponible y acepta actualización de fase actual de candidatura.
- El tablero de posición mantiene identificadores estables para columnas y tarjetas que permiten aserciones E2E robustas.
- El entorno de pruebas dispone de seed determinístico para garantizar reproducibilidad del escenario de arrastre.
