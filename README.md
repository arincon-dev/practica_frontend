# Frontend Angular - Aplicación de gestión de usuarios

Frontend Angular con componentes standalone integrado con el backend Spring Boot.

## Este proyecto necesita el backend

Este frontend **no funciona por sí solo**. Necesita que el backend esté ejecutándose para poder:
- iniciar sesión
- listar usuarios
- crear, actualizar y eliminar usuarios/direcciones

Proyecto backend relacionado:
- https://github.com/arincon-dev/practica_backend

Versión en inglés: [README.en.md](README.en.md)

## 1. Funcionalidades implementadas

- Página de inicio de sesión
- Página con tabla de usuarios
- Popup para crear usuario
- Popup para actualizar usuario
- Flujo para eliminar usuario
- Gestión de direcciones dentro del popup del usuario: crear, actualizar, eliminar y marcar dirección principal

## 2. Requisitos previos

- Node.js 18+ (se recomienda LTS)
- npm
- Backend ejecutándose en `http://localhost:8080`

## 3. Instalar dependencias

Desde esta carpeta del frontend:

```bash
npm install
```

## 4. Ejecutar el frontend

```bash
npm start
```

Si PowerShell bloquea la ejecución del script (`npm.ps1 cannot be loaded`):

```powershell
npm.cmd start
```

URL de la app:
- `http://localhost:4200`

## 5. Validación de compilación

```bash
npm run build
```

Si este comando termina correctamente, el frontend está listo para compilarse.

## 6. Ejecutar el stack completo en una máquina nueva

Sigue este orden:

1. Arranca primero el backend (ver el README del backend).
2. Confirma que el backend responde en `http://localhost:8080/fullstack.html`.
3. En esta carpeta del frontend ejecuta:

```bash
npm install
npm start
```

4. Abre `http://localhost:4200/login`.
5. Inicia sesión con credenciales sembradas del backend (por ejemplo `johnsmith` / `password123`).
6. Valida el flujo completo de usuarios:
   - La lista de usuarios carga
   - Crear usuario funciona
   - Actualizar usuario funciona
   - Eliminar usuario funciona
   - La marca de dirección principal se conserva tras actualizar

## 7. Estructura del proyecto

- `src/app/core/models` -> modelos de dominio del frontend
- `src/app/core/services` -> integración HTTP y mapeo de DTOs
- `src/app/features/login` -> pantalla de inicio de sesión
- `src/app/features/user-list` -> tabla de usuarios y acciones
- `src/app/features/user-popup` -> popup de crear/actualizar y gestión de direcciones
- `src/app/shared/contants` -> rutas, URL de API y constantes
- `DOCS` -> documentación de implementación y arquitectura

## 8. Contrato de integración con el backend

La URL base de la API del frontend está definida en:
- `src/app/shared/contants/const-urls.ts`

Valor actual:
- `http://localhost:8080`

Endpoints usados:
- `POST /api/v1/usuarios/iniciar-sesion`
- `GET /api/v1/usuarios/`
- `POST /api/v1/usuarios/`
- `PUT /api/v1/usuarios/{id}`
- `DELETE /api/v1/usuarios/{id}`
- `GET /api/v1/usuarios/generos`
- `GET /api/v1/usuarios/puestos-de-trabajo`
- `GET /api/v1/direcciones/usuario/{userId}`
- `POST /api/v1/direcciones/`
- `PUT /api/v1/direcciones/{id}`
- `DELETE /api/v1/direcciones/{id}`

Las operaciones de negocio incluyen estos query params de autenticación:
- `nickUsuario`
- `nickContrasena`

## 9. Solución de problemas

### El login funciona pero la lista de usuarios falla
- Limpia la sesión local e inicia sesión otra vez:

```javascript
localStorage.clear()
```

- Asegúrate de que el backend esté ejecutándose en el puerto 8080.

### El puerto 4200 ya está en uso

```bash
npx ng serve --port 4201
```

### `ERR_CONNECTION_REFUSED` o fallos parecidos a CORS
- El backend está detenido o corre en otro host/puerto.

## 10. Comandos útiles

```bash
npm install
npm start
npm run build
```

