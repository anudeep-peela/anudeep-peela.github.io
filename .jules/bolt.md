## 2024-05-15 - Unthrottled scroll handlers
**Learning:** Found a codebase-specific anti-pattern where layout-thrashing DOM reads (getBoundingClientRect) are performed within unthrottled scroll events, potentially degrading mobile scrolling performance.
**Action:** Always wrap scroll-based DOM reads in requestAnimationFrame or use IntersectionObserver.
