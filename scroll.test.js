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
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    url: 'https://anudeep-peela.github.io/'
  });
  const { window } = dom;
  const { document } = window;
  const scrollCalls = [];

  Object.defineProperty(window, 'innerWidth', { value: 390, configurable: true });
  window.requestAnimationFrame = (callback) => window.setTimeout(callback, 0);
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

  window.eval(script);
  await new Promise((resolve) => window.setTimeout(resolve, 0));

  const resumeLinks = [...document.querySelectorAll('a[href$=".pdf"]')];
  assert.strictEqual(resumeLinks.length, 3);
  resumeLinks.forEach((link) => {
    assert.strictEqual(link.getAttribute('href'), 'Q2_2026_Anudeep_Peela_Data_Scientist_Resume.pdf');
  });

  assert.strictEqual(document.querySelectorAll('.main-nav a[href^="#"]').length, 5);
  assert.strictEqual(document.querySelector('.main-nav a[href="#offduty"]').textContent, 'Life');
  assert.strictEqual(document.querySelectorAll('.hero-meta span').length, 3);
  assert.strictEqual(document.querySelectorAll('.capability-grid article').length, 4);
  assert.ok(document.querySelector('.domain-line'));

  const trackedSections = [...document.querySelectorAll('header.hero, main > section')];
  trackedSections.forEach((section, index) => {
    section.getBoundingClientRect = () => ({ top: index === 1 ? 10 : 1000 + index });
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
    section.getBoundingClientRect = () => ({ top: index === 2 ? 10 : 1000 + index });
  });
  window.dispatchEvent(new window.Event('scroll'));
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  assert.strictEqual(document.querySelector('.main-nav a.active').textContent, 'Systems');
  assert.strictEqual(scrollCalls.length, scrollCallsAfterExperience + 1);

  const caseCards = [...document.querySelectorAll('.case-card')];
  const caseButtons = [...document.querySelectorAll('.case-expand-btn')];
  assert.strictEqual(caseCards.length, 3);
  assert.ok(caseCards[0].classList.contains('case-card-mobility'));
  assert.ok(caseCards[1].classList.contains('case-card-pharma'));
  assert.ok(caseCards[2].classList.contains('case-card-automotive'));
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
  assert.ok(
    css.lastIndexOf('@media (max-width: 980px) {\n  .offduty-grid') >
      css.lastIndexOf('.offduty-grid {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));'),
    'mobile Life grid override must follow the desktop grid declaration'
  );
}

runInteractionTests()
  .then(() => console.log('portfolio interaction tests passed'))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
