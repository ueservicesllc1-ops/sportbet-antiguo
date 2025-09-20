# Blueprint: Sports Betting Platform

## Visión General

Esta aplicación es una plataforma de apuestas deportivas moderna y dinámica construida con Next.js y TypeScript. Permite a los usuarios ver partidos en vivo y próximos de una variedad de deportes, navegar a través de ellos de manera eficiente y ver detalles de eventos específicos. La interfaz está diseñada para ser intuitiva, visualmente atractiva y totalmente responsiva.

## Características Implementadas

### **1. Arquitectura y Estructura del Proyecto**
*   **Framework:** Next.js 14 con App Router.
*   **Lenguaje:** TypeScript.
*   **Estilos:** Tailwind CSS con `shadcn/ui` para componentes de UI reutilizables y de alta calidad (Botones, Tarjetas, Diálogos, etc.).
*   **Linting:** ESLint para mantener la calidad y consistencia del código.
*   **Iconografía:** `lucide-react` para iconos modernos y limpios.

### **2. Funcionalidades del Núcleo**
*   **Integración con API (BetsAPI):**
    *   Conexión segura a la API de BetsAPI para obtener datos de eventos deportivos.
    *   Manejo robusto de la clave de API a través de variables de entorno.
    *   Funciones para obtener partidos "En Vivo" (`getInplayEvents`) y "Próximos" (`getUpcomingEvents`).
    *   Validación de datos de la API con `zod` para garantizar la integridad de los datos y prevenir errores en tiempo de ejecución.
*   **Página Principal Dinámica (`/`)**
    *   **Diseño de Doble Columna:**
        *   **Barra Lateral de Deportes (`SportsSidebar`):** Una barra de navegación a la izquierda que muestra una lista curada de deportes disponibles. Cada deporte tiene un icono asociado y funciona como un ancla (`<Link href="#...">`) que desplaza la vista a la sección correspondiente en el contenido principal.
        *   **Contenido Principal (`Sportsbook`):** El área principal a la derecha que muestra la información de los partidos.
    *   **Secciones de Deportes (`SportSection`):**
        *   El contenido principal se divide en secciones, una para cada deporte de la lista.
        *   Cada sección muestra dinámicamente partidos "En Vivo" y "Próximos" obtenidos de la API.
        *   Manejo de estados de carga y casos donde no hay partidos disponibles.
*   **Listado de Partidos (`MatchList`)**
    *   Componente reutilizable que renderiza una lista de partidos.
    *   Muestra información clave: equipos, liga, hora del partido.
    *   Indica visualmente si un partido está "En Vivo", mostrando el marcador actual y un indicador animado.
    *   Cada partido es un enlace (`<Link>`) que navega a una página de detalles (`/match/[id]`).

### **3. Diseño y Experiencia de Usuario (UX)**
*   **Navegación Fluida:** La barra lateral permite al usuario saltar instantáneamente a la sección del deporte que le interesa sin recargar la página.
*   **Diseño Responsivo:** La aplicación se adapta a diferentes tamaños de pantalla.
*   **Iconografía Significativa:** Cada deporte en la barra lateral tiene un icono único (`getSportIcon`) para una identificación visual rápida.
*   **Feedback Visual:**
    *   Los partidos en vivo tienen un indicador de "pulso" para llamar la atención.
    *   El uso de `shadcn/ui` garantiza una apariencia consistente y moderna.

### **4. Modularidad y Mantenibilidad**
*   **Código Basado en Componentes:** La interfaz está dividida en componentes pequeños y reutilizables (`SportsSidebar`, `Sportsbook`, `SportSection`, `MatchList`), siguiendo las mejores prácticas de React.
*   **Separación de Lógica:** La lógica de la API (`/lib/betsapi.ts`), la lógica de los iconos (`/lib/sport-icons.ts`) y los componentes de la UI están claramente separados.

---

## Plan de Cambio Actual: Mejorar Claridad de las Cuotas

**Solicitud del Usuario:** "ponle un numero a cada equipo antes del nombre como 1 . 2. paraq en los cuadoros de cuotas pongas arriba 1 y 2 para saber q cuota es de cada equipo"

**Interpretación:** El usuario solicitó una mejora visual para conectar claramente qué cuota corresponde a qué equipo. Esto se logrará numerando los equipos (local y visitante) y usando esos mismos números como etiquetas en los botones de las cuotas.

**Pasos de Implementación:**

1.  **Numerar Equipos en `MatchListItem` (`src/components/match-list.tsx`):**
    *   Se modificó el componente para añadir el prefijo "1. " al nombre del equipo local y "2. " al nombre del equipo visitante.
    *   Esto proporciona una referencia visual directa en el listado de partidos.

2.  **Verificar Etiquetas en `OddsDisplay` (`src/components/odds-display.tsx`):**
    *   Se revisó el componente que muestra las cuotas.
    *   La implementación existente ya utilizaba las etiquetas "1", "X", y "2" para los botones de las cuotas de "Ganador del partido".
    *   No fue necesario realizar cambios, ya que el diseño existente se alinea perfectamente con la numeración de los equipos recién añadida.

**Resultado:** La interfaz ahora es más intuitiva. Los usuarios pueden ver claramente "1. Equipo A vs 2. Equipo B" y asociar sin ambigüedad las cuotas etiquetadas con "1" y "2" al equipo correspondiente.
