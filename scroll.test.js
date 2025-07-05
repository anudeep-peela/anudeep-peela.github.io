const assert = require('assert');
const { getClosestSection } = require('./script');

const sections = [
  { getBoundingClientRect: () => ({ top: -200 }) },
  { getBoundingClientRect: () => ({ top: 100 }) },
  { getBoundingClientRect: () => ({ top: 1200 }) }
];

const index = getClosestSection(sections);
assert.strictEqual(index, 1);
console.log('scroll snapping tests passed');
