# Angular 19 - Practica Final Frontend

Aplicacion frontend en Angular 19 para la practica final, integrada con backend Java Spring Boot.

Esta documentacion describe el estado real actual del proyecto (standalone components + integracion backend), alineado con el enunciado de la practica.

## Objetivo

Implementar el flujo completo:
- Login usuario/contrasena.
- Navegacion a listado de usuarios.
- Crear, actualizar y eliminar usuarios.
- Gestionar direcciones del usuario dentro del popup de alta/edicion.

## Requisitos

- Node.js 18 o superior.
- npm.
- Angular CLI 19 (opcional si usas scripts npm).
- Backend Spring Boot levantado en http://localhost:8080.

## Instalacion

1. Entrar al proyecto frontend.
2. Instalar dependencias:

```bash
npm install
```

## Ejecucion

```bash
npm start
```

Aplicacion en:
- http://localhost:4200

## Arquitectura actual

- Angular standalone (sin app.module.ts).
- Rutas principales:
   - /login
   - /usuarios
- Estructura por carpetas:
   - src/app/core/models
   - src/app/core/services
   - src/app/features/login
   - src/app/features/user-list
   - src/app/features/user-popup
   - src/app/shared/contants

## Integracion backend

- Base URL: http://localhost:8080
- Login:
   - POST /api/v1/usuarios/iniciar-sesion?username=...&password=...
- Listado:
   - GET /api/v1/usuarios/?nickUsuario=...&nickContrasena=...

Nota: el proyecto sigue el contrato de respuesta global type/message/data definido en la documentacion backend.

## Estado funcional actual

### Implementado

- Login conectado con backend.
- Mensaje de error de login debajo del campo contrasena.
- Navegacion a /usuarios tras login correcto.
- Guardado de credenciales minimas en localStorage para llamadas posteriores.
- Pantalla de listado con:
   - boton Logout,
   - botones Create/Update/Delete (UI inicial),
   - seleccion por radio de usuario,
   - carga de usuarios desde backend,
   - visualizacion inicial de columnas requeridas.

### Pendiente para completar el enunciado

- Popup Create User completo (campos + calendario + combos + direcciones inline CRUD).
- Reutilizacion del popup para Update User.
- Confirmacion y flujo completo de Delete User.
- Ajustes finales de paridad visual/funcional segun enunciado.

## Notas de desarrollo

Consulta la carpeta `notes/` para detalles de desarrollo y seguimiento.

## Fuera de alcance obligatorio

- Seguridad avanzada.
- Recuperar contrasena.
- Responsive complejo.

## Opcionales

- Validaciones extra (login y formularios).
- Gestion de generos y puestos de trabajo desde frontend.
- Imagen de usuario.
