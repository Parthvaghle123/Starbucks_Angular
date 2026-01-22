# Technical Specification: React to Angular Migration

## Technical Context
- **Source**: React JS project (Vite-based)
- **Target**: Angular 2+ (Angular 21)
- **Styling**: Bootstrap 5.3.7, Custom CSS
- **Icons**: FontAwesome, Lucide
- **Utilities**: jsPDF, jwt-decode, SweetAlert2
- **Data Fetching**: Angular HttpClient (replacing Axios)

## Implementation Approach

### 1. Project Setup
- Install dependencies: `bootstrap`, `font-awesome` (or `@fortawesome/angular-fontawesome`), `jspdf`, `jwt-decode`, `sweetalert2`, `lucide-angular`.
- Configure Bootstrap in `angular.json` or `styles.css`.
- Set up `AppModule` or standalone components (default in Angular 21).

### 2. State Management & Authentication
- Create an `AuthService` to handle `token`, `username`, and `adminToken` using `localStorage` and `BehaviorSubject` for real-time updates.
- Use RxJS `BehaviorSubject` to replicate React state updates and ensure real-time data display.

### 3. Component Migration
- Each React component will be split into `.ts`, `.html`, and `.css`.
- `useState` -> Component properties + `BehaviorSubject`.
- `useEffect` -> `ngOnInit`, `ngOnDestroy`, or `Signals` (if applicable).
- `props` -> `@Input()`.
- `callbacks` -> `@Output() EventEmitter`.

### 4. Routing
- Replicate `react-router-dom` configuration in `app.routes.ts`.
- Implement `AuthGuard` for admin routes (replacing `RequireAdminAuth`).

### 5. Services
- Create services for API calls (User, Admin, Product, Order, etc.).
- Ensure `HttpClient` matches the exact request structure of the previous Axios calls.

## Source Code Structure Changes

```text
frontend/src/app/
├── components/          # Reusable UI components (Navbar, AdminNavbar, etc.)
├── pages/               # Main route components (Home, Login, Dashboard, etc.)
├── services/            # API and state services
├── models/              # TypeScript interfaces/types
├── guards/              # Route protection
└── utils/               # Shared utilities
```

## Data Model / API / Interface Changes
- No API changes.
- Define TypeScript interfaces matching the React project's data structures.

## Verification Approach
- **Visual**: Compare Angular UI with React UI side-by-side.
- **Functional**: Test all user and admin flows (Login, Cart, Checkout, Admin CRUD).
- **Automated**: Run `ng lint` and `ng build` to ensure code quality.
