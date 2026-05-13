# Service Queries (Frontend Analogy)

Frontend does not use repositories, but service methods play a similar role for API access.

Guidelines:
- One method per endpoint responsibility
- Keep query params and endpoint paths explicit
- Centralize mapping from API DTO to UI model

## Related Docs
- [DOCS index](README.md)
- [Documentation map](map-of.md)
- [API contract](api-contract.md)
- [Error contract](error-contract.md)
- [DTO/model mapping](dto-model-entity-mapping.md)
- [Testing guide](testing-junit-mockito-assertj.md)
