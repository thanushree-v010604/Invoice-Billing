import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDfSH6F6l3h0l3DdNIaBo8-uQ8AuxigI-8",
  authDomain: "billing-pro-ea210.firebaseapp.com",
  projectId: "billing-pro-ea210",
  storageBucket: "billing-pro-ea210.appspot.com", // ✅ FIXED
  messagingSenderId: "113566517394",
  appId: "1:113566517394:web:2badf94f60ce0968adfe4b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);