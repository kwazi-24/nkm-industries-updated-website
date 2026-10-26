/**
 * NKM INDUSTRIES | Site interactions
 */
document.addEventListener('DOMContentLoaded', () => {
    const WHATSAPP_NUMBER = '27719737061';
    const CONTACT_EMAIL = 'info@nkmindustries.co.za';

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    if (menuToggle && mobileDrawer) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mobileDrawer.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- Navbar elevation + active link tracker (one throttled scroll handler) ---
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let ticking = false;

    function onScroll() {
        const y = window.scrollY;

        if (navbar) navbar.classList.toggle('scrolled', y > 40);

        sections.forEach(section => {
            const top = section.offsetTop - 120;
            const id = section.getAttribute('id');
            if (y >= top && y < top + section.offsetHeight) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });
    onScroll();

    // --- Contact form ---
    // The site is hosted on GitHub Pages (static), so there is no server to receive form data.
    // Instead the form opens a pre-filled WhatsApp chat, and offers an email fallback.
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalMessage = document.getElementById('modalMessage');
    const submitBtn = document.getElementById('submitBtn');
    const formError = document.getElementById('formError');

    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function showError(text, field) {
        formError.textContent = text;
        formError.hidden = false;
        contactForm.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        if (field) {
            field.classList.add('invalid');
            field.focus();
        }
    }

    function clearError() {
        formError.hidden = true;
        formError.textContent = '';
        contactForm.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearError();

            const nameEl = document.getElementById('fullName');
            const emailEl = document.getElementById('email');
            const messageEl = document.getElementById('message');
            const fullName = nameEl.value.trim();
            const email = emailEl.value.trim();
            const phone = document.getElementById('phone').value.trim();
            const division = document.getElementById('divisionSelect').value;
            const message = messageEl.value.trim();

            if (!fullName) return showError('Please enter your name.', nameEl);
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('Please enter a valid email address.', emailEl);
            if (!message) return showError('Please tell us how we can help.', messageEl);

            const text =
                `Hello NKM INDUSTRIES,\n\n` +
                `Name: ${fullName}\n` +
                `Email: ${email}\n` +
                (phone ? `Phone: ${phone}\n` : '') +
                `Service: ${division}\n\n` +
                `${message}`;

            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
            const mailUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Website enquiry: ' + division)}&body=${encodeURIComponent(text)}`;

            // Must happen directly in the click handler, otherwise browsers block the new tab.
            // (Passing 'noopener' would make window.open always return null, so we detach the opener manually.)
            const opened = window.open(waUrl, '_blank');
            if (opened) opened.opener = null;

            modalMessage.innerHTML =
                `Thank you, <strong>${escapeHtml(fullName)}</strong>.<br><br>` +
                (opened
                    ? `We have opened WhatsApp with your message ready. <strong>Press send in WhatsApp</strong> to complete your enquiry.`
                    : `Your browser blocked the WhatsApp window. <a href="${waUrl}" target="_blank" rel="noopener noreferrer">Open WhatsApp</a> to send your message.`) +
                `<br><br>Prefer email? <a href="${mailUrl}">Send it by email instead</a>.`;
            successModal.classList.add('active');
            modalCloseBtn.focus();

            contactForm.reset();
        });
    }

    // --- Modal close ---
    if (modalCloseBtn && successModal) {
        const closeModal = () => successModal.classList.remove('active');
        modalCloseBtn.addEventListener('click', closeModal);
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && successModal.classList.contains('active')) closeModal();
        });
    }
});

/**
 * Pre-selects the service in the enquiry form when a service button is clicked.
 */
function selectDivision(divisionName) {
    const select = document.getElementById('divisionSelect');
    const message = document.getElementById('message');

    if (select) {
        select.value = divisionName;
        select.classList.add('flash');
        setTimeout(() => select.classList.remove('flash'), 2000);
    }

    if (message) {
        if (divisionName.includes('Web Development')) {
            message.placeholder = 'e.g. We need a business website (from R2,999) and monthly marketing to get more enquiries…';
        } else if (divisionName.includes('Tech Solutions')) {
            message.placeholder = 'e.g. We need IT support, software, CCTV or cloud setup for our business…';
        } else if (divisionName.includes('Training Academy')) {
            message.placeholder = 'e.g. We are interested in learnerships, staff upskilling or youth ICT training…';
        }
    }
}
