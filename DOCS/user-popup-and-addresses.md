# User Popup and Address Synchronization

Main implementation:
- `src/app/features/user-popup/user-popup.component.ts`

Template:
- `src/app/features/user-popup/user-popup.component.html`

## Popup Modes

- `CREATE`: starts with empty user/address state
- `UPDATE`: clones selected user and existing addresses

`ngOnInit()` also loads combos:
- genders
- job titles

## Save Flow

`onSave()` executes this sequence:
1. Validate required fields.
2. Create or update user.
3. Resolve `userId`.
4. Synchronize addresses with the API service.
5. Emit success event if all steps succeed.

If user save succeeds but address synchronization fails, popup shows a partial-failure message.

## Address Sync Strategy

`sincronizarDirecciones(userId)` enforces consistency:
1. Ensure one main address if list is non-empty.
2. Detect removed original addresses and delete them in the API service.
3. Persist non-main addresses first.
4. Persist main address last.
5. Assign generated IDs to newly created addresses.

Persisting main address last helps guarantee final main-address state.

## Address UX Rules

Inline address operations include:
- add address
- edit selected address
- delete selected address
- set selected address as main

When deleting the current main address, the first remaining address is promoted as main.

## Validation Rules

User form required fields:
- username
- name
- first surname
- birth date
- breakfast time
- gender
- job title

Address rule:
- in `CREATE`, at least one address is required
- in `UPDATE`, addresses can be empty

## Related Docs

- [Save consistency flow](transactional.md)
- [Validation strategy](validation-and-schema-annotations.md)
- [DTO-model mapping](dto-model-mapping.md)
