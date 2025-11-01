// Skills Data
const skills = [
    { name: 'Java', color: 'from-red-400 to-red-600', icon: '☕' },
    { name: 'Spring Boot', color: 'from-green-400 to-green-600', icon: '🍃' },
    { name: 'React.js', color: 'from-cyan-400 to-blue-500', icon: '⚛️' },
    { name: 'Microservices', color: 'from-blue-400 to-blue-600', icon: '🔧' },
    { name: 'Docker', color: 'from-blue-300 to-blue-500', icon: '🐳' },
    { name: 'AWS', color: 'from-orange-400 to-orange-600', icon: '☁️' },
    { name: 'MySQL', color: 'from-blue-500 to-blue-700', icon: '🗄️' },
    { name: 'GIT', color: 'from-red-500 to-red-700', icon: '📦' },
    { name: 'JavaScript', color: 'from-yellow-400 to-yellow-600', icon: '⚡' },
    { name: 'HTML', color: 'from-orange-500 to-orange-700', icon: '🌐' },
    { name: 'CSS', color: 'from-blue-400 to-blue-600', icon: '🎨' },
    { name: 'Angular', color: 'from-red-500 to-red-600', icon: '🅰️' }
];

// Color map for direct gradient application
const gradientMap = {
    'from-red-400 to-red-600': 'linear-gradient(to bottom right, #f87171, #dc2626)',
    'from-green-400 to-green-600': 'linear-gradient(to bottom right, #4ade80, #16a34a)',
    'from-cyan-400 to-blue-500': 'linear-gradient(to bottom right, #22d3ee, #3b82f6)',
    'from-blue-400 to-blue-600': 'linear-gradient(to bottom right, #60a5fa, #2563eb)',
    'from-blue-300 to-blue-500': 'linear-gradient(to bottom right, #93c5fd, #3b82f6)',
    'from-orange-400 to-orange-600': 'linear-gradient(to bottom right, #fb923c, #ea580c)',
    'from-blue-500 to-blue-700': 'linear-gradient(to bottom right, #3b82f6, #1d4ed8)',
    'from-red-500 to-red-700': 'linear-gradient(to bottom right, #ef4444, #b91c1c)',
    'from-yellow-400 to-yellow-600': 'linear-gradient(to bottom right, #facc15, #ca8a04)',
    'from-orange-500 to-orange-700': 'linear-gradient(to bottom right, #f97316, #c2410c)',
    'from-red-500 to-red-600': 'linear-gradient(to bottom right, #ef4444, #dc2626)'
};

// Render Skills
function renderSkills() {
    const skillsContainer = document.querySelector('#skills .grid');
    skills.forEach((skill, index) => {
        const skillCard = document.createElement('div');
        const colorClasses = skill.color.split(' ');
        skillCard.className = `skill-tag p-6 rounded-lg shadow-lg cursor-pointer ${colorClasses.join(' ')}`;
        
        // FORCE apply gradient via inline style as backup
        const gradientKey = skill.color;
        if (gradientMap[gradientKey]) {
            skillCard.style.background = gradientMap[gradientKey];
        }
        
        skillCard.style.animationDelay = `${index * 0.1}s`;
        skillCard.innerHTML = `
            <div class="text-4xl mb-2 text-center">${skill.icon}</div>
            <div class="text-white font-semibold text-center">${skill.name}</div>
        `;
        skillsContainer.appendChild(skillCard);
    });
    
    console.log('Skills rendered with forced gradients');
}

// Typing Animation
const texts = [
    'Software Engineer',
    'Full-Stack Developer',
    'Java Enthusiast',
    'Problem Solver'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedTextElement = document.getElementById('typedText');

function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typedTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// Scroll Animations
function initScrollAnimations() {
    // Mobile-friendly observer options
    const isMobile = window.innerWidth < 768;
    const observerOptions = {
        threshold: isMobile ? 0.05 : 0.15, // Much lower threshold for mobile
        rootMargin: isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px' // Smaller margin for mobile
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                entry.target.classList.remove('section-hidden');
                console.log('Section visible:', entry.target.id || entry.target.className);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-hidden').forEach(section => {
        observer.observe(section);
    });
    
    console.log('Scroll animations initialized with mobile:', isMobile);
}

// Fallback: Show all sections after a delay if observer doesn't work
function ensureAllSectionsVisible() {
    setTimeout(() => {
        document.querySelectorAll('.section-hidden').forEach(section => {
            const rect = section.getBoundingClientRect();
            // If section is in viewport or has been scrolled past
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.classList.add('section-visible');
                section.classList.remove('section-hidden');
                console.log('Fallback: Making section visible', section.id);
            }
        });
    }, 2000); // Check after 2 seconds
}

// Also check on scroll
let scrollTimeout;
function checkVisibilityOnScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        document.querySelectorAll('.section-hidden').forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                section.classList.add('section-visible');
                section.classList.remove('section-hidden');
            }
        });
    }, 100);
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                document.getElementById('mobileMenu').classList.add('hidden');
            }
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('.mobile-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

// Particles Animation
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.width = Math.random() * 5 + 2 + 'px';
    particle.style.height = particle.style.width;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.background = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
    particle.style.animation = `float ${Math.random() * 3 + 2}s ease-in-out infinite`;
    particle.style.animationDelay = Math.random() * 2 + 's';
    document.getElementById('particles').appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 5000);
}

function initParticles() {
    setInterval(createParticle, 300);
}

// Copy Email Function
function copyEmail() {
    const email = 'chiranjivi.neupane96@gmail.com';
    const message = document.getElementById('copyMessage');
    
    // Try to copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
            message.textContent = 'Email copied to clipboard! ✓';
            message.style.opacity = '1';
            setTimeout(() => {
                message.style.opacity = '0';
            }, 3000);
        }).catch(() => {
            message.textContent = email;
            message.style.opacity = '1';
            setTimeout(() => {
                message.style.opacity = '0';
            }, 5000);
        });
    } else {
        // Fallback - just show the email
        message.textContent = email;
        message.style.opacity = '1';
        setTimeout(() => {
            message.style.opacity = '0';
        }, 5000);
    }
}

// Skill Card Click Effect
function initSkillCardEffects() {
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px) scale(1.05)';
            }, 100);
        });
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('nav.glass-effect');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Force gradient background if not loaded
function ensureGradientBackground() {
    const gradientSections = document.querySelectorAll('.gradient-bg');
    gradientSections.forEach(section => {
        // Force apply gradient style
        section.style.background = 'linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #4facfe)';
        section.style.backgroundSize = '400% 400%';
        section.style.animation = 'gradient 15s ease infinite';
        console.log('Gradient forcefully applied to section:', section);
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio loaded successfully!');
    console.log('Screen width:', window.innerWidth, 'Mobile:', window.innerWidth < 768);
    
    // Ensure gradient is applied
    ensureGradientBackground();
    
    // Check if gradient background is applied
    const heroSection = document.querySelector('.gradient-bg');
    if (heroSection) {
        console.log('Gradient background element found');
        const bgStyle = window.getComputedStyle(heroSection).background;
        console.log('Background style:', bgStyle);
    }
    
    renderSkills();
    type();
    initScrollAnimations();
    initSmoothScrolling();
    initMobileMenu();
    initParticles();
    initNavbarScroll();
    
    // Add skill card effects after skills are rendered
    setTimeout(initSkillCardEffects, 100);
    
    // Ensure sections become visible (fallback)
    ensureAllSectionsVisible();
    
    // Add scroll listener for visibility check
    window.addEventListener('scroll', checkVisibilityOnScroll, { passive: true });
    
    console.log('All components initialized');
});

// Also ensure on window load
window.addEventListener('load', function() {
    console.log('Window fully loaded');
    ensureGradientBackground();
});

