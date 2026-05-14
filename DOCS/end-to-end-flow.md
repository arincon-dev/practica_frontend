# End-to-End Flow (Frontend View)

This document describes the full runtime flow from frontend perspective.

## 1. App entry and routing

- App starts and routes are resolved in `src/app/app.routes.ts`.
- `/` redirects to `/login`.
- `/usuarios` is the main list screen after successful sign-in.

## 2. Login

1. User enters username and password in login screen.
2. Frontend calls `POST /api/v1/usuarios/iniciar-sesion`.
3. If response `data === true`, frontend stores local session.
4. Frontend navigates to `/usuarios`.

## 3. Users load

1. Users list component calls `UserService.obtenerUsuarios()`.
2. Service sends `GET /api/v1/usuarios/` with query params:
   - `nickUsuario`
   - `nickContrasena`
3. Service maps backend fields to frontend model.
4. For each user, service loads addresses and enriches row data.
5. List screen renders users and auto-selects first row.

## 4. Create or update flow

1. User opens popup in `CREATE` or `UPDATE` mode.
2. Popup loads genders and job titles catalogs.
3. User edits personal fields and inline addresses.
4. On save, frontend validates required fields.
5. Frontend creates/updates user first.
6. Frontend synchronizes addresses:
   - delete removed addresses,
   - update existing addresses,
   - create new addresses,
   - keep one main address.

## 5. Delete flow

1. User selects row and confirms delete action.
2. Frontend calls `DELETE /api/v1/usuarios/{id}`.
3. On success, list refreshes.

## 6. Error and session behavior

- If list load returns `401`, frontend clears local session and redirects to `/login`.
- Service helper wraps HTTP failures into array-style error branch.
- Screens show contextual error message (login/list/popup).

## 7. Contract dependency

This flow depends on backend contract and envelope shape:
- `type`
- `message`
- `data`

If contract changes, update `UserService` mapping first.

## Related Docs

- [Frontend features overview](frontend-features-overview.md)
- [Login and session flow](login-and-session-flow.md)
- [Users list behavior](users-list-behavior.md)
- [User popup and address sync](user-popup-and-addresses.md)
- [API contract](api-contract.md)
