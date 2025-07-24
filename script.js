// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Config from your Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyD-Q46deIPhUBiAUemx7WPZQEUPSU7jpOw",
  authDomain: "personalinfomanager-f12d1.firebaseapp.com",
  projectId: "personalinfomanager-f12d1",
  storageBucket: "personalinfomanager-f12d1.firebasestorage.app",
  messagingSenderId: "964784196306",
  appId: "1:964784196306:web:5a5b1fe83e7c326ae2fb0b",
  measurementId: "G-2XQR8GNZ10"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authSection = document.getElementById("auth-section");
const formSection = document.getElementById("form-section");

const nameField = document.getElementById("name");
const phoneField = document.getElementById("phone");
const addressField = document.getElementById("address");
const saveBtn = document.getElementById("saveBtn");
const tableBody = document.querySelector("#data-table tbody");

// Auth
signupBtn.onclick = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => alert("Sign up successful!"))
    .catch(err => alert(err.message));
};

loginBtn.onclick = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => alert("Login successful!"))
    .catch(err => alert(err.message));
};

logoutBtn.onclick = () => {
  signOut(auth).then(() => alert("Logged out!"));
};

// Save details
saveBtn.onclick = async () => {
  const name = nameField.value.trim();
  const phone = phoneField.value.trim();
  const address = addressField.value.trim();
  const user = auth.currentUser;

  if (!user || !name || !phone || !address) {
    alert("Fill all fields.");
    return;
  }

  try {
    await addDoc(collection(db, "personalData"), {
      uid: user.uid,
      name,
      phone,
      address
    });
    alert("Information saved successfully!");
    nameField.value = phoneField.value = addressField.value = "";
    loadTableData(user.uid);
  } catch (err) {
    alert("Error saving: " + err.message);
  }
};

// Show/Hide sections based on login
onAuthStateChanged(auth, (user) => {
  if (user) {
    authSection.style.display = "none";
    formSection.style.display = "block";
    loadTableData(user.uid);
  } else {
    authSection.style.display = "block";
    formSection.style.display = "none";
  }
});

// Load Firestore data into table
async function loadTableData(uid) {
  tableBody.innerHTML = "";
  const q = query(collection(db, "personalData"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const row = `<tr><td>${data.name}</td><td>${data.phone}</td><td>${data.address}</td></tr>`;
    tableBody.innerHTML += row;
  });
}
