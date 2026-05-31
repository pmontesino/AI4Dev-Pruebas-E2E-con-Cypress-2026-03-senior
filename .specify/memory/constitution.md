<!--
Sync Impact Report
- Version change: N/A -> 1.0.0
- Modified principles:
	- [PRINCIPLE_1_NAME] -> I. Brownfield-First Delivery
	- [PRINCIPLE_2_NAME] -> II. Spec-Driven Incrementalism
	- [PRINCIPLE_3_NAME] -> III. Test Evidence Is Mandatory
	- [PRINCIPLE_4_NAME] -> IV. Contract and Compatibility Safety
	- [PRINCIPLE_5_NAME] -> V. Traceability and Operational Readiness
- Added sections:
	- Additional Constraints
	- Development Workflow
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ updated: .specify/templates/plan-template.md
	- ✅ updated: .specify/templates/spec-template.md
	- ✅ updated: .specify/templates/tasks-template.md
	- ⚠ pending review: .specify/templates/commands/*.md (no files found in this repository)
- Follow-up TODOs:
	- TODO(HOOK_FIX): revisar .specify/extensions/git/scripts/powershell/initialize-repo.ps1 por error de parsing en hook before_constitution.
-->

# AI4Dev-Pruebas-E2E-con-Cypress Constitution

## Core Principles

### I. Brownfield-First Delivery
Todo cambio MUST partir del sistema existente, no de una reescritura implícita. Cada feature MUST documentar impacto sobre backend, frontend, datos y tests existentes, incluyendo compatibilidad hacia atrás y estrategia de rollback cuando aplique. Rationale: en proyectos brownfield, el mayor riesgo es romper capacidades ya desplegadas.

### II. Spec-Driven Incrementalism
Toda funcionalidad MUST seguir la secuencia especificación -> plan -> tareas -> implementación, con entrega incremental por historias independientes y verificables. Cada historia MUST poder demostrarse sin depender de funcionalidades no implementadas. Rationale: reduce riesgo de alcance difuso y facilita validación temprana.

### III. Test Evidence Is Mandatory
Todo cambio de comportamiento MUST incluir evidencia de pruebas en el nivel adecuado (unitaria, integración y/o E2E). Los cambios de API o contratos MUST incluir pruebas de integración/contrato; los cambios de flujo de usuario MUST incluir evidencia E2E. No se acepta código generado por IA sin revisión humana y sin evidencia de ejecución. Rationale: la calidad en brownfield depende de detectar regresiones antes de merge.

### IV. Contract and Compatibility Safety
Las interfaces públicas (rutas HTTP, esquemas de datos y payloads compartidos) MUST tratarse como contratos estables. Cualquier breaking change MUST declararse explícitamente en la spec, incluir plan de migración y justificar por qué no existe alternativa compatible. Rationale: protege consumidores existentes y evita fallos en cascada.

### V. Traceability and Operational Readiness
Cada cambio MUST mantener trazabilidad entre requisitos, tareas, commits y evidencia de pruebas. Las decisiones clave (trade-offs, riesgos, supuestos) MUST quedar documentadas en artefactos de Spec Kit. En cambios que afecten operación, MUST definirse impacto en despliegue, observabilidad y soporte. Rationale: la trazabilidad acelera auditoría, soporte y evolución del producto.

## Additional Constraints

- Stack base del proyecto:
	- Backend Node.js + TypeScript + Express + Prisma.
	- Frontend React (Create React App).
	- Persistencia PostgreSQL (Docker para entorno local).
- Idioma y documentación:
	- La documentación de trabajo del proyecto MUST mantenerse en español.
	- Los archivos Markdown MUST conservar codificación UTF-8.
- IA asistida:
	- Prompts y resultados relevantes MUST quedar versionados cuando impacten en decisiones de implementación.
	- La IA puede proponer cambios, pero la aprobación final MUST ser humana.
- Seguridad y cumplimiento:
	- Secretos y credenciales MUST NOT exponerse en código o documentación.
	- El uso de datos sensibles en herramientas de IA MUST respetar políticas de privacidad del equipo.

## Development Workflow

1. Descubrimiento y alcance:
	 - Definir objetivo de negocio y límites del cambio.
	 - Identificar impacto brownfield en componentes existentes.
2. Especificación:
	 - Crear spec con historias priorizadas, escenarios de aceptación, edge cases y criterios medibles.
	 - Incluir sección de impacto en sistema existente.
3. Planificación:
	 - Completar contexto técnico, gate de constitución y estructura real de archivos.
	 - Verificar compatibilidad y estrategia de pruebas por historia.
4. Tareas:
	 - Desglosar tareas por historia con rutas de archivo concretas.
	 - Incluir tareas de pruebas cuando haya cambio de comportamiento o contrato.
5. Implementación y revisión:
	 - Implementar incrementalmente por prioridad.
	 - Adjuntar evidencia de pruebas y revisar riesgos residuales antes del merge.

## Governance

Esta constitución prevalece sobre convenciones ad hoc del repositorio para cambios nuevos. Toda excepción MUST documentarse en el plan de la feature con justificación explícita y aprobación del responsable técnico.

Política de enmiendas y versionado:
- MAJOR: redefinición incompatible de principios o eliminación de una garantía obligatoria.
- MINOR: adición de principio, sección o gate obligatorio nuevo.
- PATCH: aclaraciones de redacción sin cambiar obligaciones normativas.

Cumplimiento y revisiones:
- Cada PR MUST verificar cumplimiento de principios y gates de constitución.
- Cada ciclo de feature SHOULD incluir revisión de consistencia entre spec, plan y tasks.
- Cualquier breach detectado MUST registrarse con acción correctiva.

**Version**: 1.0.0 | **Ratified**: 2026-05-31 | **Last Amended**: 2026-05-31
