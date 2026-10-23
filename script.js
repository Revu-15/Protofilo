/* ==========================================================================
   POLAMREDDY REVANTH REDDY — AWARD-LEVEL PORTFOLIO INTERACTION ENGINE
   Modern ES6+, Linear/Vercel Aesthetic, Zero Bloat, 60fps Smooth Motion
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Theme System: Light Default with Dark Toggle & System Preference ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');

    function applyTheme(theme) {
        const iconClass = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        if (themeToggleBtn) {
            const icon = themeToggleBtn.querySelector('i');
            if (icon) icon.className = iconClass;
        }
        if (mobileThemeToggleBtn) {
            const icon = mobileThemeToggleBtn.querySelector('i');
            if (icon) icon.className = iconClass;
        }

        localStorage.setItem('portfolio-theme', theme);
    }

    // Determine initial theme: stored preference -> system preference -> default to light
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        // Default is light unless system explicitly requests dark
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    function toggleTheme() {
        const isDark = document.body.classList.contains('dark-mode');
        applyTheme(isDark ? 'light' : 'dark');
    }

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);

    // --- 2. Top Scroll Progress Bar ---
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        if (!progressBar) return;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }, { passive: true });

    // --- 3. Sticky Floating Navbar Scrolled State ---
    const navbarHeader = document.querySelector('.navbar-header');
    window.addEventListener('scroll', () => {
        if (!navbarHeader) return;
        if (window.scrollY > 40) {
            navbarHeader.classList.add('scrolled');
        } else {
            navbarHeader.classList.remove('scrolled');
        }
    }, { passive: true });

    // --- 4. Active Section Highlight (Scroll Spy) ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-item-link, .mobile-nav-link');

    function highlightNav() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        // Bottom of page: activate Contact
        if (scrollY + windowHeight >= docHeight - 80) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#contact');
            });
            return;
        }

        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 130;
            if (scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        if (!currentSection && sections.length > 0) {
            currentSection = sections[0].getAttribute('id');
        }

        navLinks.forEach(link => {
            const targetHref = link.getAttribute('href');
            link.classList.toggle('active', targetHref === `#${currentSection}`);
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();

    // --- 5. Mobile Navigation Slide-in Drawer ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileBackdrop = document.getElementById('mobile-backdrop');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function openMobileDrawer() {
        if (mobileToggle) mobileToggle.classList.add('active');
        if (mobileDrawer) mobileDrawer.classList.add('open');
        if (mobileBackdrop) mobileBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileDrawer() {
        if (mobileToggle) mobileToggle.classList.remove('active');
        if (mobileDrawer) mobileDrawer.classList.remove('open');
        if (mobileBackdrop) mobileBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            if (mobileDrawer && mobileDrawer.classList.contains('open')) {
                closeMobileDrawer();
            } else {
                openMobileDrawer();
            }
        });
    }

    if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileDrawer);
    mobileLinks.forEach(link => link.addEventListener('click', closeMobileDrawer));

    // --- 6. Desktop Custom Cursor Glow Effect ---
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let mouseX = -100, mouseY = -100;
        let currentX = -100, currentY = -100;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        function animateCursor() {
            currentX += (mouseX - currentX) * 0.15;
            currentY += (mouseY - currentY) * 0.15;
            cursorGlow.style.left = `${currentX}px`;
            cursorGlow.style.top = `${currentY}px`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    // --- 7. Rotating / Typing Roles in Hero ---
    const typingRoleEl = document.getElementById('hero-typing-role');
    if (typingRoleEl) {
        const roles = [
            "AI Developer",
            "Full Stack Developer",
            "ML Engineer",
            "Data Analyst",
            "Deep Learning Researcher"
        ];
        let roleIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeLoop() {
            const current = roles[roleIdx];

            if (isDeleting) {
                typingRoleEl.textContent = current.substring(0, charIdx - 1);
                charIdx--;
                typingSpeed = 45;
            } else {
                typingRoleEl.textContent = current.substring(0, charIdx + 1);
                charIdx++;
                typingSpeed = 95;
            }

            if (!isDeleting && charIdx === current.length) {
                typingSpeed = 2200;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                typingSpeed = 400;
            }

            setTimeout(typeLoop, typingSpeed);
        }

        setTimeout(typeLoop, 800);
    }

    // --- 8. Animated Stats Counter on Scroll ---
    const statCounters = document.querySelectorAll('.stat-number[data-target]');
    let statsAnimated = false;

    function countUpStats() {
        statCounters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
            const duration = 1800;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutQuad
                const easedProgress = 1 - (1 - progress) * (1 - progress);
                const currentVal = target * easedProgress;

                counter.textContent = currentVal.toFixed(decimals) + suffix;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toFixed(decimals) + suffix;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    const statsStrip = document.querySelector('.stats-counter-strip');
    if (statsStrip) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !statsAnimated) {
                statsAnimated = true;
                countUpStats();
                statsObserver.disconnect();
            }
        }, { threshold: 0.3 });

        statsObserver.observe(statsStrip);
    }

    // --- 9. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // --- 10. Projects Category Filter ---
    const filterBtns = document.querySelectorAll('.projects-filter-bar .filter-btn');
    const projectCards = document.querySelectorAll('.projects-bento-grid .project-bento-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const categories = (card.getAttribute('data-category') || '').split(' ');
                    if (filter === 'all' || categories.includes(filter)) {
                        card.classList.remove('filter-hidden');
                    } else {
                        card.classList.add('filter-hidden');
                    }
                });
            });
        });
    }

    // --- 11. Project Details Modal ---
    const modalOverlay = document.getElementById('project-detail-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalTag = document.getElementById('modal-tag');
    const modalDesc = document.getElementById('modal-desc');
    const modalTech = document.getElementById('modal-tech');
    const modalLiveBtn = document.getElementById('modal-live-btn');
    const modalGithubBtn = document.getElementById('modal-github-btn');

    const projectData = {
        'enx-money': {
            title: 'ENX Money — Business Finance & Expense Platform',
            category: 'Full Stack • Enterprenex Solutions',
            desc: 'Enterprise financial management and business accounting platform developed for Enterprenex Solutions. Features end-to-end GST invoicing, inventory tracking, customer & supplier khata ledgers, automated ledger reconciliation, and robust JWT role-based access control. Built with Node.js, Express, MySQL, and React.js.',
            tech: ['Node.js', 'Express.js', 'MySQL', 'JWT', 'React.js', 'REST APIs', 'Git Workflows'],
            github: 'https://github.com/Revu-15',
            live: null,
            liveLabel: 'Enterprise Platform'
        },
        'ecosort-ai': {
            title: 'EcoSort AI — Smart Recyclable Waste Classifier',
            category: 'AI / ML • Full Stack',
            desc: 'End-to-end waste classification platform utilizing MobileNetV2 transfer learning to categorize recyclable waste materials from camera input. Features an asynchronous Flask REST API, a sleek React.js + Tailwind CSS interface, SQLite database for prediction telemetry, and an interactive real-time analytics dashboard.',
            tech: ['MobileNetV2', 'TensorFlow', 'Flask API', 'React.js', 'Tailwind CSS', 'SQLite'],
            github: 'https://github.com/Revu-15/Recyclable-Waste-Materials-for-Smart-Waste-Management',
            live: 'https://recyclable-waste-materials-for-smar.vercel.app/',
            liveLabel: 'Live Vercel Demo'
        },
        'nexcart': {
            title: 'NexCart — Full-Stack E-Commerce Platform',
            category: 'Full Stack • Frontend',
            desc: 'High-performance online marketplace featuring dynamic catalog browsing, multi-attribute filtering, debounced instant search, interactive shopping cart, persistent wishlist, JWT session authentication, and responsive modern Tailwind layouts.',
            tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT'],
            github: 'https://github.com/Revu-15',
            live: null,
            liveLabel: 'Full-Stack App'
        },
        'cropsense-ai': {
            title: 'CropSense AI — Crop Disease Advisory System',
            category: 'AI / Machine Learning',
            desc: 'Deep learning foliar pathology diagnosis platform utilizing Convolutional Neural Networks (CNN) to detect agricultural crop diseases from leaf imagery. Provides immediate diagnosis and automated agronomic treatment recommendations; deployed on Render.',
            tech: ['Python', 'TensorFlow', 'CNN', 'Flask', 'OpenCV', 'Render'],
            github: 'https://github.com/Revu-15/crop-disease-advisory-system',
            live: 'https://revu-15.github.io/crop-disease-advisory-system/',
            liveLabel: 'Live Demo'
        },
        'flappy-bird-rl': {
            title: 'Flappy Bird DQN Reinforcement Learning Agent',
            category: 'Reinforcement Learning • AI',
            desc: 'Autonomous gaming agent developed with Deep Q-Networks (DQN). Leverages experience replay buffers and target network synchronization to master Flappy Bird gameplay autonomously through reinforcement policies; packaged with Streamlit and PyGame.',
            tech: ['Python', 'PyGame', 'TensorFlow', 'Deep Q-Networks (DQN)', 'Streamlit'],
            github: 'https://github.com/Revu-15/Flappy-Bird-RL-Agent',
            live: 'https://flappy-bird-rl-agent-revanthreddy15.streamlit.app/',
            liveLabel: 'Interactive App'
        },
        'image-search': {
            title: 'AI Visual Search & Embedding Engine',
            category: 'Computer Vision • Deep Learning',
            desc: 'Content-based image retrieval platform extracting high-dimensional deep learning embeddings to perform vector cosine similarity search across image datasets, served via an asynchronous Flask REST API.',
            tech: ['Python', 'Deep Learning', 'Embeddings', 'Flask API', 'Computer Vision'],
            github: 'https://github.com/Revu-15/Image-Search-Engine',
            live: 'https://imagesearchenginerevanthreddy.netlify.app/',
            liveLabel: 'Live Demo'
        },
        'stock-analyzer': {
            title: 'AI Stock Market Trend Analyzer',
            category: 'Data Analysis • AI / ML',
            desc: 'Multi-model financial forecasting ensemble combining LSTM neural networks, Transformer time-series attention, Random Forest regressors, and FinBERT sentiment scoring to achieve 89.4% directional accuracy with interactive Streamlit analytics.',
            tech: ['LSTM', 'Transformer', 'Random Forest', 'FinBERT', 'Streamlit', 'Plotly'],
            github: 'https://github.com/Revu-15/Market-trend-analysis',
            live: 'https://market-trend-analysis-revanth-15.streamlit.app/',
            liveLabel: 'Live Streamlit App'
        },
        'sepsis-detection': {
            title: 'Sepsis Detection using Machine Learning',
            category: 'Healthcare AI • Data Analysis',
            desc: 'Early clinical ICU sepsis prediction model utilizing SMOTE imbalance correction, Logistic Regression, Random Forest, and XGBoost classifiers optimized for F1 and ROC-AUC metrics on medical datasets.',
            tech: ['Python', 'Scikit-learn', 'XGBoost', 'SMOTE', 'Flask', 'Pandas'],
            github: 'https://github.com/Revu-15/Sepsis-Detection-using-Machine-Learning',
            live: null,
            liveLabel: 'ICU Pipeline'
        },
        'student-performance': {
            title: 'Student Academic Performance Predictor',
            category: 'Data Analysis • Machine Learning',
            desc: 'End-to-end Machine Learning regression pipeline performing comprehensive exploratory data analysis (EDA), feature engineering, and model validation to forecast academic performance scores; deployed on Render.',
            tech: ['Python', 'Scikit-learn', 'Flask', 'Pandas', 'EDA', 'Render'],
            github: 'https://github.com/Revu-15/Student-Performance-Indicator',
            live: 'https://student-performance-indicator-bvyl.onrender.com/',
            liveLabel: 'Live Web App'
        },
        'dav-workshop': {
            title: 'DAV Workshop — IIT Bhilai',
            category: 'Data Science & Visualization Instruction',
            desc: 'Designed and conducted an intensive 6-day Data Science & Visualization workshop at IIT Bhilai covering web scraping, data wrangling with Pandas, time-series analysis, network graph structures with NetworkX, and Power BI reporting.',
            tech: ['Python', 'Pandas', 'Power BI', 'NetworkX', 'Plotly', 'Web Scraping'],
            github: 'https://github.com/Revu-15',
            live: null,
            liveLabel: '6-Day Curriculum'
        },
        'weather-tracker': {
            title: 'Real-Time Weather Tracker App',
            category: 'Frontend Engineering',
            desc: 'Responsive meteorological web app featuring live geocoding, temperature, humidity, wind velocity forecasts, dynamic weather status icons, and comprehensive API error handling via OpenWeather REST endpoints.',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'REST API', 'Netlify'],
            github: 'https://github.com/Revu-15/Weather-Tracker',
            live: 'https://wheatherapprevanthreddy.netlify.app/',
            liveLabel: 'Live Demo'
        }
    };

    function openModal(projectId) {
        const data = projectData[projectId];
        if (!data || !modalOverlay) return;

        modalTitle.textContent = data.title;
        modalTag.textContent = data.category;
        modalDesc.textContent = data.desc;

        modalTech.innerHTML = '';
        data.tech.forEach(t => {
            const chip = document.createElement('span');
            chip.className = 'tech-chip';
            chip.textContent = t;
            modalTech.appendChild(chip);
        });

        if (data.live) {
            modalLiveBtn.href = data.live;
            modalLiveBtn.style.display = 'inline-flex';
            modalLiveBtn.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i> ${data.liveLabel}`;
        } else {
            modalLiveBtn.style.display = 'none';
        }

        modalGithubBtn.href = data.github;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    const modalTriggers = document.querySelectorAll('[data-modal-project]');
    modalTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const pid = btn.getAttribute('data-modal-project');
            openModal(pid);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // --- 12. Skills Tabbed Category System ---
    const skillTabItems = document.querySelectorAll('.skills-tab-bar .skill-tab-item');
    const skillCards = document.querySelectorAll('.skills-cards-grid .skill-category-card');

    if (skillTabItems.length > 0 && skillCards.length > 0) {
        skillTabItems.forEach(tab => {
            tab.addEventListener('click', () => {
                skillTabItems.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const targetCategory = tab.getAttribute('data-skill-tab');

                skillCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-skill-category');
                    if (targetCategory === 'all' || cardCategory === targetCategory) {
                        card.classList.remove('filter-hidden');
                    } else {
                        card.classList.add('filter-hidden');
                    }
                });
            });
        });
    }

    // --- 13. Resume Role Picker Interactive Controller ---
    const roleBtns = document.querySelectorAll('.role-picker-card-btn');
    const previewHeading = document.getElementById('preview-role-heading');
    const previewSummary = document.getElementById('preview-role-summary');
    const previewChips = document.getElementById('preview-chips-container');
    const previewPath = document.getElementById('preview-file-path');
    const previewDownloadBtn = document.getElementById('preview-download-btn');

    const roleDetails = {
        'software': {
            role: 'Software Developer',
            filename: 'Revanth_Software_Developer_Resume.pdf',
            path: 'public/resumes/Revanth_Software_Developer_Resume.pdf',
            summary: 'Tailored for Full-Stack & Software Engineering positions. Highlights production platform development for ENX Money at Enterprenex, Node.js, Express, React.js, MySQL, JWT authentication, and REST APIs.',
            skills: ['Node.js', 'Express.js', 'React.js', 'MySQL', 'MongoDB', 'JWT Auth', 'REST APIs', 'Git Workflows']
        },
        'ai': {
            role: 'AI Developer',
            filename: 'Revanth_AI_Developer_Resume.pdf',
            path: 'public/resumes/Revanth_AI_Developer_Resume.pdf',
            summary: 'Specialized for AI Research & Engineering roles. Highlights research internships at IIT Tirupati (SEVA Lab) and IIT Madras, Deep Learning, Computer Vision, Generative AI, LLMs, and end-to-end model serving.',
            skills: ['PyTorch', 'TensorFlow', 'Computer Vision', 'Generative AI & LLMs', 'Reinforcement Learning', 'Model Serving', 'FastAPI']
        },
        'ml': {
            role: 'ML Engineer',
            filename: 'Revanth_ML_Resume_Updated.pdf',
            path: 'public/resumes/Revanth_ML_Resume_Updated.pdf',
            summary: 'Focused on core Machine Learning pipelines, model training & evaluation, feature engineering, classification, DQN reinforcement learning, and healthcare prediction models.',
            skills: ['Scikit-learn', 'TensorFlow', 'XGBoost', 'Feature Engineering', 'SMOTE', 'Flask', 'Model Evaluation', 'DQN']
        },
        'data': {
            role: 'Data Analyst',
            filename: 'Revanth_Data_Analyst_Resume_Updated.pdf',
            path: 'public/resumes/Revanth_Data_Analyst_Resume_Updated.pdf',
            summary: 'Curated for Data Analytics & BI. Highlights EDA pipelines at Scholars\' Minds, 6-day IIT Bhilai DAV workshop instruction, SQL, Power BI, Python (Pandas/Plotly), and statistical modeling.',
            skills: ['Python (Pandas, NumPy)', 'Power BI', 'SQL', 'Exploratory Data Analysis', 'Statistical Modeling', 'Plotly', 'Excel']
        },
        'ui': {
            role: 'UI / Frontend Developer',
            filename: 'Revanth_UI_Resume_Updated.pdf',
            path: 'public/resumes/Revanth_UI_Resume_Updated.pdf',
            summary: 'Showcases modern responsive web interfaces, component architectures in React.js, Tailwind CSS, vanilla JavaScript, Figma prototyping, and refined visual design systems.',
            skills: ['React.js', 'JavaScript (ES6+)', 'Tailwind CSS', 'HTML5 & CSS3', 'Figma Prototyping', 'Responsive Design']
        }
    };

    if (roleBtns.length > 0 && previewHeading) {
        roleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.getAttribute('data-role');
                const data = roleDetails[key];
                if (!data) return;

                roleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                previewHeading.textContent = data.role;
                previewSummary.textContent = data.summary;
                if (previewPath) {
                    previewPath.innerHTML = `<i class="fa-solid fa-file-pdf"></i> ${data.path}`;
                }
                if (previewDownloadBtn) {
                    previewDownloadBtn.href = data.path;
                    previewDownloadBtn.download = data.filename;
                    previewDownloadBtn.innerHTML = `<i class="fa-solid fa-arrow-down"></i> Download ${data.role} Resume`;
                }

                if (previewChips) {
                    previewChips.innerHTML = '';
                    data.skills.forEach(s => {
                        const chip = document.createElement('span');
                        chip.className = 'preview-skill-tag';
                        chip.textContent = s;
                        previewChips.appendChild(chip);
                    });
                }
            });
        });
    }

    // --- 14. Contact Form Validation & Toast Notification ---
    const contactForm = document.getElementById('contact-form');
    const toastNotice = document.getElementById('toast-notice');

    function showToast(message, type = 'success') {
        if (!toastNotice) return;
        toastNotice.className = `toast-notice ${type} show`;
        const icon = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';
        toastNotice.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;

        setTimeout(() => {
            toastNotice.classList.remove('show');
        }, 4000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !subject || !message) {
                showToast('Please fill out all required fields.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Please provide a valid email address.', 'error');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...`;

            // Simulate fast transmission
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
                showToast('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
            }, 1200);
        });
    }

    // --- 15. Dynamic UTC Clock in Footer ---
    const sysTimeEl = document.getElementById('footer-systime');
    if (sysTimeEl) {
        function updateClock() {
            const now = new Date();
            sysTimeEl.textContent = now.toUTCString().replace('GMT', 'UTC');
        }
        setInterval(updateClock, 1000);
        updateClock();
    }

    // --- 16. Back to Top Smooth Scroll ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
