// ============================================
// AUTHENTICATION PAGE SCRIPTS
// ============================================

const API_BASE = 'http://localhost:5000/api';

// DOM Elements
const signInForm = document.getElementById('signin-form-element');
const signUpForm = document.getElementById('signup-form-element');
const toggleButtons = document.querySelectorAll('.toggle-form');
const formWrappers = document.querySelectorAll('.form-wrapper');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkAuth();
});

function setupEventListeners() {
    // Toggle between forms
    toggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetForm = button.getAttribute('data-target');
            switchForm(targetForm);
        });
    });

    // Form submissions
    signInForm.addEventListener('submit', handleSignIn);
    signUpForm.addEventListener('submit', handleSignUp);
}

function switchForm(formId) {
    // Hide all forms
    formWrappers.forEach(wrapper => {
        wrapper.classList.remove('active');
    });

    // Show target form
    const targetForm = document.getElementById(formId);
    if (targetForm) {
        targetForm.classList.add('active');
    }
}

async function handleSignIn(e) {
    e.preventDefault();

    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    const errorElement = signInForm.querySelector('.form-error');

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Store token
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to dashboard
            showNotification('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            errorElement.textContent = data.error || 'Login failed';
            errorElement.style.display = 'block';
        }
    } catch (error) {
        errorElement.textContent = 'Connection error. Please try again.';
        errorElement.style.display = 'block';
        console.error('Sign in error:', error);
    }
}

async function handleSignUp(e) {
    e.preventDefault();

    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const firstName = document.getElementById('signup-firstname').value;
    const lastName = document.getElementById('signup-lastname').value;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const errorElement = signUpForm.querySelector('.form-error');

    // Validate
    if (password.length < 6) {
        errorElement.textContent = 'Password must be at least 6 characters';
        errorElement.style.display = 'block';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                timezone,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // Store token
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to dashboard
            showNotification('Account created successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            errorElement.textContent = data.error || 'Registration failed';
            errorElement.style.display = 'block';
        }
    } catch (error) {
        errorElement.textContent = 'Connection error. Please try again.';
        errorElement.style.display = 'block';
        console.error('Sign up error:', error);
    }
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        // User is already authenticated, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        z-index: 1001;
        background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
