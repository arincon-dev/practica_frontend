# Error Contract (Frontend)

## Error Sources
- HTTP status errors (401, 404, 409, 500)
- Network errors / API service unavailable
- Validation failures returned by the API service
- Frontend form validation failures before request send

## UI Strategy
- Login (`login.component.ts`): show inline authentication/connection error
- Users list (`user-list.component.ts`): show list load/delete errors
- User popup (`user-popup.component.ts`): show validation and save/sync errors

## Authentication-specific behavior
- On `401` during users reload, clear local session and redirect to login

## Utility Error Pattern

`to(...)` helper wraps rejected HTTP promises into `[error]` arrays.

Pattern used across features:
1. Call service method.
2. If result is array, treat as failure branch.
3. If result is response object, read `body.data` success path.

Implementation:
- `src/app/core/services/utils.service.ts`

## Related Docs
- [DOCS index](README.md)
- [Documentation map](map-of.md)
- [API contract](api-contract.md)
- [Error contract](error-contract.md)
- [DTO/model mapping](dto-model-mapping.md)
- [Testing guide](frontend-testing.md)
