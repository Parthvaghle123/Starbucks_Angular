# Technical Specification - Fix AdminProductsComponent Properties

## Technical Context
- **Language**: TypeScript / Angular
- **Component**: `AdminProductsComponent`
- **Issue**: The template references `loading$` and `error$` with the `async` pipe, but the component class defines them as synchronous `boolean` and `string | null` properties.

## Implementation Approach
1.  **Modify Template**: Update `admin-products.component.html` to use `loading` and `error` directly instead of `loading$ | async` and `error$ | async`.
2.  **Remove Async Pipe**: Since these are no longer Observables, the `async` pipe is not needed.

## Source Code Structure Changes
- No changes to the file structure.
- Modified files:
    - `src/app/pages/admin/admin-products.component.html`

## Data Model / API / Interface Changes
- No changes.

## Verification Approach
- Run Angular compiler to ensure the `TS2551` error is resolved.
- Manually verify that the loading spinner and error alert still function correctly in the UI.
