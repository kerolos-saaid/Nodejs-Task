// Object to store userId and their corresponding socketId
const userSockets = {};
let ioInstance = null; // Variable to hold the io instance

// Import necessary services for authentication
import * as TokenService from '../../modules/shared/services/token.service.js';
import prisma from '../../prisma/prisma.js';

export const initSocketService = (io) => {
  ioInstance = io; // Store the io instance

  // Middleware for Socket.IO authentication
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }

    try {
      const decoded = TokenService.decodeAuthToken(token);
      if (!decoded || !decoded.id) {
        return next(new Error('Authentication error: Invalid token payload'));
      }

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user; // Attach user to the socket object
      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}, User ID: ${socket.user?.id}`);

    // Automatically store user ID and socket ID mapping if user is authenticated
    if (socket.user && socket.user.id) {
      userSockets[socket.user.id] = socket.id;
      console.log(`User ${socket.user.id} connected with socket ${socket.id}`);
      console.log('Current user sockets:', userSockets);
    } else {
      // Fallback or prompt for storeUserId if authentication was partial or failed at user attachment
      console.log(`Socket ${socket.id} connected without full user authentication. Waiting for 'storeUserId' if applicable.`);
    }

    // Optional: Event to store/update user ID if needed, e.g., after re-authentication on client-side
    // This can also be used if you allow anonymous users first and then they log in.
    socket.on('storeUserId', (userId) => {
      if (userId) {
        // Potentially re-validate this userId or ensure it matches socket.user.id if present
        userSockets[userId] = socket.id;
        console.log(`User ${userId} (manually stored/updated) with socket ${socket.id}`);
        console.log('Current user sockets:', userSockets);
      }
    });

    socket.on('disconnect', () => {
      let disconnectedUserId = null;
      // Remove user from userSockets on disconnect
      for (const userId in userSockets) {
        if (userSockets[userId] === socket.id) {
          delete userSockets[userId];
          disconnectedUserId = userId;
          break;
        }
      }
      if (disconnectedUserId) {
        console.log(`User ${disconnectedUserId} with socket ${socket.id} disconnected`);
      } else {
        console.log(`Socket ${socket.id} disconnected (user was not in userSockets map)`);
      }
      console.log('Current user sockets:', userSockets);
    });
  });

  console.log('Socket.IO service initialized with authentication middleware');
};

export const sendToUser = (userId, eventName, data) => {
  if (!ioInstance) {
    console.error('Socket.IO not initialized.');
    return;
  }
  const socketId = userSockets[userId];
  if (socketId) {
    ioInstance.to(socketId).emit(eventName, data);
    console.log(`Sent event '${eventName}' to user ${userId} (socket ${socketId}) with data:`, data);
  } else {
    console.log(`User ${userId} not found or offline. Could not send event '${eventName}'.`);
  }
};

export const sendToMultipleUsers = (userIds, eventName, data) => {
  if (!ioInstance) {
    console.error('Socket.IO not initialized.');
    return;
  }
  if (!Array.isArray(userIds)) {
    console.error('userIds should be an array.');
    return;
  }
  userIds.forEach(userId => {
    sendToUser(userId, eventName, data); // Reuses sendToUser for individual dispatch
  });
  console.log(`Finished attempting to send event '${eventName}' to multiple users: ${userIds.join(', ')}.`);
};

export const sendToAll = (eventName, data) => {
  if (!ioInstance) {
    console.error('Socket.IO not initialized.');
    return;
  }
  ioInstance.emit(eventName, data); // This sends to all connected clients, regardless of authentication status.
                                     // If only authenticated users should receive, custom logic would be needed.
  console.log(`Sent event '${eventName}' to all connected users with data:`, data);
};
