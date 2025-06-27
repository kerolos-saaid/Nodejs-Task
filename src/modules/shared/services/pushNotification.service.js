import admin from "firebase-admin";
import envVariables from "../../../config/envVariables.js";
import prisma from "../../../prisma/prisma.js";

// Initialize Firebase Admin SDK
const firebaseConfig = envVariables.FIREBASE;

// Format the private key properly (replace \\n with actual newlines)
const serviceAccount = {
  ...firebaseConfig,
  private_key: firebaseConfig.private_key?.replace(/\\n/g, "\n"),
};

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: firebaseConfig.project_id,
});

export const sendPushNotification = async (
  recipientUserIds,
  notificationData
) => {
  // Fetch only the necessary data from the database
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: recipientUserIds,
      },
      // Filter out users who don't have a push token at the database level
      pushToken: {
        not: null,
      },
    },
    select: {
      pushToken: true,
    },
  });

  // Extract push tokens from the fetched users
  const pushTokens = users.map((user) => user.pushToken).filter(Boolean);
  if (pushTokens.length === 0) {
    console.warn("No valid push tokens found for the provided user IDs.");
    return [];
  }
  // Prepare the message payload
  const message = {
    tokens: pushTokens,
    notification: {
      title: notificationData.title || "Notification",
      body: notificationData.body || "You have a new notification.",
    },
    data: notificationData.data || {},
  };

  // Send the notification using Firebase Admin SDK
  const response = await admin.messaging().sendMulticast(message);

  return response;
};
