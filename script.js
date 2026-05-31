var allSections;

function getClosestSection(list) {
    var sections = list || allSections || [];
    var closest = 0;
    var minDist = Infinity;

    sections.forEach(function(sec, idx) {
        var rect = sec.getBoundingClientRect();
        var dist = Math.abs(rect.top);
        if (dist < minDist) {
            minDist = dist;
            closest = idx;
        }
    });

    return closest;
}

if (typeof module !== 'undefined') {
    module.exports.getClosestSection = getClosestSection;
}

if (typeof document !== 'undefined') {
document.addEventListener('DOMContentLoaded', function() {
    var progress = document.querySelector('.scroll-progress');
    var revealItems = document.querySelectorAll('.section, .hero-copy, .portrait-card');
    var navLinks = document.querySelectorAll('.main-nav a');
    allSections = document.querySelectorAll('section, header.hero');

    revealItems.forEach(function(item) {
        item.classList.add('hidden');
    });

    var cachedScrollable = 0;
    function calculateScrollable() {
        cachedScrollable = document.documentElement.scrollHeight - window.innerHeight;
    }
    calculateScrollable();
    window.addEventListener('resize', calculateScrollable, { passive: true });

    function updateProgress() {
        if (!progress) return;
        var percent = cachedScrollable > 0 ? (window.scrollY / cachedScrollable) * 100 : 0;
        progress.style.width = Math.max(0, Math.min(100, percent)) + '%';
    }

    function highlightActiveNavLink() {
        var closestIdx = getClosestSection();
        var closestSec = allSections[closestIdx];
        if (!closestSec) return;

        navLinks.forEach(function(link) {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });

        if (closestSec.id) {
            var activeLink = document.querySelector('.main-nav a[href="#' + closestSec.id + '"]');
            if (activeLink) {
                activeLink.classList.add('active');
                activeLink.setAttribute('aria-current', 'true');

                // Smoothly center the active tab horizontally inside the mobile floating navigation bubble
                var nav = document.querySelector('.main-nav');
                if (nav && window.innerWidth <= 980) {
                    var offsetLeft = activeLink.offsetLeft;
                    var width = activeLink.clientWidth;
                    var navWidth = nav.clientWidth;
                    nav.scrollTo({
                        left: offsetLeft - (navWidth / 2) + (width / 2),
                        behavior: 'smooth'
                    });
                }
            }
        }
    }

    function handleScroll() {
        updateProgress();
        highlightActiveNavLink();
    }

    // ⚡ Bolt: Throttled scroll event using requestAnimationFrame
    // 💡 What: Wrapping the scroll handler in requestAnimationFrame
    // 🎯 Why: Unthrottled scroll events firing layout-reading functions like getBoundingClientRect can cause layout thrashing and drop frames, especially on mobile.
    // 📊 Impact: Limits execution to the browser's refresh rate (e.g., 60fps), reducing CPU usage and jank.
    var isTicking = false;
    function onScroll() {
        if (!isTicking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                isTicking = false;
            });
            isTicking = true;
        }
    }

    handleScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        revealItems.forEach(function(item) {
            observer.observe(item);
        });
    } else {
        revealItems.forEach(function(item) {
            item.classList.add('visible');
        });
    }

    // ==========================================
    // Case Studies Accordion Expand/Collapse Logic
    // ==========================================
    var caseCards = document.querySelectorAll('.case-card');
    caseCards.forEach(function(card) {
        var body = card.querySelector('.case-body');
        var btn = card.querySelector('.case-expand-btn');

        function toggleCaseCard() {
            var isExpanded = card.classList.contains('expanded');
            
            // Collapse all other case cards first to maintain single-accordion clarity
            caseCards.forEach(function(otherCard) {
                if (otherCard !== card && otherCard.classList.contains('expanded')) {
                    otherCard.classList.remove('expanded');
                    var otherBody = otherCard.querySelector('.case-body');
                    var otherBtn = otherCard.querySelector('.case-expand-btn');
                    if (otherBody) {
                        otherBody.style.maxHeight = '0px';
                        otherBody.setAttribute('aria-hidden', 'true');
                    }
                    if (otherBtn) {
                        otherBtn.setAttribute('aria-label', 'Expand Case Study');
                    }
                    otherCard.setAttribute('aria-expanded', 'false');
                }
            });

            if (isExpanded) {
                card.classList.remove('expanded');
                if (body) {
                    body.style.maxHeight = '0px';
                    body.setAttribute('aria-hidden', 'true');
                }
                if (btn) {
                    btn.setAttribute('aria-label', 'Expand Case Study');
                }
                card.setAttribute('aria-expanded', 'false');
            } else {
                card.classList.add('expanded');
                if (body) {
                    body.style.maxHeight = body.scrollHeight + 'px';
                    body.setAttribute('aria-hidden', 'false');
                }
                if (btn) {
                    btn.setAttribute('aria-label', 'Collapse Case Study');
                }
                card.setAttribute('aria-expanded', 'true');
            }
        }

        card.addEventListener('click', function(e) {
            // Avoid double-toggle if they explicitly clicked the expand button
            if (e.target.closest('.case-expand-btn')) {
                e.stopPropagation();
            }
            toggleCaseCard();
        });

        if (btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleCaseCard();
            });
        }

        // Keyboard accessibility
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // Prevent default space bar page scroll
                toggleCaseCard();
            }
        });
    });

    // ==========================================
    // Writing Section Modals Logic
    // ==========================================
    var articleCards = document.querySelectorAll('.article-card[data-essay]');
    var modals = document.querySelectorAll('.essay-modal');
    var previousFocusElement = null;

    function openModal(modalId) {
        var modal = document.getElementById(modalId);
        if (!modal) return;
        previousFocusElement = document.activeElement;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scroll

        // Focus close button inside modal for accessibility
        var closeBtn = modal.querySelector('.modal-close-btn');
        if (closeBtn) closeBtn.focus();
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Unlock background scroll
        if (previousFocusElement) {
            previousFocusElement.focus();
            previousFocusElement = null;
        }
    }

    articleCards.forEach(function(card) {
        var essayType = card.getAttribute('data-essay');
        var modalId = 'essay-modal-' + essayType;

        card.addEventListener('click', function() {
            openModal(modalId);
        });

        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(modalId);
            }
        });
    });

    modals.forEach(function(modal) {
        var closeBtn = modal.querySelector('.modal-close-btn');
        var overlay = modal.querySelector('.modal-overlay');

        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeModal(modal);
            });
        }

        if (overlay) {
            overlay.addEventListener('click', function() {
                closeModal(modal);
            });
        }
    });

    // Close modal on ESC key
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(function(modal) {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });
});
}
