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
        });

        if (closestSec.id) {
            var activeLink = document.querySelector('.main-nav a[href="#' + closestSec.id + '"]');
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    function handleScroll() {
        updateProgress();
        highlightActiveNavLink();
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

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
});
}
