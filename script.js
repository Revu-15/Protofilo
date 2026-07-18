/* ==========================================================================
   CYBERPUNK + PREMIUM PORTFOLIO INTERACTIVE SCRIPTS
   Author: Polamreddy Revanth Reddy
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Light/Dark Theme Toggle System ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('i');
        
        // Check local storage for preference
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            document.body.classList.remove('light-theme');
            themeIcon.className = 'fa-solid fa-moon';
        }
        
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            
            // Save state & swap icon classes
            if (isLight) {
                localStorage.setItem('portfolio-theme', 'light');
                themeIcon.className = 'fa-solid fa-sun';
            } else {
                localStorage.setItem('portfolio-theme', 'dark');
                themeIcon.className = 'fa-solid fa-moon';
            }
        });
    }

    // --- 2. Cursor Glow Effect ---
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // --- 3. Interactive Canvas Particles ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;
        const maxParticles = window.innerWidth < 768 ? 40 : 80;
        const connectionDistance = 100;
        
        let mouse = { x: null, y: null, radius: 150 };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.color = Math.random() > 0.5 ? '#00f2fe' : '#7303c0';
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                
                // Adjust colors dynamically based on current theme for contrast
                const isLight = document.body.classList.contains('light-theme');
                if (isLight) {
                    ctx.fillStyle = this.color === '#00f2fe' ? '#0284c7' : '#7c3aed';
                } else {
                    ctx.fillStyle = this.color;
                }
                
                ctx.fill();
            }

            update() {
                // Bounce boundaries
                if (this.x > canvas.width || this.x < 0) this.vx = -this.vx;
                if (this.y > canvas.height || this.y < 0) this.vy = -this.vy;
                
                this.x += this.vx;
                this.y += this.vy;

                // Mouse interaction (push away slightly)
                if (mouse.x != null && mouse.y != null) {
                    let dx = this.x - mouse.x;
                    let dy = this.y - mouse.y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < mouse.radius) {
                        let force = (mouse.radius - dist) / mouse.radius;
                        let directionX = dx / dist;
                        let directionY = dy / dist;
                        this.x += directionX * force * 2;
                        this.y += directionY * force * 2;
                    }
                }
            }
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            const isLight = document.body.classList.contains('light-theme');
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    if (dist < connectionDistance) {
                        const alpha = 1 - (dist / connectionDistance);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        
                        // Use correct contrast stroke color
                        if (isLight) {
                            ctx.strokeStyle = `rgba(2, 132, 199, ${alpha * 0.15})`;
                        } else {
                            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha * 0.12})`;
                        }
                        
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            connectParticles();
            animationFrameId = requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    }

    // --- 4. Typing Effect ---
    const typingElement = document.getElementById('typing-element');
    if (typingElement) {
        const phrases = ["Machine Learning Engineer", "Python Developer", "Problem Solver", "AI Enthusiast"];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIdx];
            
            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
                typingSpeed = 50; // faster deletion
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
                typingSpeed = 120; // normal typing
            }

            if (!isDeleting && charIdx === currentPhrase.length) {
                typingSpeed = 2000; // wait when phrase is done typing
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typingSpeed = 500; // pause before starting next word
            }

            setTimeout(type, typingSpeed);
        }
        
        // Start typing
        setTimeout(type, 1000);
    }

    // --- 5. Sticky Navbar Scrolled State ---
    const navbar = document.querySelector('.navbar-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 6. Active Link Highlight On Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNav() {
        let scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120; // adjust offset for sticky navbar
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNav);

    // --- 7. Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- 8. Custom 3D Parallax Tilt Effect ---
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    if (window.innerWidth > 968) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x coordinate inside element
                const y = e.clientY - rect.top;  // y coordinate inside element
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Tilt angles (max 10 degrees)
                const rotateX = ((centerY - y) / centerY) * 10;
                const rotateY = ((x - centerX) / centerX) * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                
                // Update dynamic inner glow color based on hover if available
                const glow = card.querySelector('.card-glow');
                if (glow) {
                    const glowColor = card.getAttribute('data-glow-color') || 'rgba(0, 242, 254, 0.4)';
                    glow.style.background = `radial-gradient(circle at ${x}px ${y}px, ${glowColor} 0%, transparent 60%)`;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
                const glow = card.querySelector('.card-glow');
                if (glow) {
                    glow.style.background = 'transparent';
                }
            });
        });
    }

    // --- 9. Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    
    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Cyberpunk loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span><i class="fa-solid fa-sync fa-spin"></i> TRANSMITTING...</span>`;
            formFeedback.className = 'form-feedback-msg';
            formFeedback.textContent = '';
            
            // Simulate API Request
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // Set success message
                formFeedback.className = 'form-feedback-msg success';
                formFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> CONNECTION ESTABLISHED! Message sent successfully.`;
                
                // Clear form
                contactForm.reset();
            }, 1800);
        });
    }

    // --- 10. Dynamic System Time Footer ---
    const sysTimeVal = document.getElementById('footer-systime');
    if (sysTimeVal) {
        function updateClock() {
            const now = new Date();
            const timeStr = now.toUTCString().replace('GMT', 'UTC');
            sysTimeVal.textContent = timeStr;
        }
        setInterval(updateClock, 1000);
        updateClock(); // Initial call
    }
});
