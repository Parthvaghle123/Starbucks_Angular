# Bug Investigation - Navbar Click Issue

## Bug Summary
The user reports a bug where navbar links require a double click to show the expected output/data. The redirection should be immediate on a single click, and the data should be displayed correctly without needing a second click.

## Root Cause Analysis
1. **Race Condition in Component Initialization**: In `MenuComponent`, `GiftComponent`, and `ItemComponent`, there is a race condition between `fetchProducts()` and the `queryParams` subscription. If `fetchProducts()` finishes after the `queryParams` subscription has already processed the query, it overwrites `filteredProducts` with the full product list, effectively ignoring the search query on first load.
2. **Artificial Delays**: There are several `setTimeout` calls (700ms, 800ms, 1000ms) in the components that delay the display of data and the hiding of the loading state. This makes the UI feel unresponsive and might lead users to click again.
3. **Search Persistence Mismatch**: The `NavbarComponent` holds the `searchText` state, but clicking on a navbar link (like "Menu") uses a simple `routerLink` that doesn't include the current search query. This results in the search box showing a term while the page shows all items, requiring the user to click the search button again (a "second click" of sorts) to see filtered results.
4. **No Double-Click Logic Found**: No explicit `dblclick` event listeners were found, suggesting the "double click" is a user perception caused by the above issues (needing to click again to trigger a search or wait for delays).

## Affected Components
- `NavbarComponent` (logic and template)
- `MenuComponent`
- `GiftComponent`
- `ItemComponent`

## Implementation Notes
- **MenuComponent / GiftComponent / ItemComponent**: Removed `setTimeout` delays. Implemented `applyFilter` method to ensure filtering happens immediately on data fetch or query param change. Fixed race condition where `fetchProducts` would overwrite filtered results.
- **NavbarComponent**: Added `(click)="searchText = ''"` to all navbar links to ensure a fresh state on navigation and prevent confusion.
- **Single Click Success**: The removal of delays and the immediate filtering ensure that a single click on a navbar link or a search result update is reflected instantly.

## Test Results
- Manual verification of routing: Immediate redirection confirmed.
- Data display: Products load and filter instantly without needing a second click.
- Search persistence: Search text clears on navbar navigation as intended for a clean user experience.
