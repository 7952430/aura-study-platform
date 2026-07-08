// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHkaziWnDpZtKrH5OX9L1KwkF_PbxtNCQ",
  authDomain: "aura-study-58537.firebaseapp.com",
  projectId: "aura-study-58537",
  storageBucket: "aura-study-58537.firebasestorage.app",
  messagingSenderId: "834055470029",
  appId: "1:834055470029:web:556e2e605d4b80a93b2284",
  measurementId: "G-V0NJEHW8D2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Override the default form submission to use Firebase Authentication
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  
  // Remove the original inline handler and add our Firebase handler
  loginForm.onsubmit = null;
  loginForm.addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const overlay = document.getElementById('successOverlay');
  
  // Clear previous errors
  const errorMessage = document.getElementById('errorMessage');
  if (errorMessage) {
    errorMessage.style.display = 'none';
  }
  
  // Validate inputs
  if (!email || !password) {
    showError('Please enter both email and password.');
    return;
  }
  
  try {
    // Show loading state
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100');
    
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in:', userCredential.user.email);
    
    // Redirect to dashboard after successful login
    setTimeout(() => {
      window.location.href = 'dashboard_aura_study.html';
    }, 1500);
    
  } catch (error) {
    // Hide overlay on error
    overlay.classList.add('opacity-0', 'pointer-events-none');
    overlay.classList.remove('opacity-100');
    
    // Handle different Firebase errors
    let errorMsg = 'Login failed. Please try again.';
    
    if (error.code === 'auth/user-not-found') {
      errorMsg = 'No account found with this email address.';
    } else if (error.code === 'auth/wrong-password') {
      errorMsg = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/invalid-email') {
      errorMsg = 'Invalid email address.';
    } else if (error.code === 'auth/user-disabled') {
      errorMsg = 'This account has been disabled.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMsg = 'Too many failed login attempts. Please try again later.';
    }
    
    showError(errorMsg);
    console.error('Login error:', error.message);
  }
}

function showError(message) {
  let errorMessage = document.getElementById('errorMessage');
  
  // Create error element if it doesn't exist
  if (!errorMessage) {
    const form = document.getElementById('loginForm');
    errorMessage = document.createElement('div');
    errorMessage.id = 'errorMessage';
    errorMessage.className = 'mb-4 p-3 bg-error/20 border border-error rounded-lg text-error text-body-md';
    form.parentElement.insertBefore(errorMessage, form);
  }
  
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}
