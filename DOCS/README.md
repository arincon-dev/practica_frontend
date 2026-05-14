# Frontend Concepts Index

This folder contains technical reference documents for Angular and frontend concepts used in this project.
The content is intended for maintainers, reviewers, and collaborators who need fast context on implementation choices.

## Scope

The documents focus on:
- what each concept does,
- where it is typically applied,
- and why it is relevant in this codebase.

## Topic Index

### Feature Flows (Primary)

- [Frontend features overview](frontend-features-overview.md)
- [Login and session flow](login-and-session-flow.md)
- [Users list behavior](users-list-behavior.md)
- [User popup and address sync](user-popup-and-addresses.md)

### Integration and Contract

- [Documentation map](map-of.md)
- [API contract](api-contract.md)
- [Error contract](error-contract.md)
- [DTO-model mapping](dto-model-mapping.md)
- [Response envelope and HTTP handling](response-envelope-and-http-contract.md)

### UI and Architecture

- [Angular DI and layering](angular-di-and-layering.md)
- [Component-template binding](component-template-binding.md)
- [Validation strategy](validation-and-schema-annotations.md)
- [Save consistency flow](transactional.md)
- [Date and time interoperability](date-and-time-handling.md)
- [Global UI error handling](global-exception-handling.md)
- [Frontend testing guide](frontend-testing.md)

## Maintenance Notes

- Keep each document focused on one concept.
- Prefer adding a new file for a new concept instead of expanding unrelated files.
- Update this index when files are added, renamed, or removed.
