# Instrucciones para IA en Testing (Integración, E2E, BDD y QA Asistido)

## Principios generales

- Prioriza calidad real sobre cobertura aparente: evita crear tests que solo “pasen” sin detectar regresiones relevantes.
- Usa lenguaje del dominio del negocio en escenarios y aserciones; evita describir solo interacciones de UI.
- Genera pruebas mantenibles, independientes y reproducibles.
- Incluye siempre revisión humana antes de aceptar tests generados por IA.
- Optimiza por estabilidad: un test menos pero robusto vale más que varios frágiles.

## Selección de tipo de prueba

- Usa pruebas unitarias para lógica aislada y validaciones deterministas.
- Usa pruebas de integración para validar contratos entre módulos, APIs y flujo de datos.
- Usa pruebas E2E para flujos críticos del usuario de punta a punta.
- No intentes resolver todo con E2E; combina niveles para reducir coste y flakiness.

## Frameworks recomendados (2026)

- Para E2E en JS/TS, prioriza Playwright como opción por defecto.
- Usa Cypress como alternativa válida cuando encaje con el contexto del equipo.
- En integración backend Node.js, usa Supertest junto con Jest o Vitest.
- En frontend, usa Testing Library y MSW para pruebas orientadas al usuario y mocks de red reutilizables.
- Para proyectos nuevos con Vite/React moderno, favorece Vitest por rendimiento y ergonomía.

## Instrucciones para generación de tests E2E con IA

- Especifica escenarios en formato Given/When/Then antes de pedir código.
- Obliga a usar selectores accesibles: getByRole, getByLabel y getByTestId.
- Prohíbe selectores frágiles basados en clases CSS o IDs autogenerados.
- Pide explícitamente validación de estabilidad: ejecutar y verificar varias veces sin flakiness.
- Solicita cobertura mínima de caso feliz, error funcional y validaciones de accesibilidad.
- Exige aserciones orientadas al comportamiento esperado del usuario, no al detalle de implementación.

## Uso de IA en Playwright (MCP/CLI)

- Si el agente tiene acceso al sistema de archivos, prioriza Playwright CLI por eficiencia en tokens.
- Si el entorno es solo chat/herramienta externa sin filesystem, usa Playwright MCP.
- Pide exploración previa de la app antes de generar los tests finales.
- Exige que la IA guarde evidencia en fallos (trace, screenshots, logs) para depuración.
- Para suites grandes, limita pasos redundantes y reutiliza utilidades/POM aprobados.

## Instrucciones para pruebas de integración

- Genera casos que validen interacción real entre componentes, no solo funciones aisladas.
- Cubre respuestas de éxito, validaciones de error y casos de datos duplicados o inválidos.
- Usa datos de prueba representativos e incluye casos límite.
- Mantén tests desacoplados entre sí: cada prueba debe ejecutarse en cualquier orden.
- Reutiliza mocks de red con MSW cuando el servicio externo no sea parte del objetivo de la prueba.

## Instrucciones para BDD con IA

- Genera features y escenarios en Gherkin usando lenguaje ubicuo del dominio.
- Mantén un único evento de negocio principal por escenario.
- Usa Background para precondiciones comunes y Scenario Outline cuando cambian solo los datos.
- Para stack Playwright, prioriza playwright-bdd sobre Cucumber.js puro para ejecución E2E.
- Si se usa Cucumber.js, utiliza el paquete oficial @cucumber/cucumber.
- Pide generación de step definitions sin duplicar pasos existentes.

## Anti-patrones que la IA debe evitar

- No escribir escenarios imperativos centrados en clicks y detalles de UI.
- No introducir IDs técnicos, payloads internos o columnas de base de datos en lenguaje BDD.
- No crear escenarios con múltiples When/Then que mezclen objetivos.
- No inventar precondiciones no acordadas con negocio.
- No sustituir términos de dominio por sinónimos genéricos inconsistentes.
- No aprobar “self-healing” automático sin revisión de diffs.

## IA tradicional vs IA generativa (criterio de uso)

- Usa IA tradicional (ML clásico) para tareas estables y de alto volumen: detección de anomalías, predicción de flakiness, priorización de suites.
- Usa IA generativa (LLMs) para tareas semánticas: generar escenarios, explicar fallos y proponer refactorizaciones.
- No uses LLMs cuando una técnica determinista resuelva mejor y más barato.

## Self-healing y regresiones

- Trata el self-healing como soporte, no como sustituto del análisis de calidad.
- Revisa siempre qué cambió antes de aceptar una curación automática.
- No autocurar cuando desaparece o se altera comportamiento crítico de negocio.
- Define reglas de aceptación explícitas para cualquier healing en CI.

## Visual regression y observabilidad

- Añade regresión visual para detectar cambios no intencionados de layout, colores o tipografía.
- En Playwright, utiliza snapshots como base de comparación visual en flujos críticos.
- Complementa pruebas pre-release con observabilidad en producción (shift-right).
- Usa señales de sesiones reales y anomalías para retroalimentar nuevos casos de prueba.

## Coste, rendimiento y escalabilidad

- Controla el coste en tokens en suites grandes; limita llamadas LLM a pasos de alto valor.
- Favorece estrategias deterministas como primera línea (selector-level healing, reglas estables).
- Ejecuta CI con paralelización, sharding y selección inteligente de pruebas por impacto.
- Reevalúa el ROI de herramientas de IA cada 6 meses.

## Seguridad, privacidad y cumplimiento

- No envíes datos sensibles o PII a modelos externos sin base legal y acuerdos de tratamiento.
- Aplica redacción/anonimización antes de enviar contexto a LLMs.
- Prioriza región y proveedores compatibles con requisitos regulatorios.
- Documenta prompts, outputs y decisiones para trazabilidad y auditoría.
- Considera obligaciones de alfabetización en IA y requisitos regulatorios del sector del producto.

## Calidad del código de test generado

- Exige que todo test generado por IA compile y pase localmente antes de proponer merge.
- Obliga a incluir mensajes de aserción claros y mantenibles.
- Solicita refactorización a Page Object Model solo cuando reduzca duplicación real.
- Mantén consistencia de estilo y estructura de tests en todo el repositorio.
- Evita “test theater”: no aceptar tests por volumen si no incrementan capacidad de detección de fallos.

## Checklist operativo para agentes de IA

- Identificar tipo de prueba objetivo: unitaria, integración, E2E o BDD.
- Generar casos mínimos: feliz, error, borde y datos inválidos.
- Implementar con selectores accesibles y aserciones de negocio.
- Ejecutar pruebas y estabilizar hasta eliminar flakiness evidente.
- Reportar evidencias de ejecución y fallos.
- Proponer mejoras de mantenibilidad (sin sobreingeniería).
- Entregar resumen final con riesgos, limitaciones y siguientes pasos.
