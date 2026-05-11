/**
 * Sarmaya Landing Page - Parallax Effects Engine
 * Creates beautiful, smooth parallax scrolling effects
 */

class SarmayaParallax {
    constructor() {
        this.scrollY = 0;
        this.ticking = false;
        this.isMobile = window.innerWidth <= 768;

        this.init();
    }

    init() {
        // Add parallax-ready class to body
        document.body.classList.add('parallax-ready');

        // Setup all parallax elements
        this.setupHero();
        this.setupScrollReveal();
        this.setupMouseParallax();
        this.setupScrollProgress();
        this.setupNavbarTransform();

        // Attach event listeners
        this.attachListeners();

        // Initial animations
        this.animateOnLoad();
    }

    setupHero() {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.setAttribute('data-parallax', 'hero');

            // Add parallax layers
            const h1 = hero.querySelector('h1');
            const subtitle = hero.querySelector('.subtitle');
            const buttons = hero.querySelector('.cta-buttons');
            const stats = hero.querySelector('.stats');

            if (h1) h1.setAttribute('data-parallax-speed', '0.5');
            if (subtitle) subtitle.setAttribute('data-parallax-speed', '0.3');
            if (buttons) buttons.setAttribute('data-parallax-speed', '0.4');
            if (stats) stats.setAttribute('data-parallax-speed', '0.2');
        }
    }

    setupScrollReveal() {
        const revealElements = document.querySelectorAll('.feature-card, .step, .pricing-card, .testimonial-card, .office-card, .faq-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach((el, index) => {
            el.classList.add('reveal-on-scroll');
            el.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    }

    setupMouseParallax() {
        if (this.isMobile) return;

        const hero = document.querySelector('.hero');
        if (!hero) return;

        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            const moveX = (mouseX - 0.5) * 30;
            const moveY = (mouseY - 0.5) * 30;

            // Apply to particles
            const particles = document.getElementById('particles');
            if (particles) {
                particles.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }

            // Apply to hero elements
            const h1 = hero.querySelector('h1');
            if (h1) {
                h1.style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
            }
        });
    }

    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);
    }

    setupNavbarTransform() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });

        const hero = document.querySelector('.hero');
        if (hero) observer.observe(hero);
    }

    attachListeners() {
        window.addEventListener('scroll', () => {
            this.scrollY = window.pageYOffset;

            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.updateParallax();
                    this.updateScrollProgress();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
        });
    }

    updateParallax() {
        if (this.isMobile) return;

        const scrolled = this.scrollY;

        // Hero parallax
        const hero = document.querySelector('[data-parallax="hero"]');
        if (hero) {
            const heroHeight = hero.offsetHeight;
            const heroVisible = scrolled < heroHeight;

            if (heroVisible) {
                // Parallax background
                const particles = document.getElementById('particles');
                if (particles) {
                    particles.style.transform = `translateY(${scrolled * 0.5}px)`;
                }

                // Parallax hero elements
                const elementsWithSpeed = hero.querySelectorAll('[data-parallax-speed]');
                elementsWithSpeed.forEach(el => {
                    const speed = parseFloat(el.getAttribute('data-parallax-speed'));
                    const yPos = scrolled * speed;
                    el.style.transform = `translateY(${yPos}px)`;
                });

                // Fade out hero
                const opacity = Math.max(0, 1 - (scrolled / heroHeight) * 1.5);
                hero.style.opacity = opacity;
            }
        }

        // Feature cards parallax
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (isVisible) {
                const scrollProgress = (window.innerHeight - rect.top) / window.innerHeight;
                const translateY = scrollProgress * 20 * (index % 2 === 0 ? 1 : -1);
                card.style.transform = `translateY(${translateY}px)`;
            }
        });

        // Pricing cards depth
        const pricingCards = document.querySelectorAll('.pricing-card');
        pricingCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (isVisible) {
                const scrollProgress = (window.innerHeight - rect.top) / window.innerHeight;
                const translateY = scrollProgress * 15 * (index - 1);
                card.style.transform = `translateY(${translateY}px) scale(${card.classList.contains('featured') ? 1.05 : 1})`;
            }
        });
    }

    updateScrollProgress() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (this.scrollY / windowHeight) * 100;

        const progressBar = document.querySelector('.scroll-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    animateOnLoad() {
        // Animate hero elements on page load
        const hero = document.querySelector('.hero');
        if (hero) {
            setTimeout(() => {
                hero.classList.add('loaded');
            }, 100);
        }

        // Floating animation for stat cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`;
        });
    }
}

// Hover tilt effect for cards
class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.feature-card, .pricing-card');
        this.init();
    }

    init() {
        if (window.innerWidth <= 768) return; // Skip on mobile

        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.1s ease';
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.3s ease';
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }
}

// Particle animation enhancement
class ParticleEnhancer {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.init();
    }

    init() {
        const particles = document.getElementById('particles');
        if (!particles) return;

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';

        particles.appendChild(this.canvas);

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const count = Math.min(50, Math.floor(window.innerWidth / 30));

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
            this.ctx.fill();

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 100)})`;
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const parallax = new SarmayaParallax();
    const tilt = new TiltEffect();
    const particleEnhancer = new ParticleEnhancer();

    console.log('✨ Sarmaya parallax effects loaded');
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    /* Scroll Progress Bar */
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(0, 0, 0, 0.1);
        z-index: 9999;
    }

    .scroll-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #6366f1, #06b6d4);
        width: 0%;
        transition: width 0.1s ease;
    }

    /* Reveal on Scroll */
    .reveal-on-scroll {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .reveal-on-scroll.revealed {
        opacity: 1;
        transform: translateY(0);
    }

    /* Hero loaded state */
    .hero {
        transition: opacity 0.3s ease;
    }

    .hero.loaded h1 {
        animation: heroSlideIn 0.8s ease-out;
    }

    @keyframes heroSlideIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Floating animation */
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    /* Navbar transform */
    nav {
        transition: all 0.3s ease;
    }

    nav.scrolled {
        background: rgba(15, 23, 42, 0.95) !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        padding: 15px 0;
    }

    /* Card enhancements */
    .feature-card, .pricing-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        will-change: transform;
    }

    /* Mobile optimizations */
    @media (max-width: 768px) {
        .reveal-on-scroll {
            transform: translateY(20px);
        }

        .scroll-progress {
            height: 2px;
        }
    }
`;
document.head.appendChild(style);
