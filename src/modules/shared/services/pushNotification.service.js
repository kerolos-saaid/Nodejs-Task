import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import envVariables from "../../../config/envVariables";

// Initialize Firebase
const app = initializeApp(envVariables.FIREBASE);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);
