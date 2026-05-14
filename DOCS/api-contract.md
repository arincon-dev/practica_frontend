# API Contract (Frontend View)

Base URL: `http://localhost:8080`

Configuration source:
- `src/app/shared/contants/const-urls.ts`
- `API_URL` is currently hardcoded (not environment-switched).

Implication:
- For other environments (staging/production or alternate local ports), update `API_URL` before running the app.

Global response envelope:
```json
{
  "type": "OK|ERROR",
  "message": "...",
  "data": {}
}
```

Authentication convention:
- Login endpoint: `username`, `password`
- Business endpoints: `nickUsuario`, `nickContrasena`

Primary endpoints used by frontend:

Login:
- `POST /api/v1/usuarios/iniciar-sesion`

Users:
- `GET /api/v1/usuarios/`
- `POST /api/v1/usuarios/`
- `PUT /api/v1/usuarios/{id}`
- `DELETE /api/v1/usuarios/{id}`
- `GET /api/v1/usuarios/generos`
- `GET /api/v1/usuarios/puestos-de-trabajo`

Addresses:
- `GET /api/v1/direcciones/usuario/{userId}`
- `POST /api/v1/direcciones/`
- `PUT /api/v1/direcciones/{id}`
- `DELETE /api/v1/direcciones/{id}`

Service implementation file:
- `src/app/core/services/user.service.ts`

Important integration note:
- `obtenerUsuarios()` enriches each user with addresses by running an additional addresses call per user.
- If the API contract changes, update mapping methods in `UserService` first.

## Related Docs
- [DOCS index](README.md)
- [Documentation map](map-of.md)
- [API contract](api-contract.md)
- [Error contract](error-contract.md)
- [DTO/model mapping](dto-model-mapping.md)
- [Testing guide](frontend-testing.md)
