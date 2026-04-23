/**
 * GRUPO TRADE CORP - JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
    const html = document.documentElement;
    const header = document.querySelector('header');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIconSun = document.getElementById('theme-icon-sun');
    const themeIconMoon = document.getElementById('theme-icon-moon');
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const sidebar = document.getElementById('sidebar');
    const sidebarPanel = sidebar?.querySelector('.sidebar-panel');
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('section[id]');
    const heroSection = document.getElementById('hero');
    const testimonialContainer = document.getElementById('testimonial-container');
    const testimonialButtons = document.querySelectorAll('.testimonial-nav');
    const contactAccordionItems = document.querySelectorAll('.contact-accordion-item');
    const revealElements = document.querySelectorAll('[data-reveal]');
    const sectionRevealElements = document.querySelectorAll('[data-section-reveal]');
    const heroContactBtn = document.getElementById('hero-contact-btn');
    const heroServicesBtn = document.getElementById('hero-services-btn');
    const heroRotatingWord = document.getElementById('hero-rotating-word');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let sidebarTimer = null;
    let testimonialAutoScroll = null;
    let testimonialResumeTimer = null;

    function readTheme() {
        try {
            return localStorage.getItem('theme') || html.getAttribute('data-theme') || 'dark';
        } catch (error) {
            return html.getAttribute('data-theme') || 'dark';
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            return;
        }
    }

    function syncThemeIcon(theme) {
        const isDark = theme === 'dark';
        themeIconSun?.classList.toggle('hidden', !isDark);
        themeIconMoon?.classList.toggle('hidden', isDark);
    }

    function syncTheme(theme) {
        const nextTheme = theme === 'light' ? 'light' : 'dark';
        html.setAttribute('data-theme', nextTheme);
        html.classList.toggle('dark', nextTheme === 'dark');
        syncThemeIcon(nextTheme);
        saveTheme(nextTheme);
    }

    syncTheme(readTheme());

    themeToggle?.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        syncTheme(next);
    });

    function openSidebar() {
        if (!sidebar || !sidebarPanel) {
            return;
        }

        window.clearTimeout(sidebarTimer);
        sidebar.classList.remove('hidden');
        document.body.classList.add('sidebar-open');

        window.requestAnimationFrame(() => {
            sidebarPanel.classList.add('open');
        });
    }

    function closeSidebar() {
        if (!sidebar || !sidebarPanel) {
            return;
        }

        sidebarPanel.classList.remove('open');
        document.body.classList.remove('sidebar-open');
        sidebarTimer = window.setTimeout(() => {
            sidebar.classList.add('hidden');
        }, 280);
    }

    menuToggle?.addEventListener('click', openSidebar);
    closeSidebarBtn?.addEventListener('click', closeSidebar);
    sidebar?.querySelector('.sidebar-overlay')?.addEventListener('click', closeSidebar);
    sidebarLinks.forEach((link) => link.addEventListener('click', closeSidebar));

    function setOpenAccordionItem(nextItem) {
        contactAccordionItems.forEach((item) => {
            const isOpen = item === nextItem;
            item.classList.toggle('is-open', isOpen);

            const trigger = item.querySelector('.contact-accordion-trigger');
            if (trigger) {
                trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            }
        });
    }

    if (contactAccordionItems.length) {
        contactAccordionItems.forEach((item, index) => {
            const trigger = item.querySelector('.contact-accordion-trigger');
            item.classList.remove('is-open');

            trigger?.setAttribute('aria-expanded', 'false');
            trigger?.addEventListener('click', () => {
                if (item.classList.contains('is-open')) {
                    setOpenAccordionItem(null);
                    return;
                }

                setOpenAccordionItem(item);
            });
        });
    }

    function getHeaderHeight() {
        return header?.offsetHeight || 64;
    }

    function updateActiveNav() {
        const scrollCheckpoint = window.scrollY + getHeaderHeight() + 120;

        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollCheckpoint >= top && scrollCheckpoint < top + height) {
                navLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }

    function syncHeaderHeroBlend() {
        if (!header || !heroSection) {
            return;
        }

        const heroRect = heroSection.getBoundingClientRect();
        const headerAnchor = getHeaderHeight() + 8;
        const isOnHero = heroRect.top <= headerAnchor && heroRect.bottom > headerAnchor;
        header.classList.toggle('is-on-hero', isOnHero);
    }

    // Hero CTA: draw contact arrow when user starts scrolling.
    function syncHeroContactArrow() {
        if (!heroContactBtn) {
            return;
        }

        heroContactBtn.classList.toggle('is-scrolled', window.scrollY > 18);
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('scroll', syncHeroContactArrow, { passive: true });
    window.addEventListener('scroll', syncHeaderHeroBlend, { passive: true });
    window.addEventListener('resize', updateActiveNav);
    window.addEventListener('resize', syncHeaderHeroBlend);
    updateActiveNav();
    syncHeroContactArrow();
    syncHeaderHeroBlend();

    // Hero CTA: short activation feedback for services button.
    heroServicesBtn?.addEventListener('click', () => {
        heroServicesBtn.classList.add('is-pressed');
        window.setTimeout(() => {
            heroServicesBtn.classList.remove('is-pressed');
        }, 6000);
    });

    // Hero headline: rotate core value word every 3 seconds.
    if (heroRotatingWord) {
        const rotatingWords = ['Disciplina', 'Criterio', 'Diligencia', 'Responsabilidad'];
        let rotatingWordIndex = 0;

        window.setInterval(() => {
            rotatingWordIndex = (rotatingWordIndex + 1) % rotatingWords.length;

            heroRotatingWord.classList.remove('is-entering');
            heroRotatingWord.classList.add('is-leaving');

            window.setTimeout(() => {
                heroRotatingWord.textContent = rotatingWords[rotatingWordIndex];
                heroRotatingWord.classList.remove('is-leaving');
                heroRotatingWord.classList.add('is-entering');
            }, 380);
        }, 3000);
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (event) {
            const href = this.getAttribute('href');
            if (!href || href === '#') {
                return;
            }

            const target = document.querySelector(href);
            if (!target) {
                return;
            }

            event.preventDefault();
            if (!sidebar?.classList.contains('hidden')) {
                closeSidebar();
            }
            const top = Math.max(target.getBoundingClientRect().top + window.scrollY - getHeaderHeight() + 8, 0);
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    function getTestimonialScrollAmount() {
        const firstCard = testimonialContainer?.querySelector('.testimonial-card');
        if (!testimonialContainer || !firstCard) {
            return 360;
        }

        const styles = window.getComputedStyle(testimonialContainer);
        const gap = parseFloat(styles.columnGap || styles.gap || '24');
        return firstCard.getBoundingClientRect().width + gap;
    }

    function stopAutoTestimonials() {
        if (testimonialAutoScroll) {
            window.clearInterval(testimonialAutoScroll);
            testimonialAutoScroll = null;
        }
        if (testimonialResumeTimer) {
            window.clearTimeout(testimonialResumeTimer);
            testimonialResumeTimer = null;
        }
    }

    function advanceTestimonials() {
        if (!testimonialContainer) {
            return;
        }

        const maxScroll = testimonialContainer.scrollWidth - testimonialContainer.clientWidth;
        const nextStep = testimonialContainer.scrollLeft + getTestimonialScrollAmount();

        if (nextStep >= maxScroll - 8) {
            testimonialContainer.scrollTo({
                left: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
            return;
        }

        testimonialContainer.scrollBy({
            left: getTestimonialScrollAmount(),
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    }

    function startAutoTestimonials() {
        if (!testimonialContainer || prefersReducedMotion) {
            return;
        }

        stopAutoTestimonials();
        testimonialAutoScroll = window.setInterval(advanceTestimonials, 5000);
    }

    function resumeAutoTestimonials(delay = 5000) {
        if (!testimonialContainer || prefersReducedMotion) {
            return;
        }

        stopAutoTestimonials();
        testimonialResumeTimer = window.setTimeout(() => {
            startAutoTestimonials();
        }, delay);
    }

    testimonialButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (!testimonialContainer) {
                return;
            }

            const direction = button.dataset.direction === 'prev' ? -1 : 1;
            testimonialContainer.scrollBy({
                left: getTestimonialScrollAmount() * direction,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
            resumeAutoTestimonials(7000);
        });
    });

    testimonialContainer?.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
            return;
        }

        event.preventDefault();
        const direction = event.key === 'ArrowLeft' ? -1 : 1;
        testimonialContainer.scrollBy({
            left: getTestimonialScrollAmount() * direction,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
        resumeAutoTestimonials(7000);
    });

    testimonialContainer?.addEventListener('mouseenter', stopAutoTestimonials);
    testimonialContainer?.addEventListener('mouseleave', startAutoTestimonials);
    testimonialContainer?.addEventListener('focusin', stopAutoTestimonials);
    testimonialContainer?.addEventListener('focusout', () => resumeAutoTestimonials(5000));
    testimonialContainer?.addEventListener('pointerdown', () => resumeAutoTestimonials(8000));
    testimonialButtons.forEach((button) => {
        button.addEventListener('mouseenter', stopAutoTestimonials);
        button.addEventListener('mouseleave', startAutoTestimonials);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoTestimonials();
            return;
        }
        startAutoTestimonials();
    });

    if (revealElements.length || sectionRevealElements.length) {
        if (prefersReducedMotion) {
            revealElements.forEach((element) => element.classList.add('is-visible'));
            sectionRevealElements.forEach((element) => element.classList.add('is-section-visible'));
        } else {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.target.hasAttribute('data-section-reveal')) {
                        entry.target.classList.toggle('is-section-visible', entry.isIntersecting);
                        return;
                    }

                    entry.target.classList.toggle('is-visible', entry.isIntersecting);
                });
            }, {
                threshold: 0.18,
                rootMargin: '0px 0px -8% 0px'
            });

            revealElements.forEach((element) => revealObserver.observe(element));
            sectionRevealElements.forEach((element) => revealObserver.observe(element));
        }
    }

    startAutoTestimonials();

    document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
        event.preventDefault();

        const form = event.target;
        const nombre = form.querySelector('[name="nombre"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const telefono = form.querySelector('[name="telefono"]').value.trim();
        const mensaje = form.querySelector('[name="mensaje"]').value.trim();

        const lines = [`Hola, me llama ${nombre}.`, ''];
        if (email) lines.push(`Email: ${email}`);
        if (telefono) lines.push(`Telefono: ${telefono}`);
        if (mensaje) {
            lines.push('', mensaje);
        }

        const text = encodeURIComponent(lines.join('\n'));
        window.open(`https://wa.me/50361276385?text=${text}`, '_blank', 'noopener');
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeSidebar();
        }
    });
});
