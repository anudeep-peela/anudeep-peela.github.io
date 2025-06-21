document.addEventListener('DOMContentLoaded', function() {
    var sections = document.querySelectorAll('.hidden');
    var allSections = document.querySelectorAll('.section');
    var about = document.getElementById('about');
    var contactBtn = document.querySelector('.contact-button');
    var currentIndex = 0;
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

        if (about) {
            var aboutObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        if (scrollDir === 'down') {
                            about.classList.add('slide-right');
                            about.classList.remove('slide-left');
                        } else {
                            about.classList.add('slide-left');
                            about.classList.remove('slide-right');
                        }
                    }
                });
            }, { threshold: 0.6 });
            aboutObserver.observe(about);
        }
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
        }, 120);
    }, { passive: true });

    window.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown') {
            gotoSection(currentIndex + 1);
        } else if (e.key === 'ArrowUp') {
            gotoSection(currentIndex - 1);
        }
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
