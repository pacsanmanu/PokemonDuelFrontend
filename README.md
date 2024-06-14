### Pokémon Duel!
![Logo de la app](../frontend/public/images/logo.webp){: width="500px"}
El entorno cliente de este proyecto está diseñado para proporcionar una interfaz de usuario interactiva y responsiva que facilita la gestión y visualización de datos relacionados con batallas de Pokémon. Las funcionalidades clave incluyen:

- **Autenticación de usuarios:** Permite a los usuarios registrarse e iniciar sesión para acceder a sus perfiles personalizados.
- **Gestión de equipos de Pokémon:** Los usuarios pueden modificar, evolucionar y eliminar Pokémon de su equipo, seleccionando entre una variedad de Pokémon disponibles.
- **Iniciación de combates:** Los usuarios pueden iniciar combates contra otros equipos, que se gestionan a través de la lógica implementada en el servidor.
- **Visualización de resultados y estadísticas:** Después de cada combate, los usuarios pueden ver resultados detallados y seguir el progreso de sus equipos a lo largo del tiempo.

![Imagen de los iniciales](../frontend/public/images/documentation/image1.png)

#### Descripción de la estructura
La estructura del front-end se organiza de la siguiente manera:

- **Componentes:** Utiliza un enfoque basado en componentes (React.js) para construir una interfaz de usuario modular y reutilizable. Cada componente maneja una parte específica de la funcionalidad de la aplicación, como formularios de autenticación, listas de Pokémon, y paneles de resultados de combates.
- **Estilos:** Se utiliza CSS para gestionar los estilos de la aplicación, asegurando que la interfaz sea visualmente atractiva y coherente en diferentes dispositivos y resoluciones de pantalla.
- **Rutas:** Se emplea React Router para manejar la navegación dentro de la aplicación, permitiendo a los usuarios navegar entre diferentes vistas (por ejemplo, página de inicio, login, resultados de combates) sin recargar la página.

Esta estructura está diseñada para ser escalable y fácil de mantener, con una clara separación de preocupaciones entre la lógica de la interfaz de usuario, la gestión de estado, y la comunicación con el back-end.

<b>El frontend está desplegado [aquí.](https://pkmnduel.vercel.app/)</b>
