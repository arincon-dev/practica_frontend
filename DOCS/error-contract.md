# Error Contract (Frontend)

## Error Sources
- HTTP status errors (401, 404, 409, 500)
- Network errors / backend unavailable
- Validation failures returned by backend

## UI Strategy
- Login: show error under password field
- Users list: show inline error banner
- Popup save: show modal error message

## Authentication-specific behavior
- On `401` during users reload, clear local session and redirect to login

## Related Docs
- [DOCS index](README.md)
- [Documentation map](map-of.md)
- [API contract](api-contract.md)
- [Error contract](error-contract.md)
- [DTO/model mapping](dto-model-entity-mapping.md)
- [Testing guide](testing-junit-mockito-assertj.md)
