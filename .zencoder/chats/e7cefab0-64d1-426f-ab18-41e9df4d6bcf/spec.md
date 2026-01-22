# Technical Specification: Fix Change Password Form Flow

## Technical Context
- **Language**: TypeScript (Angular)
- **Framework**: Angular 21 (Standalone components)
- **Dependencies**: `@angular/common/http`, `FormsModule`, `RouterModule`

## Implementation Approach
The issue is that after successful email verification, the "Change Password" form does not appear, or the user believes it doesn't appear due to a confusing delay between the success message and the form display.

### Identified Issues
1. **Confusing Message vs UI State**: The message "✅ Email verified. Enter new password." is displayed immediately upon successful verification, but the form for entering the new password only appears after a 3-second countdown.
2. **State Resetting**: `emailCountdown` is not reset to 3 at the start of `handleEmailSubmit`, which could cause unexpected behavior on subsequent attempts.
3. **Hardcoded URL**: While not a bug if `localhost:3001` is correct, it's better to use a consistent approach if possible, but the primary task is to fix the flow.
4. **Error Handling**: The `emailCountdown` and `showEmailLoader` should be handled carefully in all cases.

### Proposed Changes
1. **Reset State**: Reset `emailCountdown` to 3 at the beginning of `handleEmailSubmit`.
2. **Immediate Feedback (Optional but recommended)**: Optionally reduce or remove the countdown to show the form immediately, OR change the message to be clearer about the waiting period. However, the requirement is to fix the "bug" where it doesn't open. I will ensure the transition from `showEmailLoader` to `emailVerified` is reliable.
3. **Robust Countdown**: Ensure `clearInterval` is called and states are updated correctly.

## Source Code Structure Changes
No new files will be created. The following file will be modified:
- `frontend/src/app/pages/change-password.component.ts`

## Data Model / API / Interface Changes
None. Existing backend logic remains unchanged.

## Verification Approach
1. **Manual Verification**: Since I cannot run the browser, I will ensure the logic is sound and matches Angular's change detection patterns.
2. **Code Review**: Ensure `this` context is correct (it is, using arrow functions) and that `ngIf` conditions are correctly toggled.
3. **Linting**: Run `ng lint` (if available) or ensure code style is consistent.
