document.addEventListener('DOMContentLoaded', function() {
    // Firebase Auth Integration
    async function firebaseLogin(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            if (!user.emailVerified) {
                await auth.signOut();
                alert('Please verify your email before logging in. Check your inbox for a verification link.');
                return false;
            }
            localStorage.setItem('forum_token', await user.getIdToken());
            localStorage.setItem('forum_username', user.displayName || user.email);
            return true;
        } catch (error) {
            alert(error.message || 'Login failed');
            return false;
        }
    }

    async function firebaseSignup(username, email, password) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            // Set displayName
            await user.updateProfile({ displayName: username });
            // Send email verification
            await user.sendEmailVerification();
            alert('Signup successful! Please check your email and verify your account before logging in.');
            await auth.signOut();
            return false;
        } catch (error) {
            alert(error.message || 'Signup failed');
            return false;
        }
    }
    // --- Computer slide-in/out logic ---
    const pageWrapper = document.querySelector('.page-wrapper');
    const statsSection = document.getElementById('stats');
    const computerDisplay = document.querySelector('.fixed-computer-display');

    function handleComputerDisplay() {
        if (!pageWrapper || !statsSection || !computerDisplay) return;
        const rect = statsSection.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
            pageWrapper.classList.add('computer-active');
            pageWrapper.classList.remove('scrolling-away');
        } else {
            pageWrapper.classList.remove('computer-active');
            pageWrapper.classList.add('scrolling-away');
        }
    }
    window.addEventListener('scroll', handleComputerDisplay);
    window.addEventListener('resize', handleComputerDisplay);
    handleComputerDisplay(); // Initial check

    // Auth page logic
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');

    if (showSignup) {
        showSignup.addEventListener('click', function(event) {
            event.preventDefault();
            loginContainer.style.display = 'none';
            signupContainer.style.display = 'block';
        });
    }

    // Handle login form submit
    const loginForm = loginContainer ? loginContainer.querySelector('form') : null;
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const success = await firebaseLogin(email, password);
            if (success) {
                window.location.href = 'forum.html';
            }
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', function(event) {
            event.preventDefault();
            signupContainer.style.display = 'none';
            loginContainer.style.display = 'block';
        });
    }

    // Handle signup form submit
    const signupForm = signupContainer ? signupContainer.querySelector('form') : null;
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('confirm-password').value;
            if (password !== confirm) {
                alert('Passwords do not match');
                return;
            }
            const success = await firebaseSignup(username, email, password);
            if (success) {
                window.location.href = 'forum.html';
            }
        });
    }

    // Splash screen fade out for events.html
    const splash = document.getElementById('splash-screen');
    if (splash) {
        setTimeout(function() {
            splash.style.transition = 'opacity 0.8s ease';
            splash.style.opacity = '0';
            setTimeout(function() {
                splash.style.display = 'none';
            }, 800);
        }, 1200);
    }

    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
});