const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('open');
  document.body.classList.remove('menu-open');
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

document.querySelector('#year').textContent = new Date().getFullYear();

const analyticsId = 'G-CGFZ4H8YH2';
const consentKey = 'terre-analytics-consent';
const consentBanner = document.querySelector('#consent-banner');
let analyticsLoaded = false;

function getConsent() {
  try {
    return localStorage.getItem(consentKey);
  } catch {
    return null;
  }
}

function setConsent(choice) {
  try {
    localStorage.setItem(consentKey, choice);
  } catch {
    // If storage is unavailable, ask again on the next visit.
  }
}

function loadAnalytics() {
  if (analyticsLoaded) return;
  analyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', analyticsId);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
  document.head.appendChild(script);
}

function clearAnalyticsCookies() {
  const hostParts = window.location.hostname.split('.');
  const domains = [''];
  for (let i = 0; i < hostParts.length - 1; i += 1) {
    domains.push(`; domain=.${hostParts.slice(i).join('.')}`);
  }
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.trim().split('=')[0];
    if (!/^(?:_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name)) return;
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
    });
  });
}

function saveConsent(choice) {
  const previousChoice = getConsent();
  setConsent(choice);
  consentBanner.hidden = true;
  if (choice === 'accepted') {
    loadAnalytics();
  } else if (previousChoice === 'accepted' || analyticsLoaded) {
    // Reload to stop the already loaded analytics script from tracking this page.
    clearAnalyticsCookies();
    window.location.reload();
  }
}

document.querySelector('#consent-accept').addEventListener('click', () => saveConsent('accepted'));
document.querySelector('#consent-reject').addEventListener('click', () => saveConsent('rejected'));
document.querySelector('#consent-settings').addEventListener('click', () => {
  consentBanner.hidden = false;
  document.querySelector('#consent-reject').focus();
});

if (getConsent() === 'accepted') loadAnalytics();
else if (getConsent() !== 'rejected') consentBanner.hidden = false;

const revealElements = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
}
