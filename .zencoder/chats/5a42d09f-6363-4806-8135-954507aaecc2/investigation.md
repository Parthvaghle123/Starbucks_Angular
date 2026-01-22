# Bug Investigation: 404 Error on Order Cancellation

## Bug Summary
When a user tries to cancel an order from the "My Orders" page, the application makes a `PUT` request to `http://localhost:3001/api/cancel-order/<mongodb_id>`, which results in a `404 Not Found` error.

## Root Cause Analysis
1.  **Incorrect Endpoint**: The frontend is calling `api/cancel-order/:id`, but the backend route is defined as `PUT /cancel/:orderId` within the order router, which is mounted at `/api/order`. Therefore, the correct endpoint is `api/order/cancel/:orderId`.
2.  **Incorrect ID Type**: The frontend is sending the MongoDB `_id` (e.g., `696e4f941719fa374762cd28`), but the backend route `PUT /api/order/cancel/:orderId` expects the custom serial `orderId` (e.g., `2026001`) to find the order using `Order.findOne({ orderId })`.

## Affected Components
- **Frontend**: `frontend/src/app/pages/order.component.ts`
- **Backend**: (Endpoint mismatch, but the backend route itself seems correctly defined for its intended use case).

## Proposed Solution
1.  Modify `frontend/src/app/pages/order.component.ts`:
    - In `openCancelModal(order: Order)`, set `this.cancelOrderId = order.orderId` instead of `order._id`.
    - In `handleCancel(e: Event)`, change the API endpoint to `api/order/cancel/${this.cancelOrderId}`.
