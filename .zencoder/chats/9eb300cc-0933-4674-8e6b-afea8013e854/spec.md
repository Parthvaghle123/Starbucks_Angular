# Technical Specification: Admin Products Box-Type Design

Replace the current product table in the Admin Products page with a responsive grid of cards (box-type design) to improve visual appeal and usability.

## Technical Context
- **Framework**: Angular 17+ (Standalone Components)
- **Styling**: CSS, Bootstrap 5
- **Icons**: FontAwesome

## Implementation Approach
1.  **HTML Structure Changes**:
    - Remove the `<table>` and its associated `table-responsive` wrapper.
    - Introduce a `row` container for the product cards.
    - Use Bootstrap grid classes (`col-12 col-md-6 col-lg-4 col-xl-3`) for responsiveness.
    - Each card will contain:
        - Product image at the top.
        - Product name and description.
        - Category badge and price.
        - Status (Availability toggle).
        - Display options (Gift/Menu toggles).
        - Action buttons (Edit/Delete).

2.  **CSS Enhancements**:
    - Style the product cards with shadows, rounded corners, and hover effects.
    - Ensure consistent image sizing and aspect ratios.
    - Maintain the existing color palette (Starbucks green, etc.).
    - Style the action buttons and badges to fit within the card layout.

3.  **Functional Consistency**:
    - Ensure all `(click)` handlers (`handleToggleAvailability`, `handleToggleDisplay`, `openEditModal`, `handleDeleteProduct`) are preserved and work correctly in the new layout.
    - Keep the search, filter, and "Add Product" button functionality as is.

## Source Code Structure Changes
- **Modified**: `frontend/src/app/pages/admin/admin-products.component.html`
- **Modified**: `frontend/src/app/pages/admin/admin-products.component.css`

## Data Model / API / Interface Changes
- None.

## Verification Approach
- **Linting**: Run `npm run lint` (if available) to ensure code quality.
- **Manual Verification**:
    - Verify that products are displayed as cards in a grid.
    - Test all toggle switches (Availability, Gift Page, Menu Page).
    - Test Edit and Delete functionality.
    - Verify responsiveness on different screen sizes.
