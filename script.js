document.addEventListener('DOMContentLoaded', function() {
    var container = document.getElementById('mainContent');
    container.style.opacity = '1';

    var sections = document.querySelectorAll('.hidden');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries, obs) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(function(section) {
            observer.observe(section);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        sections.forEach(function(section) {
            section.classList.add('visible');
        });
    }
});
