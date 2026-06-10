## 2024-06-06 - Keyboard Navigation Focus States
**Learning:** Found an accessibility anti-pattern where `outline: none` was used on `:focus-visible` for buttons and navigation links. This completely removes the focus indicator for keyboard users, relying only on background changes which often fail contrast requirements and are hard to spot.
**Action:** Replaced `outline: none` with explicit, high-contrast focus rings (`outline: 3px solid var(--accent)`) on all interactive elements. Always ensure keyboard focus is visibly distinct from hover states.
