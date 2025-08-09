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
    const powerLight = document.querySelector('.power-light');

    gsap.to(powerLight, {
        backgroundColor: '#33ff33',
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
    // Hide splash screen after a delay and play sound
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        if (bootSound) {
            try {
                bootSound.play();
            } catch (error) {
                console.log("Audio autoplay was prevented by the browser.");
            }
        }
    }, 3000); // 3 seconds

    // Custom Cursor
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const handleComputerVisibility = (currentActiveSectionId) => {
        const heroSection = document.getElementById('hero');
        const statsSection = document.getElementById('stats');
        const aboutSection = document.getElementById('about');
        const faqSection = document.getElementById('faq');
        const fixedComputerDisplay = document.querySelector('.fixed-computer-display');

        if (fixedComputerDisplay) {
            if (heroSection && statsSection && faqSection && aboutSection) {
                const statsSectionTop = statsSection.offsetTop;
                const aboutSectionBottom = aboutSection.offsetTop + aboutSection.offsetHeight;

                // Using GSAP's matchMedia for responsive animations
                gsap.matchMedia().add({
                    isDesktop: `(min-width: 769px)`,
                    isMobile: `(max-width: 768px)`
                }, (context) => {
                    let { isDesktop, isMobile } = context.conditions;

                    if (currentActiveSectionId === 'hero' || currentActiveSectionId === 'faq') {
                        // On hero section or faq section: hidden
                        if (isDesktop) {
                            gsap.to(fixedComputerDisplay, { right: '-700px', opacity: 0, duration: 0.5, ease: 'power2.out' });
                        } else {
                            gsap.to(fixedComputerDisplay, { opacity: 0, scale: 0.9, duration: 0.5, ease: 'power2.out' });
                        }
                        pageWrapper.classList.remove('computer-active');
                        pageWrapper.classList.remove('computer-visible');
                    } else if (currentActiveSectionId === 'apply' || (window.scrollY >= statsSectionTop && window.scrollY < aboutSectionBottom)) {
                        // On apply section, or after hero and before unstick point (FAQ): fixed in center
                        pageWrapper.classList.add('computer-active');
                        if (isDesktop) {
                            gsap.to(fixedComputerDisplay, { right: '50px', opacity: 1, duration: 0.8, ease: 'power2.out' });
                            pageWrapper.classList.add('computer-visible');
                        } else {
                            gsap.to(fixedComputerDisplay, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
                        }
                    }
                });
            } else {
                // On other pages, hide the computer
                gsap.to(fixedComputerDisplay, { right: '-700px', opacity: 0, duration: 0.5, ease: 'power2.out' });
            }
        }
    }

    // Function to update active nav link and computer screen image
    const updateActiveSection = () => {
        let currentActiveSectionId = 'hero';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop - sectionHeight / 3 && window.scrollY < sectionTop + sectionHeight - sectionHeight / 3) {
                currentActiveSectionId = section.id;
                // Trigger glitch effect before changing image
                if(computerScreenImage) {
                    computerScreenImage.classList.add('glitch-effect');
                    setTimeout(() => {
                        computerScreenImage.src = section.dataset.image;
                        computerScreenImage.classList.remove('glitch-effect');
                    }, 300); // Glitch duration
                }

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

        handleComputerVisibility(currentActiveSectionId);
    };

    // Initial call and scroll event listener
    if (document.getElementById('hero')) {
        updateActiveSection();
        window.addEventListener('scroll', updateActiveSection);
    }
    
    handleComputerVisibility();

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
    const terminal = document.getElementById('terminal-section');
    if(terminal) {
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
    }
});