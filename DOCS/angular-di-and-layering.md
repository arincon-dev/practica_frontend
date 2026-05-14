# Angular DI and Layering

The frontend uses a clear layered structure:
- Components: view + user interaction
- Services: HTTP integration + mapping logic
- Models: typing contracts for UI state

Dependency Injection:
- Services are `@Injectable({ providedIn: 'root' })`
- Components inject services through constructor

Rule:
- Components should not build URLs or HTTP params directly.

## Related Docs
- [DOCS index](README.md)
- [Documentation map](map-of.md)
- [API contract](api-contract.md)
- [Error contract](error-contract.md)
- [DTO-model mapping](dto-model-mapping.md)
- [Frontend testing guide](frontend-testing.md)
