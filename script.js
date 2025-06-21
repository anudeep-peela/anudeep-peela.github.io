document.addEventListener('DOMContentLoaded', function() {
    var sections = document.querySelectorAll('.hidden');
    var allSections = document.querySelectorAll('.section');
    var hero = document.getElementById('hero');
    var about = document.getElementById('about');
    var contactBtn = document.querySelector('.contact-button');
    var lastScrollY = window.pageYOffset;
    var scrollDir = 'down';

    window.addEventListener('scroll', function() {
        var newY = window.pageYOffset;
        scrollDir = newY > lastScrollY ? 'down' : 'up';
        lastScrollY = newY;
    });

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

        if (hero) {
            var heroObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (!entry.isIntersecting) {
                        hero.classList.add('scrolled');
                    } else {
                        hero.classList.remove('scrolled');
                    }
                });
            }, { threshold: 0.1 });
            heroObserver.observe(hero);
        }
        if (about) {
            window.addEventListener('scroll', updateAbout);
            updateAbout();
        }
    } else {
        sections.forEach(function(section) {
            section.classList.add('visible');
        });
    }
    var adjustTimeout;
    function updateAbout() {
        var rect = about.getBoundingClientRect();
        var windowHeight = window.innerHeight;
        var progress = Math.min(Math.max((windowHeight - rect.top) / windowHeight, 0), 1);
        var dirFactor = scrollDir === 'down' ? 1 : -1;
        var offset = (1 - progress) * 40 * dirFactor;
        about.style.transform = 'translateX(' + offset + 'px)';
        about.style.opacity = progress;
    }
    window.addEventListener("scroll", function() {
        clearTimeout(adjustTimeout);
        adjustTimeout = setTimeout(function() {
            var viewportHeight = window.innerHeight;
            var maxRatio = 0;
            var target = null;
            allSections.forEach(function(sec) {
                var rect = sec.getBoundingClientRect();
                var visible = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
                var ratio = Math.max(0, visible) / viewportHeight;
                if (ratio > maxRatio) {
                    maxRatio = ratio;
                    target = sec;
                }
            });
            if (target) {
                target.scrollIntoView({behavior: "smooth"});
            }
        }, 100);
    });

    if (contactBtn) {
        contactBtn.addEventListener('mousemove', function(ev) {
            var rect = contactBtn.getBoundingClientRect();
            var x = ev.clientX - rect.left - rect.width / 2;
            var y = ev.clientY - rect.top - rect.height / 2;
            contactBtn.style.transform = 'translate(' + x * 0.2 + 'px,' + y * 0.2 + 'px)';
        });
        contactBtn.addEventListener('mouseleave', function() {
            contactBtn.style.transform = '';
        });
        contactBtn.addEventListener('mousedown', function() {
            contactBtn.classList.add('clicked');
        });
        contactBtn.addEventListener('mouseup', function() {
            contactBtn.classList.remove('clicked');
        });
    }
});
