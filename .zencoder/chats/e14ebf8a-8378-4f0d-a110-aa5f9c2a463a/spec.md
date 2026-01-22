# Technical Specification - Fix Change Password Form Opening

## Technical Context
- **Frontend**: Angular 17+ (Standalone components)
- **Backend**: Node.js with Express and MongoDB
- **Communication**: HttpClient (REST API)

## Problem Description
The user reports that after entering the email and verifying it in the "Change Password" page, the password change form does not open.

## Root Cause Analysis
Based on the code in `change-password.component.ts`:
1.  **Artificial Delay**: There is a 3-second countdown (`emailCountdown`) after the email is verified before the form is shown.
2.  **State Reset**: `emailCountdown` is not reset to its initial value (3) if `handleEmailSubmit` is called multiple times.
3.  **User Experience**: The 3-second delay might be perceived as the form "not opening" if the user is impatient or if the countdown logic hangs.

## Implementation Approach
1.  Modify `handleEmailSubmit()` in `change-password.component.ts` to reset `emailCountdown = 3` at the beginning.
2.  Ensure `emailVerified` is set to `true` correctly after the countdown.
3.  Ensure `showEmailLoader` is set to `false` correctly.
4.  Remove the artificial delay if possible, or reduce it to 1 second for a better user experience while still showing a "success" state. I will reduce it to 1 second to make it feel faster but still show the success message.

## Source Code Structure Changes
- `frontend/src/app/pages/change-password.component.ts`: Update `handleEmailSubmit` logic.

## Data Model / API Changes
None. The backend `/verify-email` endpoint is already working correctly.

## Verification Approach
1.  **Manual Testing**:
    - Navigate to `/changepassword`.
    - Enter a valid email address.
    - Click "Verify Email".
    - Observe the loader and the countdown.
    - Verify that the password form (New Password, Confirm Password) appears after the countdown.
2.  **Linting**: Run `npm run lint` if available.
