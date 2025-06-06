# Reusable Notification Module Guide

## Introduction

This guide explains how to integrate the real-time Notification module (from `src/modules/Notification`) into another Node.js project. This module uses Socket.IO for real-time communication and provides HTTP endpoints for administrators to send notifications.

## Files to Copy

*   **Primary Module:**
    *   `src/modules/Notification/` (copy the entire directory and its contents: `notification.controller.js`, `notification.route.js`, `notification.service.js`, `notification.validation.js`)
*   **Shared Utilities & Middlewares (Adapt or use project equivalents):**
    *   `src/utils/ApiError.js`
    *   `src/utils/AsyncHandler.js`
    *   `src/utils/Token.js` (or more specifically, the functions used by `src/modules/shared/services/token.service.js` if you copy that too)
    *   `src/modules/shared/services/token.service.js` (provides `decodeAuthToken` used in socket authentication)
    *   `src/middlewares/auth.js` (HTTP endpoint authentication)
    *   `src/middlewares/hasPermission.js` (HTTP endpoint authorization)
    *   `src/middlewares/validation.js` (Request body validation for HTTP endpoints)
    *   `src/prisma/prisma.js` (or your project's Prisma client instance)
    *   `src/config/envVariables.js` (for `SOCKET_CORS_ORIGIN`, `TOKEN_SECRET`, etc., or integrate these into your project's config)

## Integration Steps

### 1. Dependencies

Ensure your target project has the following dependencies (install via npm or yarn):
```bash
npm install express socket.io joi jsonwebtoken @prisma/client
# yarn add express socket.io joi jsonwebtoken @prisma/client
```
(Note: `@prisma/client` is needed if you use the Prisma setup as-is.)

### 2. Environment Variables

Ensure your project's `.env` file (or equivalent configuration system) includes:
*   `TOKEN_SECRET`: The secret key used for signing and verifying JWTs (as used by `token.service.js`).
*   `SOCKET_CORS_ORIGIN`: Comma-separated list of allowed origins for Socket.IO connections (e.g., `http://localhost:3001,https://your-client.com`). Defaults to `*` if not set and the module is used as-is.
*   `DATABASE_URL`: If using Prisma as provided.

### 3. Main Application Setup (e.g., `app.js` or `main.js`)

```javascript
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Assuming you've copied envVariables or integrated its values
import envVariables from './config/envVariables.js'; // Adjust path as needed

// Copied notification module components
import { initSocketService } from './modules/Notification/notification.service.js'; // Adjust path
import notificationRouter from './modules/Notification/notification.route.js'; // Adjust path

dotenv.config();

const app = express();
const port = envVariables.PORT || 3000;

app.use(express.json()); // If not already used

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.IO
const socketCorsOrigins = envVariables.SOCKET_CORS_ORIGIN.split(',');
const io = new Server(httpServer, {
  cors: {
    origin: socketCorsOrigins.length === 1 && socketCorsOrigins[0] === "*" ? "*" : socketCorsOrigins,
    methods: ["GET", "POST"],
    // credentials: true // If you need to handle cookies/sessions via Socket.IO
  }
});

// Initialize Notification Service (and its Socket.IO authentication)
initSocketService(io);

// Mount Notification HTTP routes (for admin sending)
// Ensure this path matches what admins will use, e.g., /api/notifications
app.use('/notifications', notificationRouter);

// Your other routes and middlewares
// app.use('/api/users', userRouter);
// app.use(globalErrorHandler);

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Socket.IO initialized with CORS origins: ${envVariables.SOCKET_CORS_ORIGIN}`);
});
```

### 4. Authentication & Authorization Adaptation

This is the most crucial part for successful integration.

*   **Socket.IO Authentication (`notification.service.js`):**
    *   The current `initSocketService` uses `TokenService.decodeAuthToken(token)` (from `src/modules/shared/services/token.service.js`) and `prisma.user.findUnique({ where: { id: decoded.id } })`.
    *   **Action:** You MUST adapt these calls to your project's existing:
        *   Token decoding/verification logic.
        *   User model fetching mechanism (e.g., different ORM, database structure).
        *   The user object attached to `socket.user` must have an `id` property.

*   **HTTP Endpoint Authentication/Authorization (`notification.route.js`):**
    *   Routes use `auth()` and `hasPermission(['send_notifications'])`.
    *   **Action:**
        *   Replace or adapt the `auth` middleware to your project's HTTP authentication. It should attach a `user` object to the `req`.
        *   Replace or adapt the `hasPermission` middleware. The `req.user` object must have a `permissions` array (or similar mechanism) if you keep `hasPermission` as-is.
        *   Ensure the permission `send_notifications` is defined in your project's access control system if you use the `hasPermission` middleware directly.

### 5. User Model

The notification service (both socket auth and HTTP endpoints if using provided auth) expects a user object with at least an `id` property. If using `hasPermission` as-is, it also expects a `permissions` array on the user object.

### 6. Client-Side Implementation

Clients connect to the Socket.IO server, providing their JWT in `socket.handshake.auth.token`.

```javascript
import { io } from 'socket.io-client';

// Replace with your server URL and a valid JWT token
const socket = io('http://your-server-address/your-socket-path', { // e.g., http://localhost:3000
  auth: {
    token: 'your_jwt_token_here'
  }
});

socket.on('connect', () => {
  console.log('Successfully connected to the notification server:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err.message, err.data); // err.data might contain more info from server
});

// Listen for specific notification events defined by your application
socket.on('new_order_update', (data) => {
  console.log('Order Update:', data);
  // e.g., display a toast notification
});

socket.on('message_received', (data) => {
  console.log('New Message:', data);
});
```

### 7. Admin Endpoints Summary

The following POST HTTP endpoints are available if you mount `notificationRouter` (e.g., under `/notifications`):

*   **`/send-to-user`**:
    *   Body: `{ "userId": "string", "eventName": "string", "data": {} }`
*   **`/send-to-multiple-users`**:
    *   Body: `{ "userIds": ["string"], "eventName": "string", "data": {} }`
*   **`/send-to-all`**:
    *   Body: `{ "eventName": "string", "data": {} }`

These endpoints require authentication and the `send_notifications` permission by default.

## Making it More Reusable (Future Considerations)

To make the module even more decoupled and easier to integrate into diverse projects:

*   **Pass Services/Functions to `initSocketService`:**
    *   Instead of directly importing `TokenService` and `prisma`, `initSocketService` could accept arguments like `verifyTokenFunction` and `findUserByIdFunction`.
    *   Example: `initSocketService(io, { verifyToken: myProjectTokenVerifier, findUser: myProjectUserFinder })`.
*   **Generic User Object:** Define a minimal user interface/contract that the notification service expects (e.g., `{ id: string, [key: string]: any }`).
*   **Configurable Permission Key:** Allow the required permission key (`send_notifications`) to be passed as a configuration option.

By following this guide and adapting the authentication/authorization parts, you can effectively reuse this Notification module.
