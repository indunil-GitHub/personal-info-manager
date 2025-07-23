// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD-Q46deIPhUBiAUemx7WPZQEUPSU7jpOw",
  authDomain: "personalinfomanager-f12d1.firebaseapp.com",
  projectId: "personalinfomanager-f12d1",
  storageBucket: "personalinfomanager-f12d1.firebasestorage.app",
  messagingSenderId: "964784196306",
  appId: "1:964784196306:web:5a5b1fe83e7c326ae2fb0b",
  measurementId: "G-2XQR8GNZ10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const saveBtn = document.getElementById("saveBtn");

const authSection = document.getElementById("auth-section");
const formSection = document.getElementById("form-section");

// Sign Up
signupBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Signup successful!");
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
});

// Log In
loginBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});

// Auth State Listener
onAuthStateChanged(auth, user => {
  if (user) {
    authSection.style.display = "none";
    formSection.style.display = "block";
  } else {
    authSection.style.display = "block";
    formSection.style.display = "none";
  }
});

// Save Personal Info
saveBtn.addEventListener("click", async () => {
  const name = nameInput.value;
  const phone = phoneInput.value;
  const address = addressInput.value;
  const user = auth.currentUser;

  if (!user) {
    alert("Not logged in.");
    return;
  }

  try {
    await setDoc(doc(db, "users", user.uid), {
      name,
      phone,
      address,
      email: user.email
    });
    alert("Information saved successfully!");
  } catch (error) {
    alert("Failed to save data: " + error.message);
  }
});
