# Frontend Angular - User Management App

Angular frontend (standalone components) integrated with the Spring Boot backend.

## Overview

This application is part of a fullstack practice project focused on user management.
It allows you to sign in, review the users list, and manage user data (create, update, delete), including address management.

## This project needs the backend

This frontend **does not work on its own**. It needs the backend running to:
- sign in
- list users
- create, update, and delete users/addresses

Related backend project:
- https://github.com/arincon-dev/practica_backend

## 1. Features implemented

- Login page
- Users table page
- Create user popup
- Update user popup
- Delete user flow
- Address management inside user popup (create, update, delete, set main address)

## 2. Prerequisites

- Node.js 18+ (LTS recommended)
- npm
- Backend running on `http://localhost:8080`

## 3. Install dependencies

From this frontend folder:

```bash
npm install
```

## 4. Run frontend

```bash
npm start
```

If PowerShell blocks script execution (`npm.ps1 cannot be loaded`):

```powershell
npm.cmd start
```

App URL:
- `http://localhost:4200`

## 5. Build validation

```bash
npm run build
```

If this command succeeds, the frontend is build-ready.

## 6. Run full stack on a new machine

Use this order:

1. Start backend first (see backend README).
2. Confirm backend is reachable at `http://localhost:8080/fullstack.html`.
3. In this frontend folder run:

```bash
npm install
npm start
```

4. Open `http://localhost:4200/login`.
5. Login with backend seed credentials (for example `johnsmith` / `password123`).
6. Validate full user flow:
   - Users list loads
   - Create User works
   - Update User works
   - Delete User works
   - Address main flag persists after update

## 7. Project structure

- `src/app/core/models` -> frontend domain models
- `src/app/core/services` -> HTTP integration and DTO mapping
- `src/app/features/login` -> login screen
- `src/app/features/user-list` -> users table and actions
- `src/app/features/user-popup` -> create/update popup and address management
- `src/app/shared/contants` -> routes, API URL, constants
- `DOCS` -> implementation and architecture documentation

## 8. Backend integration contract

Frontend base API URL is defined in:
- `src/app/shared/contants/const-urls.ts`

Current value:
- `http://localhost:8080`

Used endpoints:
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

Business operations include authentication query params:
- `nickUsuario`
- `nickContrasena`

## 9. Troubleshooting

### Login works but users list fails
- Clear local session and login again:

```javascript
localStorage.clear()
```

- Ensure backend is running on port 8080.

### Port 4200 already in use

```bash
npx ng serve --port 4201
```

### `ERR_CONNECTION_REFUSED` or CORS-like failures
- Backend is stopped or running on a different host/port.

## 10. Useful commands

```bash
npm install
npm start
npm run build
```