# Response Envelope and HTTP Contract

The frontend uses Angular `HttpClient` with `observe: 'response'` for operations where status and envelope are both relevant.

Conventions:
- Success path checks `response.body.type === 'OK'` (or relies on service mapping)
- Data extraction uses `response.body.data`
- HTTP/network failures are wrapped by utility helper (`to(...)`) into array-style error result

Rationale:
- Keeps frontend aligned with the API envelope contract
- Centralizes parsing/mapping in service layer

## Related Docs
- [DOCS index](README.md)
- [Documentation map](map-of.md)
- [API contract](api-contract.md)
- [Error contract](error-contract.md)
- [DTO-model mapping](dto-model-mapping.md)
- [Frontend testing guide](frontend-testing.md)
