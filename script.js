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
    allSections = document.querySelectorAll('section, header.hero');

    revealItems.forEach(function(item) {
        item.classList.add('hidden');
    });

    function updateProgress() {
        if (!progress) return;
        var scrollable = document.documentElement.scrollHeight - window.innerHeight;
        var percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        progress.style.width = Math.max(0, Math.min(100, percent)) + '%';
    }

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

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
