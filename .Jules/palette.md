## 2024-05-30 - Dynamic ARIA Labels and Screen Reader Support

**Learning:** When creating interactive UI components with custom states (like an accordion or expandable card), simply setting an `aria-expanded` attribute is good, but screen reader users benefit greatly when the label of the trigger button also updates dynamically to reflect the next possible action (e.g. changing from "Expand" to "Collapse"). In addition, providing explicit `aria-label`s on icon-only interactive elements ensures the meaning is strictly conveyed, as `title` attributes alone aren't fully robust across all assistive tech. Also, keyboard accessibility requires providing mechanisms like a "Skip to main content" link to bypass large blocks of repetitive links (like main navigation).

**Action:** Always ensure accordion-like elements toggle the action word in their button's `aria-label`. Always pair icon-only links with explicit `aria-label` attributes alongside `title` for robust fallback. Always consider how keyboard-only users will navigate the top of the page.

## 2024-07-06 - App-Specific Accordion Dynamic Cues

**Learning:** This app's `.case-card` components utilize accordion-style expand buttons (`.case-expand-btn`) which update `aria-expanded` and `aria-hidden` properly but originally failed to update the descriptive action word (e.g., 'Expand' to 'Collapse') in their `aria-label`, preventing screen reader users from understanding the next available action after toggling.
**Action:** When dynamically modifying DOM attributes like `aria-label` to toggle action verbs (e.g., 'Expand' to 'Collapse'), use anchored regular expressions (like `/^Expand/`) to prevent unintended replacements of the same word elsewhere in the string, and defensively check for the attribute's existence (e.g., using `hasAttribute()`) before manipulating its value to prevent replacing missing attributes with unexpected empty strings.
