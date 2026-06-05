## 2024-05-30 - Dynamic ARIA Labels and Screen Reader Support

**Learning:** When creating interactive UI components with custom states (like an accordion or expandable card), simply setting an `aria-expanded` attribute is good, but screen reader users benefit greatly when the label of the trigger button also updates dynamically to reflect the next possible action (e.g. changing from "Expand" to "Collapse"). In addition, providing explicit `aria-label`s on icon-only interactive elements ensures the meaning is strictly conveyed, as `title` attributes alone aren't fully robust across all assistive tech. Also, keyboard accessibility requires providing mechanisms like a "Skip to main content" link to bypass large blocks of repetitive links (like main navigation).

**Action:** Always ensure accordion-like elements toggle the action word in their button's `aria-label`. Always pair icon-only links with explicit `aria-label` attributes alongside `title` for robust fallback. Always consider how keyboard-only users will navigate the top of the page.

## 2026-06-05 - Restoring Keyboard Navigation Focus Outlines
**Learning:** Suppressing default browser focus rings with `outline: none;` without providing custom focus styles completely breaks keyboard accessibility, leaving users unable to see which element is active.
**Action:** Always ensure that when removing default outlines, an explicit and highly visible `:focus-visible` outline state (e.g., `outline: 3px solid var(--accent); outline-offset: 4px;`) is added for interactive elements.
