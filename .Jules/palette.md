## 2024-05-30 - Dynamic ARIA Labels and Screen Reader Support

**Learning:** When creating interactive UI components with custom states (like an accordion or expandable card), simply setting an `aria-expanded` attribute is good, but screen reader users benefit greatly when the label of the trigger button also updates dynamically to reflect the next possible action (e.g. changing from "Expand" to "Collapse"). In addition, providing explicit `aria-label`s on icon-only interactive elements ensures the meaning is strictly conveyed, as `title` attributes alone aren't fully robust across all assistive tech. Also, keyboard accessibility requires providing mechanisms like a "Skip to main content" link to bypass large blocks of repetitive links (like main navigation).

**Action:** Always ensure accordion-like elements toggle the action word in their button's `aria-label`. Always pair icon-only links with explicit `aria-label` attributes alongside `title` for robust fallback. Always consider how keyboard-only users will navigate the top of the page.

## 2026-06-11 - Dynamic ARIA Label updates for stateful toggle buttons
**Learning:** When using expand/collapse buttons for elements like case study details or accordions, ensuring the `aria-label` dynamically reflects the *next* available action is crucial. Updating `aria-expanded` handles state for some screen reader modes, but actually changing the label text from "Expand" to "Collapse" makes the interaction completely explicit and unambiguous.
**Action:** Always verify that interactive accordion buttons swap their `aria-label` action verbs to match the current state (e.g., Expand -> Collapse) dynamically via JavaScript.
