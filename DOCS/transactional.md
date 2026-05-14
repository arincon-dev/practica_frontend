# Save Consistency (Frontend)

Frontend cannot guarantee database transactions, but it should preserve operation consistency in UI flows.

Applied strategy:
- Save user first
- Synchronize addresses after user save
- Report partial failure if user saved but addresses failed

This mirrors transactional thinking at UX/API orchestration level.

## Related Docs
- [DOCS index](README.md)
- [Documentation map](map-of.md)
- [API contract](api-contract.md)
- [Error contract](error-contract.md)
- [DTO/model mapping](dto-model-mapping.md)
- [Testing guide](frontend-testing.md)
