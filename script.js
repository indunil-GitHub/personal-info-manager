// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD-Q46deIPhUBiAUemx7WPZQEUPSU7jpOw",
  authDomain: "personalinfomanager-f12d1.firebaseapp.com",
  projectId: "personalinfomanager-f12d1",
  storageBucket: "personalinfomanager-f12d1.appspot.com",
  messagingSenderId: "964784196306",
  appId: "1:964784196306:web:5a5b1fe83e7c326ae2fb0b",
  measurementId: "G-2XQR8GNZ10"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const loginSection = document.getElementById("login-section");
const dashboard = document.getElementById("dashboard");
const message = document.getElementById("message");
const tableBody = document.querySelector("#data-table tbody");

// Auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginSection.style.display = "none";
    dashboard.style.display = "block";
    loadTableData(user.uid);
  } else {
    loginSection.style.display = "block";
    dashboard.style.display = "none";
  }
});

// Login
document.getElementById("loginBtn").onclick = () => {
  const email = document.getElementById("email").value;
  const pw = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, pw)
    .then(() => message.textContent = "Logged in")
    .catch(err => message.textContent = err.message);
};

// Signup
document.getElementById("signupBtn").onclick = () => {
  const email = document.getElementById("email").value;
  const pw = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, pw)
    .then(() => message.textContent = "Account created!")
    .catch(err => message.textContent = err.message);
};

// Logout
document.getElementById("logoutBtn").onclick = () => signOut(auth);

// Save form data
document.getElementById("saveBtn").onclick = async () => {
  const user = auth.currentUser;
  if (!user) return;
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;

  await addDoc(collection(db, "personalData"), {
    uid: user.uid,
    name,
    phone,
    address
  });

  message.textContent = "Information saved successfully!";
  loadTableData(user.uid);
};

// Load Firestore data into table
async function loadTableData(uid) {
  tableBody.innerHTML = "";
  const q = query(collection(db, "personalData"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  let count = 0;

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const row = `<tr><td>${data.name}</td><td>${data.phone}</td><td>${data.address}</td></tr>`;
    tableBody.innerHTML += row;
    count++;
  });

  document.getElementById("userEmail").innerText = auth.currentUser.email;
  document.getElementById("recordCount").innerText = count;
}

// Export to Excel
document.getElementById("exportExcelBtn").onclick = () => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(document.getElementById("data-table"));
  XLSX.utils.book_append_sheet(wb, ws, "PersonalData");
  XLSX.writeFile(wb, "personal_data.xlsx");
};

// Export to PDF
document.getElementById("exportPdfBtn").onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Personal Info Table", 10, 10);

  let y = 20;
  const rows = document.querySelectorAll("#data-table tbody tr");
  rows.forEach((row, i) => {
    const cols = row.querySelectorAll("td");
    const text = `${cols[0].innerText} | ${cols[1].innerText} | ${cols[2].innerText}`;
    doc.text(text, 10, y + i * 10);
  });

  doc.save("personal_data.pdf");
};
