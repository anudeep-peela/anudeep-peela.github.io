document.addEventListener('DOMContentLoaded', function() {
    var sections = document.querySelectorAll('.hidden');
    var allSections = document.querySelectorAll('.section');
    var currentIndex = 0;

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

    function gotoSection(index) {
        if (index >= 0 && index < allSections.length) {
            currentIndex = index;
            allSections[currentIndex].scrollIntoView({ behavior: 'smooth' });
        }
    }

    var scrollTimeout;
    window.addEventListener('wheel', function(e) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            if (e.deltaY > 0) {
                gotoSection(currentIndex + 1);
            } else if (e.deltaY < 0) {
                gotoSection(currentIndex - 1);
            }
        }, 50);
    });

    window.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown') {
            gotoSection(currentIndex + 1);
        } else if (e.key === 'ArrowUp') {
            gotoSection(currentIndex - 1);
        }
    });
});
