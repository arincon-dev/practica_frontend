# API Contract (Frontend View)

Base URL: `http://localhost:8080`

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

Primary flows used by frontend:
- Login
- Users list/create/update/delete
- Addresses list/create/update/delete
- Genders and job titles catalog retrieval

## Related Docs
- [DOCS index](README.md)
- [Documentation map](map-of.md)
- [API contract](api-contract.md)
- [Error contract](error-contract.md)
- [DTO/model mapping](dto-model-entity-mapping.md)
- [Testing guide](testing-junit-mockito-assertj.md)
