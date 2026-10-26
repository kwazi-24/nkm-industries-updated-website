/**
 * NKM INDUSTRIES | Light / dark theme
 * - First visit: follows the visitor's device setting (light or dark).
 * - After they press the toggle: their choice is remembered on this device.
 * Loaded in <head> so the right theme is applied before the page paints (no flash).
 */
(function () {
    var KEY = 'nkm-theme';
    var root = document.documentElement;

    function stored() {
        try {
            var v = localStorage.getItem(KEY);
            return v === 'dark' || v === 'light' ? v : null;
        } catch (e) {
            return null; // storage blocked (private mode etc.): just don't remember
        }
    }

    function save(theme) {
        try { localStorage.setItem(KEY, theme); } catch (e) { /* ignore */ }
    }

    function systemTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function apply(theme) {
        root.setAttribute('data-theme', theme);

        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b1426' : '#ffffff');

        var label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        var buttons = document.querySelectorAll('.theme-toggle');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute('aria-label', label);
            buttons[i].setAttribute('title', label);
        }
    }

    apply(stored() || systemTheme());

    document.addEventListener('DOMContentLoaded', function () {
        apply(root.getAttribute('data-theme') || 'light'); // refresh button labels
        var buttons = document.querySelectorAll('.theme-toggle');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function () {
                var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                apply(next);
                save(next);
            });
        }
    });

    // If the visitor never chose, keep following the device setting live.
    if (window.matchMedia) {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        var onChange = function () { if (!stored()) apply(systemTheme()); };
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);
    }
})();
