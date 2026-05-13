# Angular DI and Layering

Backend uses stereotypes (`@Controller`, `@Service`, `@Repository`).
Frontend equivalent layering:
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
- [DTO/model mapping](dto-model-entity-mapping.md)
- [Testing guide](testing-junit-mockito-assertj.md)
