# Component-Template Binding

Backend has controller request binding; frontend equivalent is component-template binding.

Patterns used:
- `[(ngModel)]` for form fields
- `(click)` for actions
- `(change)` for radio selection updates
- `*ngIf` and `*ngFor` for conditional and list rendering

Design rule:
- Keep API calls in services, not templates.
- Keep template logic simple and delegate formatting to component methods.

## Related Docs
- [DOCS index](README.md)
- [Documentation map](map-of.md)
- [API contract](api-contract.md)
- [Error contract](error-contract.md)
- [DTO/model mapping](dto-model-entity-mapping.md)
- [Testing guide](testing-junit-mockito-assertj.md)
