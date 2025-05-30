# Portable Notification Service - Usage Examples

## 📁 **Reusable Notification Service**

The `notification.service.js` file a completely **self-contained** and can be copied to any Node.js project. It includes:

- ✅ Complete Socket.IO server setup with JWT authentication
- ✅ Connection management and user tracking
- ✅ Rate limiting and security validation
- ✅ Structured logging and metrics
- ✅ Production-ready error handling
- ✅ Unlimited connections support

## 🚀 **Quick Integration in Any Project**

### **Step 1: Copy the Service File**

```bash
# Copy the single file to your project
cp notification.service.js ./services/
```

### **Step 2: Initialize in Your Project**

```javascript
import express from "express";
import { createServer } from "http";
import { init as initNotificationService } from "./services/notification.service.js";

const app = express();
const httpServer = createServer(app);

// Your token decoder function (customize as needed)
const decodeToken = (token) => {
  // Your JWT decoding logic here
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Initialize notification service with your configuration
const notificationAPI = initNotificationService(
  httpServer,
  {
    path: "/socket.io",
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
      credentials: true,
    },
    userIdField: "_id", // or 'id', 'userId', 'sub', etc.
    bearerPrefix: "Bearer",
    maxConnections: 1000, // or null for unlimited connections
    enableDebugLogs: process.env.NODE_ENV === "development",
    enableMetrics: process.env.ENABLE_METRICS !== "false",
  },
  decodeToken
);

httpServer.listen(3000);
```

### **Step 3: Use the Service**

```javascript
import {
  notifyUser,
  notifyMultipleUsers,
  broadcastNotification,
  checkUserOnlineStatus,
  getOnlineUsers,
  getNotificationStats,
  NOTIFICATION_TYPES,
} from "./services/notification.service.js";

// Send notification to specific user
await notifyUser("user123", "Welcome to our app!", {
  type: NOTIFICATION_TYPES.INFO,
  actionUrl: "/dashboard",
});

// Send notification to multiple users
await notifyMultipleUsers(
  ["user123", "user456", "user789"],
  "New feature available!",
  {
    type: NOTIFICATION_TYPES.INFO,
    feature: "dark-mode",
    actionUrl: "/settings",
  }
);

// Broadcast system announcement
await broadcastNotification("Server maintenance in 5 minutes", {
  type: NOTIFICATION_TYPES.SYSTEM,
  priority: "high",
});

// Check if user is online
const statusResult = await checkUserOnlineStatus("user123");
console.log(`User is ${statusResult.isOnline ? "online" : "offline"}`);

// Get all online users
const onlineUsers = await getOnlineUsers();
console.log(`${onlineUsers.count} users online:`, onlineUsers.connectedUsers);

// Get service statistics
const stats = await getNotificationStats();
console.log("Service stats:", stats);
```

## 🔧 **Configuration Options**

```javascript
const config = {
  // Socket.IO settings
  path: "/socket.io", // Socket.IO endpoint path
  cors: corsOptions, // CORS configuration

  // Authentication
  userIdField: "_id", // JWT field containing user ID
  bearerPrefix: "Bearer", // Authorization header prefix

  // Connection limits
  maxConnections: 1000, // Max concurrent connections
  // Set to null, 0, or Infinity for unlimited
  connectionTimeout: 20000, // Connection timeout (ms)
  heartbeatInterval: 25000, // Heartbeat interval (ms)
  heartbeatTimeout: 60000, // Heartbeat timeout (ms)

  // Features
  enableDebugLogs: false, // Enable debug logging
  enableMetrics: true, // Enable metrics tracking

  // Security limits (built-in, not configurable via config)
  limits: {
    MESSAGE_LENGTH: 1000, // Max message length
    DATA_SIZE: 10000, // Max data payload size (bytes)
    BATCH_SIZE: 100, // Max users per batch
    USER_ID_LENGTH: 100, // Max user ID length
  },
};
```

## 📡 **API Functions Available**

### **Core Functions**

```javascript
// Initialize the service (required first)
const api = init(httpServer, config, tokenDecoder);

// Direct API access (low-level)
api.sendToUser(userId, event, data);
api.sendToMultipleUsers(userIds, event, data);
api.broadcastToAll(event, data);
api.isUserOnline(userId);
api.getConnectedUsers();
api.getConnectedUsersCount();
api.getStats();
api.resetMetrics();
api.shutdown();
```

### **Business Logic Functions** (Recommended)

```javascript
// High-level business functions with validation
await notifyUser(userId, message, additionalData);
await notifyMultipleUsers(userIds, message, additionalData);
await broadcastNotification(message, additionalData);
await checkUserOnlineStatus(userId);
await getOnlineUsers();
await getNotificationStats();

// Direct API helpers (low-level access)
sendToUser(userId, event, data);
sendToMultipleUsers(userIds, event, data);
broadcastToAll(event, data);
isUserOnline(userId);
getConnectedUsers();
getConnectedUsersCount();
getStats();
resetMetrics();
shutdown();
```

### **Notification Types**

```javascript
import { NOTIFICATION_TYPES } from "./notification.service.js";

// Available types
NOTIFICATION_TYPES.INFO; // 'info'
NOTIFICATION_TYPES.SUCCESS; // 'success'
NOTIFICATION_TYPES.WARNING; // 'warning'
NOTIFICATION_TYPES.ERROR; // 'error'
NOTIFICATION_TYPES.SYSTEM; // 'system'
NOTIFICATION_TYPES.BROADCAST; // 'broadcast'
```

## 🌐 **Client Integration**

### **JavaScript/React Client**

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  extraHeaders: {
    Authorization: `Bearer ${userToken}`,
  },
});

// Listen for notifications
socket.on("notification", (data) => {
  console.log("Notification received:", data);
  // Show notification in UI
  showNotification(data.message, data.type);
});

// Listen for custom events
socket.on("user_updated", (data) => {
  console.log("User profile updated:", data);
});

// Health check
socket.on("connect", () => {
  console.log("Connected to notification service");
});

// Handle disconnect
socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

// Server shutdown notification
socket.on("server_shutdown", (data) => {
  console.log("Server shutting down:", data.message);
});
```

### **React Hook Example**

```javascript
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const useNotifications = (token) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const newSocket = io(process.env.REACT_APP_SERVER_URL, {
      extraHeaders: { Authorization: `Bearer ${token}` },
    });

    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));

    newSocket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    // Handle authentication errors
    newSocket.on("connect_error", (error) => {
      console.error("Connection failed:", error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token]);

  const clearNotifications = () => setNotifications([]);

  return { socket, notifications, isConnected, clearNotifications };
};
```

## 🌐 **HTTP API Endpoints** (Optional Integration)

If you include the HTTP routes, you get these endpoints:

```javascript
// Core notification endpoints
POST /notifications/send-to-user          // Send to specific user
POST /notifications/send-to-multiple      // Send to multiple users
POST /notifications/broadcast             // Broadcast to all

// Custom event endpoints
POST /notifications/send-event-to-user    // Send custom event to user
POST /notifications/send-event-to-multiple // Send custom event to multiple
POST /notifications/broadcast-event       // Broadcast custom event

// Monitoring endpoints
GET  /notifications/health                // Health check
GET  /notifications/stats                 // Service statistics
GET  /notifications/online-users          // List connected users
GET  /notifications/user/:userId/status   // Check user online status

// Admin endpoints
POST /notifications/admin/reset-metrics   // Reset metrics
```

### **HTTP API Usage Examples**

```javascript
// Send notification via HTTP
const response = await fetch("/notifications/send-to-user", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    userId: "user123",
    message: "Hello!",
    data: { type: "info" },
  }),
});

// Get service health
const health = await fetch("/notifications/health").then((r) => r.json());
console.log("Service status:", health.status);
```

## 🏗️ **Different Project Examples**

### **Express.js Project**

```javascript
// app.js
import express from "express";
import { createServer } from "http";
import { init, notifyUser } from "./notification.service.js";
import jwt from "jsonwebtoken";

const app = express();
const server = createServer(app);

const decodeToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const notificationAPI = init(
  server,
  {
    userIdField: "sub",
    maxConnections: null, // 🚀 Unlimited connections
    cors: { origin: "https://myapp.com" },
  },
  decodeToken
);

app.post("/send-welcome", async (req, res) => {
  const { userId } = req.body;
  const result = await notifyUser(userId, "Welcome!");
  res.json(result);
});

server.listen(3000);
```

### **NestJS Project**

```javascript
// notification.service.ts
import { Injectable } from '@nestjs/common';
import { init, notifyUser } from './notification.service.js';

@Injectable()
export class NotificationService {
  private api;

  onModuleInit() {
    this.api = init(this.httpServer, {
      userIdField: 'userId',
      maxConnections: 5000
    }, this.jwtService.decode.bind(this.jwtService));
  }

  async sendWelcome(userId: string) {
    return await notifyUser(userId, 'Welcome to our platform!');
  }
}
```

### **Fastify Project**

```javascript
// server.js
import Fastify from "fastify";
import { init, broadcastNotification } from "./notification.service.js";

const fastify = Fastify();

const notificationAPI = init(
  fastify.server,
  {
    path: "/notifications",
    userIdField: "user_id",
  },
  (token) => fastify.jwt.verify(token)
);

fastify.post("/broadcast", async (request, reply) => {
  const { message } = request.body;
  const result = await broadcastNotification(message);
  return result;
});

await fastify.listen({ port: 3000 });
```

## 📊 **Monitoring & Health Checks**

```javascript
import { getNotificationStats } from "./notification.service.js";

// Health check endpoint
app.get("/health/notifications", async (req, res) => {
  try {
    const stats = await getNotificationStats();
    res.json({
      status: "healthy",
      connections: stats.connectedUsers,
      uptime: stats.metrics?.uptime || 0,
    });
  } catch (error) {
    res.status(503).json({ status: "unhealthy" });
  }
});

// Metrics endpoint
app.get("/metrics/notifications", async (req, res) => {
  const stats = await getNotificationStats();
  res.json(stats);
});
```

## 🔄 **Environment-Based Configuration**

```javascript
// config/notification.js
export const getNotificationConfig = () => ({
  maxConnections:
    process.env.NODE_ENV === "production"
      ? process.env.MAX_CONNECTIONS === "unlimited"
        ? null
        : 5000
      : 100,
  enableDebugLogs: process.env.NODE_ENV === "development",
  cors: {
    origin: process.env.CORS_ORIGINS?.split(",") || "*",
    credentials: true,
  },
  userIdField: process.env.JWT_USER_FIELD || "_id",
  enableMetrics: process.env.ENABLE_METRICS !== "false",
});

// Usage
const config = getNotificationConfig();
const api = init(httpServer, config, tokenDecoder);
```

## 🚀 **Unlimited Connections**

```javascript
// Enable unlimited connections
const config = {
  maxConnections: null, // No limit
  // or: 0, Infinity, -1 (any non-finite number)
  enableDebugLogs: false,
  enableMetrics: true,
};

// Monitor when unlimited
setInterval(async () => {
  const stats = await getNotificationStats();
  if (stats.connectedUsers > 10000) {
    console.warn("High connection count:", stats.connectedUsers);
  }
}, 30000);
```

## ✅ **Key Benefits**

1. **Single File**: Everything in one portable file
2. **Zero External Dependencies**: Only requires Socket.IO (which you likely already have)
3. **Flexible Configuration**: Customize everything via config object
4. **Token Agnostic**: Pass your own JWT decoder function
5. **Production Ready**: Built-in security, rate limiting, monitoring
6. **Framework Agnostic**: Works with Express, Fastify, NestJS, etc.
7. **TypeScript Ready**: Easy to add TypeScript definitions
8. **Unlimited Connections**: Support for unlimited concurrent connections
9. **Self-Contained**: No external config files needed

## 🎯 **Quick Start Checklist**

- [ ] Copy `notification.service.js` to your project
- [ ] Import `init` function and your JWT decoder
- [ ] Call `init(httpServer, config, tokenDecoder)`
- [ ] Use `notifyUser`, `notifyMultipleUsers`, `broadcastNotification`
- [ ] Set up client with Socket.IO and Authorization header
- [ ] Optional: Add HTTP routes for REST API access

The notification service is now truly portable and can be dropped into any Node.js project with minimal configuration! 🎉
