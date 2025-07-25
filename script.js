document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0); // Ensure page starts at the top
    history.scrollRestoration = 'manual'; // Force page to always start at the top

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.side-nav a');
    const cursor = document.querySelector('.cursor');
    const computerScreenImage = document.getElementById('computer-screen-image');
    const splashScreen = document.getElementById('splash-screen');
    const bootSound = document.getElementById('boot-sound');
    const terminalInput = document.querySelector('.terminal-input');
    const terminalOutput = document.querySelector('.terminal-output');
    const fixedComputerDisplay = document.querySelector('.fixed-computer-display');
    const pageWrapper = document.querySelector('.page-wrapper');

    // Hide splash screen after a delay and play sound
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        if (bootSound) {
            bootSound.play();
        }
    }, 3000); // 3 seconds

    // Custom Cursor
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Function to update active nav link and computer screen image
    const updateActiveSection = () => {
        let currentActiveSectionId = 'hero';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop - sectionHeight / 3 && window.scrollY < sectionTop + sectionHeight - sectionHeight / 3) {
                currentActiveSectionId = section.id;
                // Trigger glitch effect before changing image
                computerScreenImage.classList.add('glitch-effect');
                setTimeout(() => {
                    computerScreenImage.src = section.dataset.image;
                    computerScreenImage.classList.remove('glitch-effect');
                }, 300); // Glitch duration

                // Animate content blocks
                const contentBlocks = section.querySelectorAll('h1, h2, p, .subtitle, .card h3, .card h4, .card p, .content-block > *, li, span, a');
                contentBlocks.forEach((block, index) => {
                    setTimeout(() => {
                        block.classList.add('is-visible');
                    }, index * 100);
                });
            } else {
                section.querySelectorAll('h1, h2, p, .subtitle, .card h3, .card h4, .card p, .content-block > *, li, span, a').forEach(block => {
                    block.classList.remove('is-visible');
                });
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
                link.classList.add('active');
            }
        });

        // Computer visibility and scrolling behavior
        const heroSection = document.getElementById('hero');
        const statsSection = document.getElementById('stats');
        const faqSection = document.getElementById('faq');

        if (heroSection && statsSection && faqSection) {
            const statsSectionTop = statsSection.offsetTop;
            const faqSectionTop = faqSection.offsetTop;
            const computerHeight = fixedComputerDisplay.offsetHeight;
            const viewportHeight = window.innerHeight;

            // The computer should start scrolling away when the top of the FAQ section is about to enter the viewport.
            // We subtract the computer's height to ensure it's completely gone before the FAQ section is visible.
            const unstickScrollPosition = faqSectionTop - viewportHeight;

            if (window.scrollY < statsSectionTop) {
                // On hero section: hidden
                fixedComputerDisplay.classList.remove('active-scroll', 'locked', 'scrolling-away');
                pageWrapper.classList.remove('computer-active');
                fixedComputerDisplay.style.position = 'fixed';
                fixedComputerDisplay.style.top = '100vh'; // Position it below the viewport
            } else if (window.scrollY >= statsSectionTop && window.scrollY < unstickScrollPosition) {
                // After hero, before unstick point (FAQ): fixed in center
                fixedComputerDisplay.classList.add('active-scroll', 'locked');
                fixedComputerDisplay.classList.remove('scrolling-away');
                pageWrapper.classList.add('computer-active');
                fixedComputerDisplay.style.position = 'fixed';
                fixedComputerDisplay.style.top = '50%';
            } else {
                // After unstick point (at or after FAQ): scrolls away
                fixedComputerDisplay.classList.add('scrolling-away');
                fixedComputerDisplay.classList.remove('locked');
                // The transitionend event will handle removing 'computer-active' from the page wrapper
            }
        }
    };

    // Listen for the end of the computer display's transition
    fixedComputerDisplay.addEventListener('transitionend', (event) => { // Added event parameter
        // Ensure we only act when the 'right' property transition ends
        if (event.propertyName === 'right' && fixedComputerDisplay.classList.contains('scrolling-away')) {
            pageWrapper.classList.remove('computer-active');
        }
    });

    // Initial call and scroll event listener
    // Check if it's index.html or other pages
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        updateActiveSection();
        window.addEventListener('scroll', updateActiveSection);
    } else {
        // For other pages (events.html, apply.html), make all content visible immediately
        sections.forEach(section => {
            const contentBlocks = section.querySelectorAll('h1, h2, p, .subtitle, .card h3, .card h4, .card p, .content-block > *, li, span, a');
            contentBlocks.forEach(block => {
                block.classList.add('is-visible');
            });
        });
    }

    // Smooth Scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Terminal functionality
    terminalInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();
            terminalOutput.innerHTML += `\n> ${command}`;
            terminalInput.value = '';

            switch (command.toLowerCase()) {
                case 'help':
                    terminalOutput.innerHTML += `\nAvailable commands: about, contact, clear`;
                    break;
                case 'about':
                    terminalOutput.innerHTML += `\nSilicon Circle is a community by teens, for teens.`;
                    break;
                case 'contact':
                    terminalOutput.innerHTML += `\nEmail: info@siliconcircle.com`;
                    break;
                case 'clear':
                    terminalOutput.innerHTML = 'Welcome to the Silicon Circle terminal. Type \'help\' for commands.';
                    break;
                default:
                    terminalOutput.innerHTML += `\nUnknown command: ${command}`; 
            }
            terminalOutput.scrollTop = terminalOutput.scrollHeight; // Scroll to bottom
        }
    });
});