(function () {
    'use strict';

    var storageKey = 'theme-preference';

    function getStoredTheme() {
        try {
            var theme = window.localStorage.getItem(storageKey);
            return theme === 'light' || theme === 'dark' ? theme : null;
        } catch (error) {
            return null;
        }
    }

    function getSystemTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function getPreferredTheme() {
        return getStoredTheme() || getSystemTheme();
    }

    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
    }

    function saveTheme(theme) {
        try {
            window.localStorage.setItem(storageKey, theme);
        } catch (error) {
            // The site remains usable when storage is unavailable.
        }
    }

    function updateToggle(toggle, theme) {
        var isDark = theme === 'dark';
        var label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        var icon = toggle.querySelector('i');

        toggle.setAttribute('aria-pressed', String(isDark));
        toggle.setAttribute('aria-label', label);
        toggle.setAttribute('title', label);
        if (icon) {
            icon.classList.toggle('fa-moon', !isDark);
            icon.classList.toggle('fa-sun', isDark);
        }
    }

    applyTheme(getPreferredTheme());

    document.addEventListener('DOMContentLoaded', function () {
        var toggle = document.querySelector('.theme-toggle');
        if (!toggle) return;

        updateToggle(toggle, document.documentElement.dataset.theme);
        toggle.addEventListener('click', function () {
            var nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
            saveTheme(nextTheme);
            updateToggle(toggle, nextTheme);
        });
    });

    if (window.matchMedia) {
        var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        var handleSystemThemeChange = function (event) {
            if (!getStoredTheme()) applyTheme(event.matches ? 'dark' : 'light');
        };

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
        } else if (mediaQuery.addListener) {
            mediaQuery.addListener(handleSystemThemeChange);
        }
    }
}());
