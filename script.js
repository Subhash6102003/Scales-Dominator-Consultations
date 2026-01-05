// Scales Dominator - Interactive Features & Animations

// ============================================================================
// THEME TOGGLE
// ============================================================================

const toggleButton = document.getElementById("themeToggle");
const toggleIcon = document.getElementById("themeIcon");

function setTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);
    toggleIcon.textContent = isDark ? "light_mode" : "dark_mode";
}

function initTheme() {
    const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
    toggleIcon.textContent = current === "dark" ? "light_mode" : "dark_mode";
}

toggleButton?.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
});

initTheme();

// ============================================================================
// LEAD CAPTURE MODAL & ADMIN VIEW
// ============================================================================

function openAuthModal() {
    const modal = document.getElementById('authModal');
    modal?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal?.classList.add('hidden');
    document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAuthModal();
});

const STORAGE_KEY = 'leadSubmissions';
const ADMIN_HASH = '#admin-panel-4242';

function loadLeads() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (err) {
        console.error('Failed to parse leads', err);
        return [];
    }
}

function saveLeads(leads) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

function renderAdminPanel() {
    const panel = document.getElementById('adminPanel');
    const body = document.getElementById('adminTableBody');
    const empty = document.getElementById('adminEmpty');
    if (!panel || !body) return;

    if (window.location.hash === ADMIN_HASH) {
        panel.classList.remove('hidden');
        const leads = loadLeads();
        body.innerHTML = '';
        if (!leads.length) {
            empty?.classList.remove('hidden');
            return body.appendChild(empty);
        }
        empty?.remove();
        leads.forEach((lead) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-4 py-3">${lead.fullName || '-'}</td>
                <td class="px-4 py-3">${lead.clinicName || '-'}</td>
                <td class="px-4 py-3">${lead.email || '-'}</td>
                <td class="px-4 py-3">${lead.phone || '-'}</td>
                <td class="px-4 py-3">${lead.notes || '-'}</td>
                <td class="px-4 py-3">${lead.submittedAt || '-'}</td>
            `;
            body.appendChild(tr);
        });
    }
}

function handleLeadForm() {
    const form = document.getElementById('leadForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const newLead = {
            fullName: data.get('fullName'),
            clinicName: data.get('clinicName'),
            email: data.get('email'),
            phone: data.get('phone'),
            notes: data.get('notes'),
            submittedAt: new Date().toLocaleString()
        };
        const leads = loadLeads();
        leads.unshift(newLead);
        saveLeads(leads);
        form.reset();
        alert('Thanks! Your consultation request was received.');
        closeAuthModal();
        if (window.location.hash === ADMIN_HASH) renderAdminPanel();
    });
}

window.addEventListener('hashchange', renderAdminPanel);
handleLeadForm();
renderAdminPanel();

// ============================================================================
// SMOOTH SCROLLING & NAVIGATION
// ============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ============================================================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ============================================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections for animations
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// ============================================================================
// ACTIVE NAVIGATION LINK TRACKING
// ============================================================================

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-primary');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-primary');
        }
    });
});

// ============================================================================
// LAZY LOADING IMAGES
// ============================================================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================================================
// CONSOLE MESSAGE
// ============================================================================

console.log(
    '%c🏥 Scales Dominator',
    'font-size: 20px; font-weight: bold; color: #ea2a33;'
);
console.log(
    '%cPatient Acquisition Infrastructure',
    'font-size: 12px; color: #64748b;'
);
console.log(
    '%cBuilt with performance & conversion in mind ⚡',
    'font-size: 11px; color: #999;'
);
