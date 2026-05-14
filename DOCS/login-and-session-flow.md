# Login and Session Flow

## Login Flow

The login screen sends credentials to:
- `POST /api/v1/usuarios/iniciar-sesion`

Implementation entry point:
- `src/app/features/login/login.component.ts`

Behavior:
1. User enters `username` and `password`.
2. Frontend calls `UserService.iniciarSesion(username, password)`.
3. If the API confirms success (`data === true`), frontend stores session credentials in local storage.
4. Frontend navigates to `/usuarios`.
5. If login fails, inline error is shown in login screen.

## Session Persistence

Local storage key:
- `USUARIO_LOGADO_STORAGE`

Stored shape is based on `Usuario` model and currently keeps:
- `nickUsuario`
- `contrasena`

Helper methods:
- `guardarUsuarioLogado(...)`
- `obtenerUsuarioLogado()`

Both are implemented in `src/app/core/services/utils.service.ts`.

## Session Usage in Business Endpoints

After login, protected business calls append query params:
- `nickUsuario`
- `nickContrasena`

This is done in service methods before each request.

## Session Failure Handling

When users list reload fails with `401`:
1. Frontend clears local session.
2. Frontend redirects to `/login`.

Implementation:
- `src/app/features/user-list/user-list.component.ts`

## Current Route Access Note

- `/usuarios` currently has no route guard.
- Access control is enforced after data load attempts (for example, redirect after `401` in users load).
- This means direct navigation to `/usuarios` is possible, but session validity is still checked once API calls run.

## Related Docs

- [API contract](api-contract.md)
- [Error contract](error-contract.md)
- [Users list behavior](users-list-behavior.md)
