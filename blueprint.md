# Blueprint: Wingo - Plataforma de Apuestas Deportivas

## Visión General

Wingo es una plataforma de apuestas deportivas y juegos de casino, diseñada para un público analítico y exigente. La aplicación busca ofrecer una experiencia de usuario superior, herramientas de análisis y un entorno de apuestas transparente y seguro. El diseño es moderno, intuitivo y totalmente responsivo, garantizando una usabilidad perfecta tanto en dispositivos móviles como de escritorio.

## Diseño y Estilo Implementado

- **Estética Moderna:** La interfaz utiliza componentes contemporáneos, un diseño visualmente equilibrado con espaciado limpio y estilos pulidos.
- **Jerarquía Visual:** Se utiliza una tipografía expresiva con tamaños de fuente variados para enfatizar la información clave, como titulares, secciones y palabras clave.
- **Profundidad y Textura:** Se aplican sombras suaves y multicapa a elementos como tarjetas y botones para crear una sensación de profundidad y un aspecto "elevado". Un sutil ruido de fondo añade una sensación táctil y premium.
- **Iconografía Funcional:** Se integran iconos de la biblioteca `lucide-react` para mejorar la comprensión y la navegación lógica de la aplicación.
- **Interactividad:** Los elementos interactivos como botones y menús desplegables están diseñados para ser intuitivos y proporcionar una respuesta visual clara.
- **Responsividad:** La aplicación se adapta a diferentes tamaños de pantalla, funcionando perfectamente en dispositivos móviles y de escritorio.

## Características y Funcionalidades Implementadas

### **Estructura y Navegación**
- **Enrutamiento con App Router:** La aplicación utiliza el App Router de Next.js para una navegación rápida y una estructura de proyecto organizada.
- **Componentes Reutilizables:** Se han creado componentes modulares y reutilizables (ubicados en `/src/components`) para mantener un código limpio y escalable.
- **Navegación Principal:** Un menú de navegación claro y accesible que incluye secciones para deportes y casino.
- **Autenticación y Roles:** Sistema de autenticación que diferencia entre usuarios regulares y administradores, con una ruta `/admin` protegida.

### **Sección de Casino**
- **Lobby de Juegos:** Una página de casino (`/casino`) que muestra los juegos disponibles con imágenes de portada dinámicas.
- **Juegos Implementados:**
    - **Tanda de Penales:** Juego interactivo de penaltis.
    - **Campo Minado:** Juego de estrategia para descubrir gemas y evitar minas.
    - **Speedrun (Crash):** Juego de apuestas de tipo "crash".
    - **Ruleta de la Suerte:** Juego de ruleta simple.
- **Gestión de Recursos de Juegos:**
    - **Página de Administración (`/admin/game-assets`):** Una interfaz para que los administradores gestionen las imágenes y otros recursos de los juegos.
    - **Acciones de Servidor:** Se utilizan Server Actions para manejar la subida y actualización de imágenes de los juegos en Firebase Storage y Firestore.

### **Infraestructura**
- **Integración con Firebase:**
    - **Firebase Authentication:** Para la gestión de usuarios.
    - **Firestore:** Como base de datos para almacenar la información de los recursos de los juegos.
    - **Firebase Storage:** Para alojar los archivos de imagen de los juegos.
- **Gestión de Estado:** Se utiliza `useContext` y React state para el manejo del estado global, como la información de autenticación del usuario.

## Plan de Acción y Pasos Recientes

El objetivo de la sesión actual era eliminar por completo el juego "Carta Alta/Baja" de la plataforma.

1.  **Eliminación de la Página del Juego:** Se eliminó el directorio y el archivo de la página principal del juego (`src/app/casino/cartas/page.tsx`).
2.  **Limpieza de la Interfaz de Administración:**
    - Se eliminó la sección completa dedicada a la gestión de activos del juego "Carta Alta/Baja" de la página de administración (`src/app/admin/game-assets/page.tsx`).
    - Se actualizó el formulario de imágenes del lobby (`src/app/admin/game-assets/_components/lobby-assets-form.tsx`) para quitar la opción del juego de cartas.
3.  **Eliminación del Backend y Lógica:**
    - Se eliminaron las funciones `getCartasGameAssets` y las referencias a "cartas" en la acción `uploadGameAsset` del archivo de acciones (`src/app/admin/game-assets/actions.ts`).
4.  **Actualización de la Interfaz del Casino:**
    - Se eliminó la tarjeta de enlace al juego de cartas de la página principal del lobby del casino (`src/app/casino/page.tsx`).
5.  **Actualización del Blueprint:** Se ha actualizado este documento para reflejar la eliminación completa de la funcionalidad.

**Estado Actual:** El juego "Carta Alta/Baja" ha sido exitosamente eliminado de la aplicación. Se han limpiado todos los componentes de la interfaz de usuario, la lógica del servidor y las páginas relacionadas. La plataforma ahora solo ofrece los juegos de Tanda de Penales, Campo Minado, Speedrun y Ruleta.
