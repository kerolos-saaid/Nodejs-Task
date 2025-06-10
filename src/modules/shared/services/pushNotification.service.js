import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import envVariables from "../config/envVariables";

// Initialize Firebase
const app = initializeApp(envVariables.FIREBASE);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

export const sendPushNotification = async (token, notificationData) => {
  try {
    const response = await messaging.send({
      token,
      notification: {
        title: notificationData.title,
        body: notificationData.body,
      },
    });
    return response;
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw new Error("Failed to send push notification");
  }
};
