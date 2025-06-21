document.addEventListener('DOMContentLoaded', function() {
    var sections = document.querySelectorAll('.hidden');
    var allSections = document.querySelectorAll('.section');
    var about = document.getElementById('about');
    var contactBtn = document.querySelector('.contact-button');
    var hero = document.querySelector('.hero');
    var heroDisplay = hero ? hero.querySelector('.display') : null;
    var heroImage = hero ? hero.querySelector('.section-image img') : null;
    var slideDistance = 0;
    var heroLetters = [];
    var lastScrollY = window.pageYOffset;
    var scrollDir = 'down';

    function wrapLetters() {
        if (!heroDisplay) return;
        var text = heroDisplay.textContent;
        heroDisplay.innerHTML = '';
        text.split('').forEach(function(ch) {
            var span = document.createElement('span');
            span.textContent = ch === ' ' ? '\u00A0' : ch;
            heroDisplay.appendChild(span);
        });
        heroLetters = Array.from(heroDisplay.querySelectorAll('span'));
    }

    function measureHero() {
        if (heroDisplay) {
            slideDistance = heroDisplay.getBoundingClientRect().width;
        }
    }

    if (hero && heroDisplay && heroImage) {
        wrapLetters();
        hero.classList.add('intro');
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                hero.classList.remove('intro');
            });
        });

        heroDisplay.addEventListener('transitionend', function introEnd(e) {
            if (e.propertyName === 'transform') {
                heroDisplay.removeEventListener('transitionend', introEnd);
                startSlideAcross();
            }
        });
    } else {
        measureHero();
    }

    function startSlideAcross() {
        var finalOffset = heroImage.getBoundingClientRect().left - heroDisplay.getBoundingClientRect().left;
        heroDisplay.style.transition = 'transform 1s ease-out';
        heroDisplay.style.transform = 'translateX(' + finalOffset + 'px)';
        function updateColors() {
            var imgRect = heroImage.getBoundingClientRect();
            heroLetters.forEach(function(span) {
                var rect = span.getBoundingClientRect();
                var overlap = rect.left < imgRect.right && rect.right > imgRect.left;
                span.style.color = overlap ? 'var(--accent-blue)' : 'var(--primary-dark)';
            });
            animId = requestAnimationFrame(updateColors);
        }
        var animId = requestAnimationFrame(updateColors);
        heroDisplay.addEventListener('transitionend', function slideEnd(e) {
            if (e.propertyName === 'transform') {
                heroDisplay.removeEventListener('transitionend', slideEnd);
                cancelAnimationFrame(animId);
                updateColors();
                measureHero();
            }
        });
    }

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
    var adjustTimeout;
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
