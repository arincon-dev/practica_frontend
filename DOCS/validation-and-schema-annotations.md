# Validation Strategy (Frontend)

Frontend applies lightweight validation for required fields before save.

Current baseline:
- Login requires username/password
- User save validates key required fields
- Address inline editor validates street name and number

Backend remains source of truth for hard constraints.

Recommendation:
- Keep frontend validation user-friendly, but always handle backend validation errors.

## Related Docs
- [DOCS index](README.md)
- [Documentation map](map-of.md)
- [API contract](api-contract.md)
- [Error contract](error-contract.md)
- [DTO/model mapping](dto-model-entity-mapping.md)
- [Testing guide](testing-junit-mockito-assertj.md)
