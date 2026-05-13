# Frontend Implementation Guide (Complete Walkthrough)

This document explains how the frontend works end to end, based on the final implementation.

## 1. High-level architecture

The application uses Angular standalone components and route-based navigation.

Main layers:
- `core/models`: frontend business types (`Usuario`, `Direccion`, `Genero`, `PuestoDeTrabajo`)
- `core/services`: HTTP integration and API/DTO mapping (`UserService`)
- `features`: screen-level components (`login`, `user-list`, `user-popup`)
- `shared/contants`: URLs, routes, and local storage keys

## 2. Routing and app entry points

Routes are defined in `src/app/app.routes.ts`:
- `/login` -> login page
- `/usuarios` -> users list page
- `/` redirects to `/login`

## 3. Session and authentication flow

Login call:
- `UserService.iniciarSesion(username, password)`
- Endpoint: `POST /api/v1/usuarios/iniciar-sesion`

After successful login:
- The logged user is stored in local storage.
- Later business calls read local credentials and send:
  - `nickUsuario`
  - `nickContrasena`

If users reload receives `401`:
- local session is cleared
- app redirects back to `/login`

## 4. UserService responsibilities

`src/app/core/services/user.service.ts` is the integration hub.

It handles:
- All backend HTTP calls for users, addresses, genders, and job titles
- Backend-to-frontend field mapping
- Frontend-to-backend payload mapping

### 4.1 Backend to frontend mapping

`mapBackendUser(user)` converts API fields to frontend model naming:
- `username` -> `nickUsuario`
- `firstSurname` -> `primerApellido`
- `jobTitle` -> `puestoTrabajo`

`mapBackendAddress(address)` converts:
- `streetName` -> `nombreCalle`
- `streetNumber` -> `numeroCalle`
- `mainAddress` -> `direccionPrincipal`

### 4.2 Frontend to backend mapping

`toUserRequestDto(usuario)` builds user payload expected by backend.
`toAddressRequestDto(userId, direccion)` builds address payload expected by backend.

### 4.3 Data loading strategy

`obtenerUsuarios()`:
1. Calls users endpoint.
2. Maps each user.
3. For each mapped user, calls `obtenerDireccionesUsuario(user.id)`.
4. Returns users enriched with addresses.

## 5. Login feature

Location:
- `src/app/features/login/login.component.ts`
- `src/app/features/login/login.component.html`

Behavior:
- Sends credentials to backend.
- On success, stores session and navigates to `/usuarios`.
- On failure, renders inline login error.

## 6. Users list feature

Location:
- `src/app/features/user-list/user-list.component.ts`
- `src/app/features/user-list/user-list.component.html`
- `src/app/features/user-list/user-list.component.css`

Responsibilities:
- Load and render users table.
- Select current row with radio button.
- Open popup in create/update mode.
- Open custom delete confirmation mode.

UI helper methods:
- `getNombreCompleto(usuario)` -> `firstSurname (+ secondSurname), name`
- `getDireccionPrincipal(usuario)` -> formatted main address
- `getDireccionesExtra(usuario)` -> count of additional addresses
- `getHoraDesayuno(usuario)` -> normalized `HH:mm`
- `getIconoGenero(usuario)` -> supports both ES/EN values

## 7. User popup feature (create and update)

Location:
- `src/app/features/user-popup/user-popup.component.ts`
- `src/app/features/user-popup/user-popup.component.html`
- `src/app/features/user-popup/user-popup.component.css`

Modes:
- `CREATE`
- `UPDATE`

### 7.1 Popup initialization

On `ngOnInit()`:
- Loads genders and job titles combos.
- In update mode, clones selected user and preloads addresses.
- Normalizes birth date to `yyyy-MM-dd` for HTML date input.

### 7.2 Save flow

`onSave()`:
1. Validates required fields.
2. Creates or updates user via `UserService`.
3. Calls `sincronizarDirecciones(userId)`.
4. Emits success event if all operations are consistent.

### 7.3 Address synchronization

`sincronizarDirecciones(userId)` guarantees persistence alignment:
1. Ensures one main address exists when addresses are present.
2. Detects removed original addresses and deletes them on backend.
3. Updates existing addresses (with id).
4. Creates new addresses (without id).
5. Persists non-main addresses first, then main address.

This order helps preserve final main-address state.

## 8. Validation rules currently applied

User form:
- Required: username, name, first surname, birth date, breakfast time, gender, job title
- Addresses required in `CREATE`
- Addresses optional in `UPDATE`

Address inline form:
- Required: street name and street number

## 9. Integration assumptions

Current assumptions:
- Backend is available at `http://localhost:8080`
- Business endpoints require `nickUsuario` and `nickContrasena` query params
- Response envelope follows `type`, `message`, `data`

If backend contract changes, update `UserService` mapping methods first.

## 10. How to debug quickly

1. Check browser Network tab for endpoint, query params, and payload.
2. Verify mapped fields in `UserService` before changing templates.
3. If user list fails after login, clear local storage and re-login.
4. If update works but addresses do not, debug `sincronizarDirecciones` step by step.

## Related Docs
- [DOCS index](README.md)
- [Documentation map](map-of.md)
- [API contract](api-contract.md)
- [Error contract](error-contract.md)
- [DTO/model mapping](dto-model-entity-mapping.md)
- [Testing guide](testing-junit-mockito-assertj.md)
