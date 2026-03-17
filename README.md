🛒 E-commerce Backend API - M4 Project

<p align="center"> <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a> </p>

Esta es una API robusta para la gestión de un ecosistema de E-commerce, construida con una arquitectura escalable, autenticación avanzada y un sistema de permisos basado en roles y estado de cuenta en tiempo real.

🛡️ Módulo de Administración y Seguridad
El corazón de este proyecto es su sistema de permisos. Hemos implementado validaciones estrictas para asegurar la integridad de la plataforma:

👑 Facultades del Administrador (Admin)
Seeder de Productos: Ejecución de carga masiva de stock mediante el endpoint GET /products/seeder, habiendo cargado previamente las categorías mediante el endpoint GET /categories/seeder.

Control Total de Usuarios: Capacidad de listar a todos los usuarios, o de manera individual, actualizarlos y realizar Soft Delete (desactivación lógica de cuentas)

Seguridad de Credenciales: El Admin puede editar perfiles pero tiene bloqueado el cambio de contraseñas ajenas, garantizando la privacidad absoluta del usuario.

Auditoría Global: Acceso para consultar cualquier orden de compra en el sistema.

👤 Facultades del Usuario (User)
Gestión de Perfil: Acceso exclusivo a su perfil propio y a su historial personal de órdenes.

Órdenes de Compra: Creación de pedidos con validación automática de stock en tiempo real.

Validación de Inactividad (Seguridad Crítica): Si un Admin o el propio usuario desactiva una cuenta, el sistema denega el acceso automáticamente a su perfil y a sus órdenes. Incluso si el usuario posee un token JWT válido, el sistema verifica su vigencia en la base de datos para impedir el acceso en menos de una hora tras la baja.

🛠️ Tecnologías y Stack
Core: NestJS + TypeScript.

Database: PostgreSQL + TypeORM.

Auth: JWT (JSON Web Tokens) & Bcrypt para hashing de contraseñas.

Documentación: Swagger (OpenAPI).

Storage: Integración con Multer para la gestión de imágenes.

🏗️ Configuración del Proyecto

1. Variables de Envorno
   Crea un archivo .env en la raíz con la siguiente estructura:

Fragmento de código

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=ecommerce_db
JWT_SECRET=tu_clave_secreta 2. Instalación y Ejecución
Bash

# Instalar dependencias

$ npm install

# Ejecutar en modo desarrollo

$ npm run start:dev 3. Documentación Interactiva (Swagger)
Explorá y probá los endpoints en tiempo real: 👉 http://localhost:3000/api

📦 Relaciones de Base de Datos (DER) --> se encuentra en la carpeta "doc"
La arquitectura de datos sigue un modelo relacional estricto para asegurar la consistencia:

Users (1:N) Orders: Un usuario puede gestionar múltiples ordenes.

Orders (1:1) OrderDetails: Cada orden se vincula a un registro detallado de la operacion.

OrderDetails (N:N) Products: Permite la inclusión de múltiples productos en una sola compra.

Products (N:1) Categories: Clasificación jerárquica para facilitar la búsqueda y el filtrado.
