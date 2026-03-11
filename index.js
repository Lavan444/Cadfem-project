       const header = document.getElementById('site-header');
        const progressBar = document.getElementById('reading-progress');
        const backToTop = document.getElementById('back-to-top');

        let lastScrollY = 0;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(onScroll);
                ticking = true;
            }
        });

        function onScroll() {
            const scrollY = window.scrollY;
            const docH = document.documentElement.scrollHeight - window.innerHeight;

            /* ── Reading progress bar ── */
            progressBar.style.width = (docH > 0 ? (scrollY / docH) * 100 : 0) + '%';

            /* ── Smart hide / show header ──
               • Scrolling DOWN  → add .header-hidden  (slides header up out of view)
               • Scrolling UP    → remove .header-hidden (slides header back in)
               • At very top     → always show, no shadow
               • Past top        → add .scrolled for shadow + blur
            */
            if (scrollY <= 0) {
                // At the very top — always visible, no shadow
                header.classList.remove('header-hidden', 'scrolled');
            } else if (scrollY > lastScrollY) {
                // Scrolling DOWN — hide
                header.classList.add('header-hidden');
                header.classList.remove('scrolled');
            } else {
                // Scrolling UP — show with shadow
                header.classList.remove('header-hidden');
                header.classList.add('scrolled');
            }

            lastScrollY = scrollY;

            /* ── Back to top button ── */
            backToTop.classList.toggle('visible', scrollY > 400);

            /* ── TOC active highlight ── */
            updateTOC();

            ticking = false;
        }

        /* ── TOC active highlight ── */
        function updateTOC() {
            const sections = document.querySelectorAll('h2[id], h3[id], h4[id]');
            const tocLinks = document.querySelectorAll('#toc a');
            let activeId = '';

            sections.forEach(sec => {
                if (sec.getBoundingClientRect().top <= 90) activeId = sec.id;
            });

            tocLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
            });
        }

        /* ── Copy link ── */
        function copyLink() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                const toast = document.getElementById('toast');
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2200);
            }).catch(() => {
                const toast = document.getElementById('toast');
                toast.textContent = 'Copied!';
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2200);
            });
        }

        /* ── Fade-in on scroll for article body elements ── */
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'translateY(0)';
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.08 });

        document.querySelectorAll('.figure-wrap, .video-wrap, .fsi-card, .callout, .conclusion-box, .audio-section').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(18px)';
            el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
            observer.observe(el);
        });

        /* ── Simulated view count increment ── */
        setTimeout(() => {
            document.getElementById('view-count').textContent = '1,483 views';
        }, 3000);

