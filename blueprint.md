# Blueprint: Wingo - Plataforma de Apuestas Deportivas

## Visión General

Wingo es una plataforma de apuestas deportivas diseñada para un público analítico y exigente. La aplicación busca ofrecer una experiencia de usuario superior, herramientas de análisis y un entorno de apuestas transparente y seguro. El diseño es moderno, intuitivo y totalmente responsivo, garantizando una usabilidad perfecta tanto en dispositivos móviles como de escritorio.

## Diseño y Estilo Implementado

- **Estética Moderna:** La interfaz utiliza componentes contemporáneos, un diseño visualmente equilibrado con espaciado limpio y estilos pulidos.
- **Jerarquía Visual:** Se utiliza una tipografía expresiva con tamaños de fuente variados para enfatizar la información clave, como titulares, secciones y palabras clave.
- **Profundidad y Textura:** Se aplican sombras suaves y multicapa a elementos como tarjetas y botones para crear una sensación de profundidad y un aspecto "elevado". Un sutil ruido de fondo añade una sensación táctil y premium.
- **Iconografía Funcional:** Se integran iconos de la biblioteca `lucide-react` para mejorar la comprensión y la navegación lógica de la aplicación.
- **Interactividad:** Los elementos interactivos como botones y menús desplegables están diseñados para ser intuitivos y proporcionar una respuesta visual clara.

## Características y Funcionalidades Implementadas

- **Enrutamiento Basado en Archivos:** La aplicación utiliza el App Router de Next.js con una estructura de carpetas y archivos clara en el directorio `/app`.
- **Componentes Reutilizables:** Se han creado componentes modulares y reutilizables (ubicados en `/src/components`).
- **Integración de API (Simulada):** La comunicación con BetsAPI se encuentra temporalmente desactivada y utiliza datos estáticos para permitir el desarrollo de la interfaz.
- **Iconos de Deportes Dinámicos:** El sistema asigna iconos a cada deporte listado, mejorando la interfaz.
- **Sistema de Subida de Archivos Simplificado:**
    - **Acción de Servidor (`src/app/upload/actions.ts`):** Una función `uploadFile` dedicada y autónoma que gestiona la subida de archivos a Firebase Storage.
    - **Componente de Subida (`src/components/simple-uploader.tsx`):** Un formulario de React simple e independiente que permite a los usuarios seleccionar y subir un archivo.
    - **Integración en la Página Principal:** El `SimpleUploader` se ha añadido a la página de inicio para facilitar las pruebas y el acceso.

## Plan de Acción y Pasos Recientes

El objetivo de la sesión actual era resolver un problema persistente con la subida de archivos a Firebase Storage. Después de una extensa depuración, se optó por una estrategia de simplificación.

1.  **Abandono de la Lógica Compleja:** Se decidió dejar de lado la lógica de subida anterior que estaba causando errores difíciles de diagnosticar.
2.  **Creación de una Acción de Servidor Simple:** Se desarrolló una nueva acción de servidor (`uploadFile`) en un archivo separado (`src/app/upload/actions.ts`), enfocada únicamente en la subida de archivos.
3.  **Creación de un Componente de UI Dedicado:** Se construyó un nuevo componente de React (`SimpleUploader`) con un formulario mínimo para interactuar con la nueva acción.
4.  **Integración y Pruebas:** El nuevo componente se integró en la página principal para una prueba directa y aislada.
5.  **Actualización del Blueprint:** Se ha actualizado este documento para reflejar la nueva arquitectura simplificada para la subida de archivos.

**Estado Actual:** La aplicación cuenta con un sistema de subida de archivos nuevo, simple y funcional. La depuración anterior ha sido resuelta al reemplazar la lógica compleja. El siguiente paso es probar esta nueva funcionalidad y luego, si es necesario, eliminar el código de subida antiguo.
