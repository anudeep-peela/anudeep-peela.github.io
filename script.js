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
    var sections = document.querySelectorAll('.hidden');
    allSections = document.querySelectorAll('.section');
    var about = document.getElementById('about');
    var contactBtn = document.querySelector('.contact-button');
    var hero = document.querySelector('.hero');
    var heroDisplay = hero ? hero.querySelector('.display') : null;
    var heroImage = hero ? hero.querySelector('.section-image img') : null;
    var portfolioCarousel = document.querySelector('.portfolio-carousel');
    var contactForm = document.querySelector('.contact-form');
    var contactSection = document.getElementById('contact');
    var interestsSection = document.getElementById('interests');
    var slideDistance = 0;
    var heroLetters = [];
    var hasSlid = false;
    var lastScrollY = window.pageYOffset;
    var scrollDir = 'down';
    var currentSectionIndex = 0;
    var snapTimer;

    function wrapLetters() {
        if (!heroDisplay) return;
        var html = heroDisplay.innerHTML;
        var parts = html.split(/<br\s*\/?>(?:\n)?/i);
        var frag = document.createDocumentFragment();
        parts.forEach(function(part, idx) {
            part.split('').forEach(function(ch) {
                var span = document.createElement('span');
                span.textContent = ch === ' ' ? '\u00A0' : ch;
                frag.appendChild(span);
            });
            if (idx < parts.length - 1) {
                frag.appendChild(document.createElement('br'));
            }
        });
        heroDisplay.innerHTML = '';
        heroDisplay.appendChild(frag);
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
                measureHero();
            }
        });
    } else {
        measureHero();
    }

    function startSlideAcross() {
        if (hasSlid) return;
        hasSlid = true;
        var displayRect = heroDisplay.getBoundingClientRect();
        var finalOffset = window.innerWidth - displayRect.left + displayRect.width;
        heroDisplay.style.transition = 'transform 1s ease-out';
        heroDisplay.style.transform = 'translateX(' + finalOffset + 'px)';
        heroImage.style.transition = 'transform 1s ease-out';
        heroImage.style.transform = 'scale(0)';
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

    function slideBack() {
        if (!hasSlid) return;
        hasSlid = false;
        heroDisplay.style.transition = 'transform 1s ease-out';
        heroDisplay.style.transform = 'translateX(0)';
        heroImage.style.transition = 'transform 1s ease-out';
        heroImage.style.transform = 'scale(1)';
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
        heroDisplay.addEventListener('transitionend', function backEnd(e) {
            if (e.propertyName === 'transform') {
                heroDisplay.removeEventListener('transitionend', backEnd);
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
                            startSlideAcross();
                        }
                    } else {
                        if (scrollDir === 'up') {
                            about.classList.add('slide-left');
                            about.classList.remove('slide-right');
                            slideBack();
                        }
                    }
                });
            }, { threshold: 0.6 });
            aboutObserver.observe(about);
        }
        var mainNav = document.querySelector(".main-nav");
        if (mainNav && interestsSection) {
            var navObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        mainNav.classList.add("white");
                    } else {
                        mainNav.classList.remove("white");
                    }
                });
            }, { threshold: 0.6 });
            navObserver.observe(interestsSection);
        }

    } else {
        sections.forEach(function(section) {
            section.classList.add('visible');
        });
    }

    function snapToSection() {
        var targetIndex = getClosestSection();
        if (targetIndex !== currentSectionIndex) {
            currentSectionIndex = targetIndex;
            allSections[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    window.addEventListener('scroll', function() {
        clearTimeout(snapTimer);
        snapTimer = setTimeout(snapToSection, 120);
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

    if (portfolioCarousel) {
        var cards = portfolioCarousel.querySelectorAll('.project-card');
        var activeIndex = 0;

        function highlightActive() {
            var center = portfolioCarousel.scrollLeft + portfolioCarousel.clientWidth / 2;
            var closest = 0;
            var minDist = Infinity;
            cards.forEach(function(card, i) {
                var rect = card.getBoundingClientRect();
                var cardCenter = rect.left + rect.width / 2 + portfolioCarousel.scrollLeft - portfolioCarousel.getBoundingClientRect().left;
                var dist = Math.abs(cardCenter - center);
                if (dist < minDist) {
                    minDist = dist;
                    closest = i;
                }
            });
            activeIndex = closest;
            cards.forEach(function(card, i) {
                if (i === activeIndex) card.classList.add('active');
                else card.classList.remove('active');
            });
        }

        function autoRotate() {
            activeIndex = (activeIndex + 1) % cards.length;
            var target = cards[activeIndex];
            portfolioCarousel.scrollTo({
                left: target.offsetLeft - (portfolioCarousel.clientWidth - target.clientWidth) / 2,
                behavior: 'smooth'
            });
            highlightActive();
        }

        highlightActive();
        var rotateId = setInterval(autoRotate, 5000);
        portfolioCarousel.addEventListener('scroll', function() {
            highlightActive();
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(ev) {
            ev.preventDefault();
            var name = contactForm.querySelector('#name').value;
            var email = contactForm.querySelector('#email').value;
            var message = contactForm.querySelector('#message').value;
            var mail = 'mailto:anudeep.peela@example.com?subject=Portfolio%20Contact&body=' + encodeURIComponent(message + '\n\nFrom: ' + name + ' <' + email + '>');
            window.location.href = mail;
        });
    }

    if (contactSection && window.VANTA && window.VANTA.BIRDS) {
        VANTA.BIRDS({
            el: contactSection,
            backgroundColor: 0x829bff,
            backgroundAlpha: 1,
            color1: 0xff0000,
            color2: 0x00d1ff,
            colorMode: "varianceGradient",
            quantity: 5,
            birdSize: 1,
            wingSpan: 30,
            speedLimit: 5,
            separation: 20,
            alignment: 20,
            cohesion: 20
        });
    }

    if (interestsSection && window.VANTA && window.VANTA.NET) {
        VANTA.NET({
            el: interestsSection,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xff3f81,
            backgroundColor: 0x23153c,
            points: 10.00,
            maxDistance: 20.00,
            spacing: 15.00,
            showDots: true
        });
    }
});
}
