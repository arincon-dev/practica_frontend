# Java Date/Time Interoperability

Backend sends date/time values as JSON strings.

Frontend handling:
- Creation date displayed via date formatting
- Breakfast time normalized to `HH:mm` for table and form display
- Birth date converted to `yyyy-MM-dd` for `input[type=date]`

Common pitfall:
- Assigning raw Date objects directly to date input can fail to render.

## Related Docs
- [DOCS index](README.md)
- [Documentation map](map-of.md)
- [API contract](api-contract.md)
- [Error contract](error-contract.md)
- [DTO/model mapping](dto-model-entity-mapping.md)
- [Testing guide](testing-junit-mockito-assertj.md)
