---
name: Shell runtime auto-configuration
description: Replit may update project runtime modules when temporary scripts invoke a language runtime.
---

Replit may append a runtime module to `.replit` when a shell command first invokes that runtime, even when it is used only for temporary QA automation.

**Why:** Starting Python for one-off visual QA added `python-base-3.13` to this Node workspace's `.replit`, despite no Python product dependency.

**How to apply:** After invoking a non-project language runtime for temporary QA, inspect `.replit`; keep any added module only if the app or project tooling needs it.