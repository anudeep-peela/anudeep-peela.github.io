## 2024-05-30 - Dynamic ARIA Labels and Screen Reader Support

**Learning:** When creating interactive UI components with custom states (like an accordion or expandable card), simply setting an `aria-expanded` attribute is good, but screen reader users benefit greatly when the label of the trigger button also updates dynamically to reflect the next possible action (e.g. changing from "Expand" to "Collapse"). In addition, providing explicit `aria-label`s on icon-only interactive elements ensures the meaning is strictly conveyed, as `title` attributes alone aren't fully robust across all assistive tech. Also, keyboard accessibility requires providing mechanisms like a "Skip to main content" link to bypass large blocks of repetitive links (like main navigation).

**Action:** Always ensure accordion-like elements toggle the action word in their button's `aria-label`. Always pair icon-only links with explicit `aria-label` attributes alongside `title` for robust fallback. Always consider how keyboard-only users will navigate the top of the page.

## 2024-05-30 - Focus Indicators and 'outline: none' Anti-Pattern

**Learning:** It is a common anti-pattern to use `outline: none` on `:focus` or `:focus-visible` pseudo-classes without providing an accessible visual fallback (e.g., using `box-shadow` or another high-contrast indicator). This heavily degrades the experience for keyboard-only users, as they lose track of their position on the page. In this project, there is a centralized focus style convention (`outline: 3px solid var(--accent); outline-offset: 4px;`) that should be uniformly applied across all interactive elements (buttons, links, modals, accordions).
**Action:** Never apply `outline: none;` on focus states without immediately supplying an accessible alternative. Always utilize the existing accessible focus ring pattern `.focus-visible` for any new interactive components.
