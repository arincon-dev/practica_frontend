# Users List Behavior

Main implementation:
- `src/app/features/user-list/user-list.component.ts`

Template:
- `src/app/features/user-list/user-list.component.html`

## Responsibilities

- Load users from the API service
- Keep one selected row (radio-based selection)
- Open popup in create/update mode
- Trigger delete confirmation mode
- Handle logout

## Load Flow

1. `ngOnInit()` calls `cargarUsuarios()`.
2. `cargarUsuarios()` calls `UserService.obtenerUsuarios()`.
3. On success, list is assigned and first row is auto-selected.
4. On network/API failure, inline error message is shown.
5. On `401`, session is removed and user is redirected to login.

## Address Enrichment Failure Behavior

`UserService.obtenerUsuarios()` enriches each user with addresses.

Current behavior when address retrieval fails for a user:
- The address call returns an empty list for that user.
- The users list can still render successfully.
- This avoids blocking the table, but can hide address-specific API failures in the UI.

## UI Helper Methods

The component also owns display-focused helpers:
- `getNombreCompleto(usuario)`
- `getDireccionPrincipal(usuario)`
- `getDireccionesExtra(usuario)`
- `getHoraDesayuno(usuario)`
- `getIconoGenero(usuario)`

These keep templates simple and centralize formatting rules.

## Popup Integration

Popup modes controlled by `modoPopup`:
- `CREATE`
- `UPDATE`
- `DELETE`
- `CLOSED`

After create/update success, users list is refreshed.

## Related Docs

- [User popup and address sync](user-popup-and-addresses.md)
- [DTO-model mapping](dto-model-mapping.md)
- [Global UI error handling](global-exception-handling.md)
