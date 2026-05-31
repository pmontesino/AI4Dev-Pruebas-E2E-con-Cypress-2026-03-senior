# Feature Specification: Validar Carga de Position

**Feature Branch**: `e2e-PJM`  
**Created**: 2026-05-31  
**Status**: Draft  
**Input**: User description: "Consolidación final: la feature semántica queda como 001-position-page-load-e2e y se integra en la rama e2e-PJM."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver vista de position completa (Priority: P1)

Como recruiter, quiero abrir la página de una posición y ver su título y fases del proceso para confirmar que la vista está cargada correctamente.

**Why this priority**: Es el flujo mínimo de valor para validar que la pantalla principal de seguimiento de candidatos funciona.

**Independent Test**: Se valida accediendo a una posición existente y comprobando que aparecen el título y todas las columnas de fases esperadas.

**Acceptance Scenarios**:

1. **Given** que existe una posición activa, **When** el recruiter abre la página de detalle de esa posición, **Then** se muestra el título correcto de la posición.
2. **Given** que la posición tiene un flujo de contratación definido, **When** el recruiter entra en la página, **Then** se muestran las columnas correspondientes a cada fase del proceso.

---

### User Story 2 - Ver candidatos en su fase actual (Priority: P2)

Como recruiter, quiero ver cada candidato en la columna de su fase actual para entender el estado real del pipeline.

**Why this priority**: Garantiza que la representación visual del pipeline sea confiable para la toma de decisiones.

**Independent Test**: Con datos de candidatos en fases distintas, se valida que cada tarjeta aparece en la columna que coincide con su fase.

**Acceptance Scenarios**:

1. **Given** que hay candidatos en varias fases, **When** se visualiza la página de posición, **Then** cada tarjeta de candidato se muestra en la columna de su fase actual.
2. **Given** que dos candidatos comparten fase, **When** se carga la vista, **Then** ambos se muestran en la misma columna y no aparecen duplicados en otras fases.

---

### User Story 3 - Estado consistente con datos incompletos (Priority: P3)

Como recruiter, quiero que la vista de position mantenga coherencia visual cuando faltan candidatos en algunas fases para poder revisar el pipeline sin errores.

**Why this priority**: Reduce falsos fallos y mejora la confiabilidad del flujo E2E inicial frente a datos reales variables.

**Independent Test**: Se valida una posición donde una o más fases no tienen candidatos y se comprueba que las columnas siguen mostrándose correctamente.

**Acceptance Scenarios**:

1. **Given** que una o más fases no tienen candidatos, **When** se abre la página de posición, **Then** las columnas vacías se muestran sin romper la estructura de la vista.

---

### Edge Cases

- ¿Qué sucede si la posición existe pero no tiene candidatos en ninguna fase?
- ¿Cómo se comporta la vista si un candidato no tiene fase asignada en origen de datos?
- ¿Qué ocurre si se define una fase de contratación nueva y aún no tiene candidatos?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir cargar la página de detalle de una posición existente y mostrar su título.
- **FR-002**: El sistema MUST mostrar todas las columnas de fases asociadas al proceso de contratación de la posición.
- **FR-003**: El sistema MUST representar cada candidato dentro de la columna que corresponde a su fase actual.
- **FR-004**: El sistema MUST evitar que una misma tarjeta de candidato aparezca en más de una columna al mismo tiempo.
- **FR-005**: El sistema MUST mantener la estructura visual de columnas aunque alguna fase no tenga candidatos.
- **FR-006**: El sistema MUST exponer información suficiente para validar de forma automática la correspondencia entre candidato y fase en una prueba E2E.
- **FR-007**: El sistema MUST ejecutar la prueba E2E sobre un seed dedicado y determinístico que incluya al menos una posición, fases del proceso y candidatos distribuidos por fase.
- **FR-008**: La primera prueba E2E MUST limitarse a candidatos con fase válida y excluir casos de candidatos sin fase.
- **FR-009**: El frontend MUST exponer data-testid estables para columnas de fase y tarjetas de candidato, y la prueba E2E MUST usarlos como selector principal.
- **FR-010**: La prueba E2E MUST validar que las columnas de fases mostradas coinciden exactamente con el conjunto y orden definidos en el seed dedicado.
- **FR-011**: La prueba E2E MUST autenticarse mediante login UI con un usuario recruiter de prueba pre-creado en el seed, antes de ejecutar las validaciones de la página de Position.
- **FR-012**: El alcance de esta iteración MUST incluir un archivo de prueba E2E denominado `position.spec.js` ubicado en `/cypress/integration` como artefacto verificable de la prueba inicial.

### Key Entities *(include if feature involves data)*

- **Posición**: Entidad de contratación que contiene título y flujo de fases.
- **Fase de contratación**: Estado del pipeline en el que se agrupan candidatos.
- **Candidato**: Persona evaluada que tiene una fase actual dentro de una posición.

## Existing System Impact *(mandatory for brownfield)*

### Affected Components

- **Backend**: Requiere soporte para preparar seed dedicado y determinístico de posiciones, fases y candidatos antes de la ejecución E2E.
- **Frontend**: Afecta la vista de detalle de posición y la representación de columnas y tarjetas en el pipeline, incluyendo data-testid estables para automatización.
- **Database**: Requiere datos sembrados de forma determinística para posición, fases y asignación actual de candidato a fase.
- **Integrations**: Puede impactar la configuración de ejecución de pruebas automáticas en CI y la convención de ubicación de pruebas de integración E2E en Cypress.

### Compatibility & Migration

- **Backward Compatibility**: Compatible.
- **Migration Plan**: No requiere migración funcional; se añadirá cobertura E2E sobre comportamiento existente usando seed dedicado para aislamiento de datos.
- **Rollback Plan**: Si la automatización genera inestabilidad, se revierte la nueva cobertura E2E sin alterar comportamiento de negocio.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las ejecuciones de la prueba E2E de carga de página de position valida título y columnas en entorno controlado.
- **SC-002**: El 100% de los candidatos de los datos de prueba aparece en la columna que corresponde a su fase actual.
- **SC-003**: La prueba inicial de carga de position finaliza en menos de 3 minutos por ejecución en pipeline estándar.
- **SC-004**: La tasa de fallos no atribuibles a defectos funcionales (flakiness) se mantiene por debajo del 5% en 20 ejecuciones consecutivas.

## Assumptions

- Existe al menos una posición disponible con flujo de fases definido para ejecutar la prueba.
- El entorno de prueba permite sembrar datos dedicados y determinísticos antes de cada ejecución E2E.
- La primera iteración cubre solo carga y consistencia visual-funcional de la vista de position, sin incluir drag and drop.
- La primera iteración cubre solo candidatos con fase válida; los casos sin fase se tratarán en una iteración posterior.
- Las aserciones E2E usarán data-testid como selector principal y texto visible como validación complementaria.
- El seed dedicado define explícitamente el conjunto de fases esperadas a validar en la vista de Position.
- El seed dedicado incluye un usuario recruiter válido para ejecutar login UI en la prueba E2E.
- El pipeline de CI puede ejecutar pruebas E2E contra un entorno accesible de la aplicación.
