document.addEventListener('DOMContentLoaded', function () {
    const html = document.documentElement;
    const body = document.body;
    const header = document.querySelector('.legal-header');
    const progressBar = document.getElementById('reading-progress-bar');
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const sidebar = document.getElementById('sidebar');
    const sidebarPanel = sidebar?.querySelector('.mobile-sidebar-panel');
    const sectionLinks = document.querySelectorAll('[data-section-link]');
    const sidebarLinks = document.querySelectorAll('.mobile-sidebar-links a[href^="#"]');
    const desktopLinks = document.querySelectorAll('.desktop-nav a[href^="#"]');
    const sections = document.querySelectorAll('.legal-section[id]');
    const currentSectionLabel = document.getElementById('current-section-label');
    let sidebarTimer = null;

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

    function syncTheme(theme) {
        const nextTheme = theme === 'light' ? 'light' : 'dark';
        html.setAttribute('data-theme', nextTheme);
        html.classList.toggle('dark', nextTheme === 'dark');
        saveTheme(nextTheme);
    }

    syncTheme(readTheme());

    themeToggle?.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        syncTheme(current === 'dark' ? 'light' : 'dark');
    });

    function openSidebar() {
        if (!sidebar || !sidebarPanel) {
            return;
        }

        window.clearTimeout(sidebarTimer);
        sidebar.classList.remove('hidden');
        body.classList.add('sidebar-open');

        window.requestAnimationFrame(() => {
            sidebarPanel.classList.add('open');
        });
    }

    function closeSidebar() {
        if (!sidebar || !sidebarPanel) {
            return;
        }

        sidebarPanel.classList.remove('open');
        body.classList.remove('sidebar-open');
        sidebarTimer = window.setTimeout(() => {
            sidebar.classList.add('hidden');
        }, 280);
    }

    menuToggle?.addEventListener('click', openSidebar);
    closeSidebarBtn?.addEventListener('click', closeSidebar);
    sidebar?.querySelector('.mobile-sidebar-overlay')?.addEventListener('click', closeSidebar);

    function getHeaderOffset() {
        return (header?.offsetHeight || 64) + 18;
    }

    function smoothJump(targetId) {
        const target = document.getElementById(targetId);
        if (!target) {
            return;
        }

        const top = Math.max(target.getBoundingClientRect().top + window.scrollY - getHeaderOffset(), 0);
        window.scrollTo({ top, behavior: 'smooth' });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (event) {
            const href = this.getAttribute('href');
            if (!href || href === '#') {
                return;
            }

            const targetId = href.slice(1);
            if (!document.getElementById(targetId)) {
                return;
            }

            event.preventDefault();
            smoothJump(targetId);
            if (!sidebar?.classList.contains('hidden')) {
                closeSidebar();
            }
        });
    });

    function updateProgress() {
        if (!progressBar) {
            return;
        }

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll <= 0 ? 0 : (window.scrollY / maxScroll) * 100;
        progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
    }

    function setActiveSection(id) {
        sectionLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.sectionLink === id);
        });

        desktopLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });

        sidebarLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });

        const activeLink = document.querySelector(`[data-section-link="${id}"]`);
        if (currentSectionLabel && activeLink) {
            currentSectionLabel.textContent = activeLink.textContent.trim();
        }
    }

    function updateCurrentSection() {
        const checkpoint = window.scrollY + getHeaderOffset() + 80;
        let activeId = sections[0]?.id || 'uso';

        sections.forEach((section) => {
            if (checkpoint >= section.offsetTop) {
                activeId = section.id;
            }
        });

        setActiveSection(activeId);
    }

    window.addEventListener('scroll', () => {
        updateProgress();
        updateCurrentSection();
    }, { passive: true });

    window.addEventListener('resize', () => {
        updateProgress();
        updateCurrentSection();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeSidebar();
        }
    });

    updateProgress();
    updateCurrentSection();
});
