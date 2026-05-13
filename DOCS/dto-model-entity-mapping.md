# DTO-Model Mapping

Frontend model names are localized (`nickUsuario`, `primerApellido`) while backend DTOs are English (`username`, `firstSurname`).

Service-layer mapping responsibilities:
- Convert backend response fields into frontend model fields
- Convert frontend form model into backend request DTO payload
- Normalize date/time formats for HTML inputs

Why this matters:
- Prevents template breakage from naming mismatches
- Isolates API schema changes to one layer

## Related Docs
- [DOCS index](README.md)
- [Documentation map](map-of.md)
- [API contract](api-contract.md)
- [Error contract](error-contract.md)
- [DTO/model mapping](dto-model-entity-mapping.md)
- [Testing guide](testing-junit-mockito-assertj.md)
