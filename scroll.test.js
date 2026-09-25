const assert = require('assert');
const fs = require('fs');
const { JSDOM } = require('jsdom');
const { getClosestSection } = require('./script');

const sections = [
  { getBoundingClientRect: () => ({ top: -200 }) },
  { getBoundingClientRect: () => ({ top: 100 }) },
  { getBoundingClientRect: () => ({ top: 1200 }) }
];

const index = getClosestSection(sections);
assert.strictEqual(index, 1);

async function runInteractionTests() {
  const html = fs.readFileSync('./index.html', 'utf8');
  const script = fs.readFileSync('./script.js', 'utf8');
  const themeScript = fs.readFileSync('./theme.js', 'utf8');
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    url: 'https://anudeep-peela.github.io/'
  });
  const { window } = dom;
  const { document } = window;
  const scrollCalls = [];
  const windowScrollCalls = [];

  Object.defineProperty(window, 'innerWidth', { value: 390, configurable: true });
  window.requestAnimationFrame = (callback) => window.setTimeout(callback, 0);
  window.matchMedia = () => ({
    matches: false,
    addEventListener() {},
    addListener() {}
  });
  window.IntersectionObserver = class {
    observe(element) {
      element.classList.add('visible');
    }
    unobserve() {}
  };
  window.HTMLElement.prototype.scrollTo = function scrollTo(options) {
    scrollCalls.push(options);
    this.scrollLeft = options.left;
  };
  window.scrollTo = function scrollTo(options) {
    windowScrollCalls.push(options);
  };

  window.eval(themeScript);
  window.eval(script);
  await new Promise((resolve) => window.setTimeout(resolve, 0));

  const resumeLinks = [...document.querySelectorAll('a[href$=".pdf"]')];
  assert.strictEqual(resumeLinks.length, 3);
  resumeLinks.forEach((link) => {
    assert.strictEqual(link.getAttribute('href'), 'Q2_2026_Anudeep_Peela_Data_Scientist_Resume.pdf');
  });

  assert.strictEqual(document.title, 'Anudeep Peela | Senior Data Scientist at McKinsey | IIT Bombay');
  assert.ok(document.querySelector('meta[name="description"]').content.includes('McKinsey and IIT Bombay'));

  assert.strictEqual(document.querySelectorAll('.main-nav a[href^="#"]').length, 5);
  const themeToggle = document.querySelector('.theme-toggle');
  assert.ok(themeToggle);
  assert.strictEqual(document.documentElement.dataset.theme, 'light');
  assert.strictEqual(themeToggle.getAttribute('aria-pressed'), 'false');
  assert.strictEqual(themeToggle.getAttribute('aria-label'), 'Switch to dark mode');
  themeToggle.click();
  assert.strictEqual(document.documentElement.dataset.theme, 'dark');
  assert.strictEqual(window.localStorage.getItem('theme-preference'), 'dark');
  assert.strictEqual(themeToggle.getAttribute('aria-pressed'), 'true');
  assert.strictEqual(themeToggle.getAttribute('aria-label'), 'Switch to light mode');
  assert.strictEqual(document.querySelector('.main-nav a[href="#about"]').textContent, 'About');
  assert.strictEqual(document.querySelector('#about-title').textContent, 'I like problems that need both clear thinking and careful engineering.');
  assert.strictEqual(document.querySelectorAll('.life-item').length, 2);
  assert.strictEqual(document.querySelectorAll('.life-item img').length, 2);
  assert.strictEqual(document.querySelectorAll('#offduty').length, 0);
  assert.strictEqual(document.querySelectorAll('.hero-meta span').length, 3);
  assert.strictEqual(document.querySelector('#systems-title').textContent, 'Technical depth with business ownership.');
  assert.strictEqual(document.querySelectorAll('.capability-grid article').length, 5);
  assert.ok(document.querySelector('.capability-grid').textContent.includes('Databricks, API workflows'));
  assert.ok(document.querySelector('.capability-grid').textContent.includes('stakeholder management'));
  assert.ok(document.querySelector('.domain-line'));
  assert.strictEqual(document.querySelectorAll('img.credential-badge').length, 2);
  assert.strictEqual(document.querySelectorAll('.credential-card').length, 2);
assert.strictEqual(document.querySelector('#credentials-title').textContent, 'Professional credentials.');
  assert.strictEqual(document.querySelectorAll('.credential-link').length, 2);
assert.strictEqual(document.querySelectorAll('.credential-highlights').length, 2);
assert.strictEqual(document.querySelectorAll('.credential-highlights li').length, 4);
  assert.ok(document.querySelector('meta[http-equiv="Content-Security-Policy"]').content.includes('https://images.credly.com'));
  assert.strictEqual(document.querySelector('#writing-title').textContent, 'Notes on practical data and AI work.');
  assert.ok(document.querySelector('#writing').textContent.includes('Notes on modeling, search, optimization'));
  assert.ok(!document.querySelector('#writing').textContent.toLowerCase().includes('coming soon'));
  assert.strictEqual(document.querySelector('#contact-title').textContent, 'Let us talk about data, AI, and systems.');
  assert.ok(document.querySelector('.contact-actions a[href*="linkedin.com"]'));
  assert.ok(document.querySelector('.back-to-top'));

  const trackedSections = [...document.querySelectorAll('header.hero, main > section')];
  trackedSections.forEach((section, index) => {
    section.getBoundingClientRect = () => ({ top: index === 2 ? 10 : 1000 + index });
  });
  window.dispatchEvent(new window.Event('scroll'));
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  assert.strictEqual(document.querySelector('.main-nav a.active').textContent, 'Experience');
  assert.strictEqual(document.querySelector('.main-nav a.active').getAttribute('aria-current'), 'location');
  const scrollCallsAfterExperience = scrollCalls.length;

  window.dispatchEvent(new window.Event('scroll'));
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  assert.strictEqual(scrollCalls.length, scrollCallsAfterExperience);

  trackedSections.forEach((section, index) => {
    section.getBoundingClientRect = () => ({ top: index === 3 ? 10 : 1000 + index });
  });
  Object.defineProperty(window, 'scrollY', { value: 500, configurable: true });
  window.dispatchEvent(new window.Event('scroll'));
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  assert.strictEqual(document.querySelector('.main-nav a.active').textContent, 'Systems');
  assert.strictEqual(scrollCalls.length, scrollCallsAfterExperience + 1);
  assert.ok(document.querySelector('.back-to-top').classList.contains('visible'));

  document.querySelector('.back-to-top').click();
  const backToTopCall = windowScrollCalls.pop();
  assert.strictEqual(backToTopCall.top, 0);
  assert.strictEqual(backToTopCall.behavior, 'smooth');

  const caseCards = [...document.querySelectorAll('.case-card')];
  const caseButtons = [...document.querySelectorAll('.case-expand-btn')];
  assert.strictEqual(caseCards.length, 5);
  assert.ok(document.querySelector('#work').textContent.includes('Selected projects with measurable impact'));
  assert.ok(!document.querySelector('#work').textContent.toLowerCase().includes('confidentiality'));
  assert.ok(caseCards[0].classList.contains('case-card-mobility'));
  assert.ok(caseCards[1].classList.contains('case-card-document'));
  assert.ok(caseCards[2].classList.contains('case-card-pricing'));
  assert.ok(caseCards[3].classList.contains('case-card-quality'));
  assert.ok(caseCards[4].classList.contains('case-card-industrial'));
  assert.strictEqual(document.querySelectorAll('.case-proof-grid').length, 5);
  assert.strictEqual(document.querySelectorAll('[role="button"] button').length, 0);

  caseButtons[0].click();
  assert.strictEqual(caseButtons[0].getAttribute('aria-expanded'), 'true');
  assert.strictEqual(caseCards[0].querySelector('.case-body').getAttribute('aria-hidden'), 'false');

  caseButtons[1].click();
  assert.strictEqual(caseButtons[0].getAttribute('aria-expanded'), 'false');
  assert.strictEqual(caseButtons[1].getAttribute('aria-expanded'), 'true');

  const noteCard = document.querySelector('.article-card[data-essay]');
  noteCard.click();
  await new Promise((resolve) => window.setTimeout(resolve, 0));

  const modal = document.querySelector('.essay-modal');
  const closeButton = modal.querySelector('.modal-close-btn');
  assert.strictEqual(modal.getAttribute('aria-hidden'), 'false');
  assert.strictEqual(document.activeElement, closeButton);

  closeButton.click();
  assert.strictEqual(modal.getAttribute('aria-hidden'), 'true');
  assert.strictEqual(document.activeElement, noteCard);

  const css = fs.readFileSync('./style.css', 'utf8').replace(/\r\n/g, '\n');
  assert.match(css, /flex:\s*0 0 40px/);
  assert.doesNotMatch(css, /order:\s*-1/);
  assert.match(css, /\.main-nav \.nav-social,\s*\n\s*\.main-nav \.nav-cv\s*\{\s*\n\s*display:\s*none/);
  assert.match(css, /\.about-grid\s*\{\s*\n\s*display:\s*grid/);
  assert.match(css, /@media \(max-width: 980px\)[\s\S]*\.about-grid\s*\{\s*\n\s*grid-template-columns:\s*1fr/);
  assert.doesNotMatch(css, /\.offduty-grid/);
  assert.match(css, /\[data-theme="dark"\]/);
  assert.match(css, /\.theme-toggle\s*\{/);
  assert.match(css, /--button-primary-bg:/);
  assert.match(css, /--button-primary-text:/);
  assert.match(css, /\.credentials-grid\s*\{/);
}

function createThemeDom(storedTheme, systemThemeIsDark) {
  const html = fs.readFileSync('./index.html', 'utf8');
  const themeScript = fs.readFileSync('./theme.js', 'utf8');
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    url: 'https://anudeep-peela.github.io/'
  });
  const { window } = dom;

  window.matchMedia = () => ({
    matches: systemThemeIsDark,
    addEventListener() {},
    addListener() {}
  });
  if (storedTheme) window.localStorage.setItem('theme-preference', storedTheme);
  window.eval(themeScript);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  return window;
}

function runThemeTests() {
  const systemDarkWindow = createThemeDom(null, true);
  assert.strictEqual(systemDarkWindow.document.documentElement.dataset.theme, 'dark');

  const savedLightWindow = createThemeDom('light', true);
  assert.strictEqual(savedLightWindow.document.documentElement.dataset.theme, 'light');
  savedLightWindow.document.querySelector('.theme-toggle').click();
  assert.strictEqual(savedLightWindow.localStorage.getItem('theme-preference'), 'dark');
}

runInteractionTests()
  .then(runThemeTests)
  .then(() => console.log('portfolio interaction tests passed'))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
