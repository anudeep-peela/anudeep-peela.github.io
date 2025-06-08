document.addEventListener('DOMContentLoaded', function() {
    var container = document.getElementById('mainContent');
    container.style.opacity = '1';

    var observer = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.hidden').forEach(function(section) {
        observer.observe(section);
    });
});
