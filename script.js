document.addEventListener('DOMContentLoaded', function() {
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
        sections.forEach(function(section) {
            section.classList.add('visible');
        });
    }
});
