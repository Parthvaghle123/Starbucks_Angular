# Spec and build

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:

- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification

Assess the task's difficulty, as underestimating it leads to poor outcomes.

- easy: Straightforward implementation, trivial bug fix or feature
- medium: Moderate complexity, some edge cases or caveats to consider
- hard: Complex logic, many caveats, architectural considerations, or high-risk changes

Create a technical specification for the task that is appropriate for the complexity level:

- Review the existing codebase architecture and identify reusable components.
- Define the implementation approach based on established patterns in the project.
- Identify all source code files that will be created or modified.
- Define any necessary data model, API, or interface changes.
- Describe verification steps using the project's test and lint commands.

Save the output to `d:\Parth\.zencoder\chats\4787d2e3-5681-41bf-ac54-b771cd84ca16/spec.md` with:

- Technical context (language, dependencies)
- Implementation approach
- Source code structure changes
- Data model / API / interface changes
- Verification approach

If the task is complex enough, create a detailed implementation plan based on `d:\Parth\.zencoder\chats\4787d2e3-5681-41bf-ac54-b771cd84ca16/spec.md`:

- Break down the work into concrete tasks (incrementable, testable milestones)
- Each task should reference relevant contracts and include verification steps
- Replace the Implementation step below with the planned tasks

Rule of thumb for step size: each step should represent a coherent unit of work (e.g., implement a component, add an API endpoint, write tests for a module). Avoid steps that are too granular (single function).

Save to `d:\Parth\.zencoder\chats\4787d2e3-5681-41bf-ac54-b771cd84ca16/plan.md`. If the feature is trivial and doesn't warrant this breakdown, keep the Implementation step below as is.

---

## Implementation Plan

### Phase 1: Project Infrastructure & Shared Services
- [ ] **Task 1.1**: Install dependencies and setup Bootstrap.
- [ ] **Task 1.2**: Create `AuthService` for authentication and state management.
- [ ] **Task 1.3**: Create `ApiService` for centralized API calls.
- [ ] **Task 1.4**: Implement `AuthGuard` for admin route protection.

### Phase 2: Core Components (Shared)
- [ ] **Task 2.1**: Migrate `Navbar` and `AdminNavbar`.
- [ ] **Task 2.2**: Migrate `RedirectLoader` and shared CSS files.

### Phase 3: User Pages (Auth & Profile)
- [ ] **Task 3.1**: Migrate `Login` and `Register` components.
- [ ] **Task 3.2**: Migrate `ChangePassword` component.

### Phase 4: User Pages (Catalog & Shopping)
- [ ] **Task 4.1**: Migrate `Home`, `Menu`, and `Item` components.
- [ ] **Task 4.2**: Migrate `Gift` component.
- [ ] **Task 4.3**: Migrate `Cart` and `Checkout` components.
- [ ] **Task 4.4**: Migrate `Order` and `OrderSuccess` components.

### Phase 5: Admin Pages
- [ ] **Task 5.1**: Migrate `AdminLogin` and `AdminRedirect`.
- [ ] **Task 5.2**: Migrate Admin `Dashboard`.
- [ ] **Task 5.3**: Migrate Admin `Users`, `Products`, and `Orders` management.

### Phase 6: Routing & Final Verification
- [ ] **Task 6.1**: Configure all routes in `app.routes.ts`.
- [ ] **Task 6.2**: Final verification, linting, and bug fixes.
- [ ] **Task 6.3**: Write completion report to `report.md`.
