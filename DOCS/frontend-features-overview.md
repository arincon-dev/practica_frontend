# Frontend Features Overview

This document describes the features currently implemented in the Angular frontend.

## Implemented Features

- Login page with API authentication
- Users list table with row selection
- Create user popup
- Update user popup
- Delete user confirmation flow
- Address management inside popup:
  - create address
  - update address
  - delete address
  - set main address

## Main Screens

- `/login` -> login flow
- `/usuarios` -> users list and actions

Routes are defined in `src/app/app.routes.ts`.

## Main Runtime Dependencies

- API service running at `http://localhost:8080`
- Local session stored in browser local storage

Without API availability, login and CRUD flows will fail.

## Primary Implementation Files

- `src/app/features/login/login.component.ts`
- `src/app/features/user-list/user-list.component.ts`
- `src/app/features/user-popup/user-popup.component.ts`
- `src/app/core/services/user.service.ts`

## Related Docs

- [Login and session flow](login-and-session-flow.md)
- [Users list behavior](users-list-behavior.md)
- [User popup and address sync](user-popup-and-addresses.md)
- [API contract](api-contract.md)
