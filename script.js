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
    var backToTopButton = document.querySelector('.back-to-top');
    var revealItems = document.querySelectorAll('.section, .hero-copy, .portrait-card');
    var navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    allSections = document.querySelectorAll('header.hero, main > section');

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

    function updateBackToTopButton() {
        if (!backToTopButton) return;
        var shouldShow = window.scrollY > Math.max(360, window.innerHeight * 0.45);
        backToTopButton.classList.toggle('visible', shouldShow);
        backToTopButton.tabIndex = shouldShow ? 0 : -1;
        backToTopButton.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    }

    var activeSectionId = '';
    function highlightActiveNavLink() {
        var closestIdx = getClosestSection();
        var closestSec = allSections[closestIdx];
        if (!closestSec || closestSec.id === activeSectionId) return;

        navLinks.forEach(function(link) {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });

        if (closestSec.id) {
            var activeLink = document.querySelector('.main-nav a[href="#' + closestSec.id + '"]');
            if (activeLink) {
                activeLink.classList.add('active');
                activeLink.setAttribute('aria-current', 'location');
                activeSectionId = closestSec.id;

                // Recenter once per section change instead of restarting on every scroll frame.
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
        updateBackToTopButton();
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

    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

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
        var btn = card.querySelector('.case-expand-btn');

        function setCaseCardExpanded(targetCard, isExpanded) {
            var targetBody = targetCard.querySelector('.case-body');
            var targetBtn = targetCard.querySelector('.case-expand-btn');
            targetCard.classList.toggle('expanded', isExpanded);
            if (targetBody) {
                targetBody.style.maxHeight = isExpanded ? targetBody.scrollHeight + 'px' : '0px';
                targetBody.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');
            }
            if (targetBtn) {
                targetBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
                var currentLabel = targetBtn.getAttribute('aria-label');
                if (currentLabel) {
                    if (isExpanded) {
                        targetBtn.setAttribute('aria-label', currentLabel.replace('Expand', 'Collapse'));
                    } else {
                        targetBtn.setAttribute('aria-label', currentLabel.replace('Collapse', 'Expand'));
                    }
                }
            }
        }

        function toggleCaseCard() {
            var isExpanded = card.classList.contains('expanded');
            
            // Collapse all other case cards first to maintain single-accordion clarity
            caseCards.forEach(function(otherCard) {
                if (otherCard !== card && otherCard.classList.contains('expanded')) {
                    setCaseCardExpanded(otherCard, false);
                }
            });

            setCaseCardExpanded(card, !isExpanded);
        }

        if (btn) {
            btn.addEventListener('click', function() {
                toggleCaseCard();
            });
        }
    });

    // ==========================================
    // Writing Section Modals Logic
    // ==========================================
    var articleCards = document.querySelectorAll('.article-card[data-essay]');
    var modals = document.querySelectorAll('.essay-modal');
    var lastFocusedElement = null;

    function openModal(modalId, trigger) {
        var modal = document.getElementById(modalId);
        if (!modal) return;
        lastFocusedElement = trigger || document.activeElement;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scroll

        var closeBtn = modal.querySelector('.modal-close-btn');
        if (closeBtn) {
            window.setTimeout(function() {
                closeBtn.focus();
            }, 0);
        }
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Unlock background scroll
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
        lastFocusedElement = null;
    }

    articleCards.forEach(function(card) {
        var essayType = card.getAttribute('data-essay');
        var modalId = 'essay-modal-' + essayType;

        card.addEventListener('click', function() {
            openModal(modalId, card);
        });

        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(modalId, card);
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
        var activeModal = document.querySelector('.essay-modal.active');
        if (e.key === 'Tab' && activeModal) {
            e.preventDefault();
            var closeBtn = activeModal.querySelector('.modal-close-btn');
            if (closeBtn) closeBtn.focus();
        }
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
