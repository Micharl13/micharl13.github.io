// Micharl13 site interactions.

const rootStyles = getComputedStyle(document.documentElement);
const FADE_DURATION_MS = Number.parseFloat(
  rootStyles.getPropertyValue('--fade-duration')
) || 260;

function isSameSitePage(link) {
  if (!link.href) return false;
  if (link.target === '_blank') return false;
  if (link.hasAttribute('download')) return false;
  if (link.origin !== window.location.origin) return false;
  if (link.hash && link.pathname === window.location.pathname) return false;
  return /^https?:$/.test(link.protocol);
}

document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.remove('fade');
    });
  });

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.site-nav');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.querySelector('.sr-only').textContent = isOpen
        ? 'Close navigation'
        : 'Open navigation';
      menuButton.querySelector('i').className = isOpen
        ? 'bi bi-x-lg'
        : 'bi bi-list';
    });

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navigation.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.querySelector('.sr-only').textContent = 'Open navigation';
        menuButton.querySelector('i').className = 'bi bi-list';
      });
    });
  }

  document.querySelectorAll('a[href]').forEach((link) => {
    if (!isSameSitePage(link)) return;

    link.addEventListener('click', (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      document.body.classList.add('fade');

      window.setTimeout(() => {
        window.location.assign(link.href);
      }, FADE_DURATION_MS);
    });
  });
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    document.body.classList.remove('fade');
  }
});
