document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  if (!mobileMenuButton || !mobileMenu || !iconOpen || !iconClose) {
    return;
  }

  const mobileMenuLinks = mobileMenu.querySelectorAll('a');

  const toggleMenu = () => {
    const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
    mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('hidden');
    iconOpen.classList.toggle('hidden');
    iconClose.classList.toggle('hidden');
  };

  mobileMenuButton.addEventListener('click', toggleMenu);

  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenuButton.getAttribute('aria-expanded') === 'true') {
        toggleMenu();
      }
    });
  });
});