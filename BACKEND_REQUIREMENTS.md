# Backend API Requirements for EcomEZ Enterprise Features

## 1. Authentication and Security

### 1.1. Two-Factor Authentication (2FA)

- **`POST /auth/2fa/setup`**: Generates a 2FA secret and a QR code for the authenticated user.
  - **Response**: `{ "secret": "...", "qr_code_svg": "..." }`
- **`POST /auth/2fa/verify`**: Verifies a 2FA code provided by the user.
  - **Request**: `{ "code": "123456" }`
  - **Response**: `{ "verified": true }`
- **`DELETE /auth/2fa/disable`**: Disables 2FA for the authenticated user.
  - **Response**: `{ "message": "2FA disabled" }`

### 1.2. Single Sign-On (SSO)

- **`GET /auth/sso/providers`**: Returns a list of configured SSO providers.
  - **Response**: `[{ "id": "google", "name": "Google Workspace" }, ...]`
- **`GET /auth/sso/google/redirect`**: Redirects the user to the Google authentication page.
- **`POST /auth/sso/google/callback`**: Handles the callback from Google after successful authentication.

## 2. User Management and Permissions

### 2.1. Granular Permissions

- The `user` object in the API responses should include a `permissions` array, e.g., `["orders:read", "team:invite"]`.
- The backend should enforce these permissions on all relevant endpoints.

## 3. Saved Views and Filters

### 3.1. Saved Views for Orders

- **`GET /views/orders`**: Returns a list of saved views for the authenticated user.
  - **Response**: `[{ "id": "...", "name": "...", "filters": { ... } }, ...]`
- **`POST /views/orders`**: Creates a new saved view.
  - **Request**: `{ "name": "...", "filters": { ... } }`
  - **Response**: The newly created saved view object.
- **`DELETE /views/orders/{id}`**: Deletes a saved view.
  - **Response**: `{ "message": "View deleted" }`

## 4. Global Search

### 4.1. Search Endpoint

- **`GET /search?q={query}`**: Performs a global search across orders, customers, etc.
  - **Response**: `[{ "type": "order", "data": { ... } }, { "type": "customer", "data": { ... } }]`
