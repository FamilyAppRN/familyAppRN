# Social Login Endpoints (Google & Apple)

This document describes the backend endpoints that the mobile app expects for social login with Google and Apple. The mobile frontend (Expo + Expo Router) already implements the client‑side logic and expects the backend to conform to the existing Auth API contract.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/google` | Sign‑in with Google ID token |
| `POST` | `/api/auth/apple`  | Sign‑in with Apple identity token |

Both endpoints follow the same contract as the existing `/api/auth/login` and `/api/auth/register` endpoints.

## Request Body

### Google

```json
{
  "idToken": "<Google ID token string>"
}
```

### Apple

```json
{
  "identityToken": "<Apple identity token string>"
}
```

*Both fields are required and must be non‑empty strings.*

## Successful Response (200)

The response must match the `authResponseSchema` defined in the frontend (`src/features/auth/data/schemas/authSchema.ts`):

```json
{
  "success": true,
  "message": "Optional message, e.g. 'Signed in with Google'",
  "data": {
    "accessToken": "<JWT access token>",
    "refreshToken": "<JWT refresh token>",
    "user": {
      "id": "<string, user UUID>",
      "firebase_uid": "<optional, Firebase UID if linked>",
      "email": "<string, user email>",
      "name": "<string, user full name>",
      "plan": "<optional, subscription plan>",
      "plan_expires_at": "<optional, ISO date string or null>",
      "notifications_enabled": "<optional, boolean>",
      "created_at": "<optional, ISO date string>",
      "updated_at": "<optional, ISO date string>"
    }
  }
}
```

* The `user` object must contain at least `id`, `email`, and `name`.  
* Optional fields may be omitted or set to `null`/`undefined` as per the Zod schema (they are optional).  
* The access token and refresh token must be issued by your authentication system (e.g., JWT) and must be compatible with the existing `/api/users/me` endpoint (which expects a Bearer token in the `Authorization` header).

## Error Responses

Follow the existing error handling pattern used by the `@core/errors/AppError` interceptor:

* **400 Bad Request** – Missing or malformed `idToken` / `identityToken`.
* **401 Unauthorized** – The token presented to Google/Apple is invalid, expired, or revoked.
* **403 Forbidden** – The token is valid but the associated email domain is not allowed (if you enforce domain restrictions).
* **500 Internal Server Error** – Unexpected failure (e.g., failure to communicate with Google/Apple token verification endpoints).

The error payload should conform to the `AppError` shape used throughout the app:

```json
{
  "error": {
    "message": "Human‑readable error message",
    "statusCode": 400,
    "code": "VALIDATION_ERROR"   // optional app‑specific code
  }
}
```

The frontend’s Axios interceptor (`@core/network/apiClient.ts`) will automatically transform any error response into an `AppError` and throw it, allowing the auth repository to handle it uniformly.

## Implementation Steps

1. **Endpoint Routes**  
   - Add `POST /api/auth/google` and `POST /api/auth/apple` to your auth router.  
   - Keep them under the same base path as `/api/auth/login` and `/api/auth/register`.

2. **Token Verification**  
   - **Google**: Verify the ID token using Google’s public keys (or a trusted library like `google-auth-library`). Ensure the token is issued for your OAuth client ID (`aud` claim) and that the `iss` is `accounts.google.com` or `https://accounts.google.com`.  
   - **Apple**: Verify the identity token using Apple’s public keys (JWKS endpoint `https://appleid.apple.com/auth/keys`). Validate the `aud` (your Services ID), `iss` (`https://appleid.apple.com`), and that the token is not expired.

3. **User Lookup / Creation**  
   - Extract the user’s email, name, and a stable identifier from the token:  
     * Google: `email`, `name` (or `given_name` + `family_name`), `sub` (Google user ID).  
     * Apple: `email`, `name` (from `email` and `name` fields in the JWT payload; if not provided, you may need to rely on the user having previously supplied a name), `sub` (Apple user ID).  
   - Check if a user already exists with that email (or with the platform‑specific `firebase_uid`/`apple_uid` if you store it).  
   - If the user exists, proceed to issue tokens.  
   - If the user does **not** exist, you may:  
     - Automatically create a new account (recommended for a frictionless social login experience), generating a random password or marking the account as “social‑only”.  
     - Or return an error indicating the email is not registered and prompt the user to sign up first (less common for social login).

4. **Token Issuance**  
   - Generate an access token and a refresh token using the same mechanism as the existing email/password login (e.g., JWT signed with your secret, same expiration times).  
   - Populate the `user` object with at least `id`, `email`, and `name`. Optionally fill `firebase_uid` (Google) or an Apple‑specific uid if you store it for later linking.

5. **Response Shape**  
   - Return the JSON payload matching `authResponseSchema`.  
   - Ensure the HTTP status code is `200 OK`.

6. **Error Handling**  
   - Map verification failures to appropriate HTTP status codes (400/401/403) with a JSON error body that the Axios interceptor can convert to an `AppError`.  
   - Do **not** leak raw token validation stack traces; keep messages generic but helpful for legitimate clients.

7. **Testing**  
   - Use the Expo client or a tool like Postman to send a sample ID token (you can obtain a test token from Google’s OAuth playground or Apple’s sandbox).  
   - Verify that the response matches the expected shape and that the mobile app can successfully log in and receive the tokens.  
   - Confirm that the returned access token works with existing protected endpoints (e.g., `/api/users/me`).

## Integration Notes

* The mobile app already calls `AuthRepository.googleLogin(idToken)` and `AuthRepository.appleLogin(identityToken)`.  
* These methods forward the token to the AuthApi, which in turn calls the endpoints defined above via the central `ApiClient`.  
* No changes are required on the mobile side as long as the backend adheres to the contract described herein.  
* Ensure that the new endpoints are behind the same middleware stack (CORS, rate limiting, request logging) as the other auth endpoints.

## Example Implementation (Node.js/Express – pseudocode)

```javascript
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
const appleJwksClient = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys',
});

// Google
app.post('/api/auth/google', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: { message: 'Missing idToken', statusCode: 400 } });

  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    // Find or create user...
    const user = await findOrCreateUserByGoogle(email, name, sub);
    const tokens = generateTokens(user);
    return res.json({ success: true, message: 'Signed in with Google', data: { ...tokens, user: userToDto(user) } });
  } catch (err) {
    return res.status(401).json({ error: { message: 'Invalid Google token', statusCode: 401 } });
  }
});

// Apple
app.post('/api/auth/apple', async (req, res) => {
  const { identityToken } = req.body;
  if (!identityToken) return res.status(400).json({ error: { message: 'Missing identityToken', statusCode: 400 } });

  try {
    const appleKey = await appleJwksClient.getSigningKey(); // simplified
    const payload = jwt.verify(identityToken, appleKey.getPublicKey(), {
      audience: APPLE_SERVICE_ID,
      issuer: 'https://appleid.apple.com',
    });
    const { email, name, sub } = payload;

    // Find or create user...
    const user = await findOrCreateUserByApple(email, name, sub);
    const tokens = generateTokens(user);
    return res.json({ success: true, message: 'Signed in with Apple', data: { ...tokens, user: userToDto(user) } });
  } catch (err) {
    return res.status(401).json({ error: { message: 'Invalid Apple token', statusCode: 401 } });
  }
});
```

Replace helper functions (`findOrCreateUserBy*`, `generateTokens`, `userToDto`) with your actual implementations.

--- 

*End of document.*