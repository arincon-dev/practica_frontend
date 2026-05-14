# DTO-Model Mapping

Frontend model names are localized (`nickUsuario`, `primerApellido`) while API DTOs are English (`username`, `firstSurname`).

Service-layer mapping responsibilities:
- Convert API response fields into frontend model fields
- Convert frontend form model into request DTO payload
- Normalize date/time formats for HTML inputs

## Current Mapping Examples

User response -> frontend model:
- `username` -> `nickUsuario`
- `name` -> `nombre`
- `firstSurname` -> `primerApellido`
- `secondSurname` -> `segundoApellido`
- `birthDate` -> `fechaNacimiento`
- `breakfastTime` -> `horaDesayuno`
- `isAdmin` -> `admin`

Address response -> frontend model:
- `streetName` -> `nombreCalle`
- `streetNumber` -> `numeroCalle`
- `mainAddress` -> `direccionPrincipal`

Frontend model -> request DTO:
- user payload built by `toUserRequestDto(...)`
- address payload built by `toAddressRequestDto(...)`

Implementation file:
- `src/app/core/services/user.service.ts`

Why this matters:
- Prevents template breakage from naming mismatches
- Isolates API schema changes to one layer

## Related Docs
- [DOCS index](README.md)
- [Documentation map](map-of.md)
- [API contract](api-contract.md)
- [Error contract](error-contract.md)
- [DTO-model mapping](dto-model-mapping.md)
- [Frontend testing guide](frontend-testing.md)
