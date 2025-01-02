// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp, getApp } from "firebase/app";
import "firebase/auth";
import { getFirestore } from "firebase/firestore";

export let app: FirebaseApp; //app을 지역변수로 선언

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
};

try {
  app = getApp("app");
} catch (e) {
  app = initializeApp(firebaseConfig, "app");
}

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
//다른 페이지에서 사용할 수 있도록 export
export const db = getFirestore(app);

export default firebase;
