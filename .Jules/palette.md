## 2024-05-30 - Dynamic ARIA Labels and Screen Reader Support

**Learning:** When creating interactive UI components with custom states (like an accordion or expandable card), simply setting an `aria-expanded` attribute is good, but screen reader users benefit greatly when the label of the trigger button also updates dynamically to reflect the next possible action (e.g. changing from "Expand" to "Collapse"). In addition, providing explicit `aria-label`s on icon-only interactive elements ensures the meaning is strictly conveyed, as `title` attributes alone aren't fully robust across all assistive tech. Also, keyboard accessibility requires providing mechanisms like a "Skip to main content" link to bypass large blocks of repetitive links (like main navigation).

**Action:** Always ensure accordion-like elements toggle the action word in their button's `aria-label`. Always pair icon-only links with explicit `aria-label` attributes alongside `title` for robust fallback. Always consider how keyboard-only users will navigate the top of the page.
## 2026-06-09 - Consistent Keyboard Navigation and Dynamic Screen Reader Labels

**Learning:** Removing `outline: none;` on `:focus-visible` without providing an alternative focus ring is a severe accessibility anti-pattern. Centralizing focus styles ensures a consistent experience for keyboard users across all interactive elements (buttons, links, modals, expanders). Furthermore, dynamically updating the action verb in `aria-label` attributes (e.g., swapping 'Expand' with 'Collapse') drastically improves clarity for screen reader users when interacting with toggles.

**Action:** Consistently route all interactive elements' `:focus-visible` states to the shared accessibility focus ring class/rule instead of stripping outlines. Always implement state-dependent text replacement for ARIA labels on stateful toggle buttons.
