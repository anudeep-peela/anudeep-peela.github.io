## 2024-05-30 - Dynamic ARIA Labels and Screen Reader Support

**Learning:** When creating interactive UI components with custom states (like an accordion or expandable card), simply setting an `aria-expanded` attribute is good, but screen reader users benefit greatly when the label of the trigger button also updates dynamically to reflect the next possible action (e.g. changing from "Expand" to "Collapse"). In addition, providing explicit `aria-label`s on icon-only interactive elements ensures the meaning is strictly conveyed, as `title` attributes alone aren't fully robust across all assistive tech. Also, keyboard accessibility requires providing mechanisms like a "Skip to main content" link to bypass large blocks of repetitive links (like main navigation).

**Action:** Always ensure accordion-like elements toggle the action word in their button's `aria-label`. Always pair icon-only links with explicit `aria-label` attributes alongside `title` for robust fallback. Always consider how keyboard-only users will navigate the top of the page.

## 2024-05-30 - Standardizing Accessible Focus Indicators

**Learning:** Using `outline: none;` on `:focus-visible` without replacing it with an equivalent, highly visible indicator severely harms keyboard accessibility. While removing default browser focus rings is common for aesthetics, it must be replaced with a robust alternative.
**Action:** Always avoid `outline: none;` on `:focus-visible` unless a custom ring is applied. Use the standard centralized focus indicator (e.g., `outline: 3px solid var(--accent); outline-offset: 4px;`) consistently across all interactive elements (buttons, nav links, etc.) so users have a predictable experience.
