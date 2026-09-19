// Technical writing articles (empty for now; add entries here as they're published).
// Each entry: { title, description, url, date }
const articles = [];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile navigation toggle
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileNav');
    if (!toggle || !menu) return;

    const focusableLinks = () => Array.from(menu.querySelectorAll('a'));

    const openMenu = () => {
        toggle.setAttribute('aria-expanded', 'true');
        menu.hidden = false;
        const links = focusableLinks();
        if (links.length) links[0].focus();
    };

    const closeMenu = ({ returnFocus = false } = {}) => {
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
        if (returnFocus) toggle.focus();
    };

    toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        if (isOpen) closeMenu(); else openMenu();
    });

    focusableLinks().forEach(link => {
        link.addEventListener('click', () => closeMenu());
    });

    menu.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeMenu({ returnFocus: true });
            return;
        }
        if (e.key !== 'Tab') return;

        const links = focusableLinks();
        if (!links.length) return;
        const first = links[0];
        const last = links[links.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });
}

// Smooth scroll with focus management for accessibility
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    });
}

// Highlight the active nav link based on scroll position
function initActiveNavTracking() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const linkFor = id => Array.from(navLinks).find(link => link.getAttribute('href') === `#${id}`);

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const link = linkFor(entry.target.id);
            if (!link) return;
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.removeAttribute('aria-current'));
                link.setAttribute('aria-current', 'true');
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));
}

// Sticky header shadow on scroll
function initHeaderScrollState() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
    }, { passive: true });
}

// Scroll-reveal animations (progressive enhancement, skipped under reduced motion)
function initScrollReveal() {
    if (prefersReducedMotion) return;
    document.documentElement.classList.add('js-animations');

    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
}

// Compute "X yrs Y mos" from YYYY-MM start/end data attributes
function monthsBetween(startYM, endYM) {
    const [sy, sm] = startYM.split('-').map(Number);
    const [ey, em] = endYM.split('-').map(Number);
    return (ey - sy) * 12 + (em - sm) + 1;
}

function formatDuration(totalMonths) {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const parts = [];
    if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
    if (months > 0 || years === 0) parts.push(`${months} mo${months !== 1 ? 's' : ''}`);
    return parts.join(' ');
}

function initExperienceDurations() {
    const now = new Date();
    const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    document.querySelectorAll('.timeline-item[data-start]').forEach(item => {
        const start = item.dataset.start;
        const endAttr = item.dataset.end;
        const end = (!endAttr || endAttr === 'present') ? currentYM : endAttr;
        const durationEl = item.querySelector('.timeline-duration');
        if (durationEl) {
            durationEl.textContent = formatDuration(monthsBetween(start, end));
        }
    });
}

// Render technical writing articles, or an empty state if none exist yet
function renderArticles() {
    const container = document.getElementById('writingList');
    if (!container) return;

    if (articles.length === 0) {
        container.innerHTML = `
            <div class="writing-empty">
                Articles on backend engineering, distributed systems and enterprise software design are in progress. Check back soon.
            </div>
        `;
        return;
    }

    container.innerHTML = articles.map(article => `
        <article class="writing-card">
            <h3><a href="${article.url}">${article.title}</a></h3>
            <p>${article.description}</p>
        </article>
    `).join('');
}

// Footer year
function initCurrentYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// Back-to-top button
function initBackToTop() {
    const button = document.getElementById('backToTop');
    if (!button) return;

    window.addEventListener('scroll', () => {
        button.classList.toggle('is-visible', window.scrollY > window.innerHeight);
    }, { passive: true });

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        document.getElementById('main')?.focus();
    });
}

// Copy email to clipboard
function initCopyEmail() {
    const button = document.getElementById('copyEmailBtn');
    const message = document.getElementById('copyMessage');
    if (!button || !message) return;

    const email = 'chiranjivi.neupane96@gmail.com';

    button.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(email);
            message.textContent = 'Email copied to clipboard.';
        } catch (err) {
            message.textContent = email;
        }
        setTimeout(() => { message.textContent = ''; }, 4000);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initCurrentYear();
    initMobileNav();
    initSmoothScrolling();
    initActiveNavTracking();
    initHeaderScrollState();
    initScrollReveal();
    initExperienceDurations();
    renderArticles();
    initCopyEmail();
    initBackToTop();
});
