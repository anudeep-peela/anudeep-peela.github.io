document.addEventListener('DOMContentLoaded', function() {
    var sections = document.querySelectorAll('.hidden');
    var allSections = document.querySelectorAll('.section');
    var hero = document.getElementById('hero');
    var heroDisplay = hero ? hero.querySelector('.display') : null;
    var heroHighlight = hero ? hero.querySelector('.name-highlight') : null;
    var heroImg = hero ? hero.querySelector('img') : null;
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
            window.addEventListener('scroll', updateHero);
            window.addEventListener('resize', measureHero);
            measureHero();
            updateHero();
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
    var baseSlide = 0;
    var slideDistance = 0;

    function measureHero() {
        if (!heroDisplay || !heroImg) return;
        var textRect = heroDisplay.getBoundingClientRect();
        var imgRect = heroImg.getBoundingClientRect();
        baseSlide = 0; // initial transform is none
        slideDistance = imgRect.left - textRect.left;
    }

    function updateHero() {
        if (!heroDisplay || !heroImg || !heroHighlight) return;
        var heroRect = hero.getBoundingClientRect();
        var progress = Math.min(Math.max(-heroRect.top / heroRect.height, 0), 1);
        var x = progress * slideDistance;
        heroDisplay.style.transform = 'translateX(' + x + 'px)';
        var tagline = hero.querySelector('.tagline');
        if (tagline) tagline.style.opacity = 1 - progress;

        var textRect = heroDisplay.getBoundingClientRect();
        var imgRect = heroImg.getBoundingClientRect();
        var leftClip = Math.max(imgRect.left - textRect.left, 0);
        var rightClip = Math.max(textRect.right - imgRect.right, 0);
        if (imgRect.right > textRect.left && imgRect.left < textRect.right) {
            heroHighlight.style.clipPath = 'inset(0 ' + rightClip + 'px 0 ' + leftClip + 'px)';
        } else {
            heroHighlight.style.clipPath = 'inset(0 100% 0 0)';
        }
    }

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
