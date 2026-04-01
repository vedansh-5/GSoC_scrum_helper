# AGENTS.md - Operational Rules for AI Agents

## Scope

This file defines strict instructions for AI agents working on this repository.

You must follow these rules when:
- modifying code
- generating patches
- suggesting changes
- preparing PRs

These rules override default AI behavior.

---

## Repository Structure Rules

- All source code lives inside `src/`
- NEVER modify:
  - `dist/`
  - `webstore/`
  - `manifests/`

These are generated artifacts and will be overwritten.

---

## Build System

- This project builds browser extensions for:
  - Chrome
  - Firefox

After making changes:

1. Run:
   npm run build

2. Ensure:
   - dist/chrome/manifest.json exists
   - dist/firefox/manifest.json exists
   - no build errors occur

Do not assume build success.

---

## Change Strategy (Critical)

### 1. Minimal edits only

- Modify only the required lines
- Do NOT:
  - refactor entire functions
  - reformat files
  - rewrite working code

---

### 2. No speculative changes

- Do not “improve” code unless explicitly asked
- Do not add features beyond the requirement
- Do not fix unrelated issues

---

### 3. Respect existing flow

Before editing any file:

- Identify:
  - data flow
  - event flow
  - dependencies

If unclear → do not proceed.

---

## JavaScript Rules

- Use Vanilla JavaScript (ES6+)
- Do NOT introduce:
  - React
  - Vue
  - frameworks
  - new dependencies

---

## DOM Handling Rules (High Risk Area)

Files like:
- src/scripts/emailClientAdapter.js

Interact with unstable webmail DOMs.

Always:

- check element existence before use
- avoid brittle selectors
- avoid assumptions about structure
- handle null/undefined safely

Do not write fragile DOM logic.

---

## Code Integration Rules

- Reuse existing logic when possible
- Do not duplicate functionality
- Do not introduce parallel implementations

If similar logic exists → extend it, don’t copy it.

---

## Anti-Patterns (Strictly Forbidden)

Do NOT:

- Add new UI elements without explicit instruction
- Introduce conditional-heavy logic instead of following patterns
- Hardcode values that should be derived
- Add “temporary fixes” without clear reasoning
- Submit code that only “looks correct”

---

## Validation Rules

Before finalizing:

- No runtime errors
- No undefined variables
- No broken flows
- Existing functionality remains intact

---

## Output / Patch Behavior

When generating changes:

- Clearly state:
  - what changed
  - why it changed
  - where the change applies

Do NOT:

- give generic summaries
- omit reasoning
- describe only file names

---

## PR Behavior

- Link changes to a specific requirement or issue
- Do not generate PRs for:
  - speculative improvements
  - unrequested features

---

## Safety Constraints

If a change:

- affects multiple modules  
- modifies shared logic  
- alters execution flow  

Then:

- minimize scope  
- avoid cascading edits  
- do not refactor  

---

## Performance Awareness

- Avoid unnecessary DOM queries
- Avoid repeated listeners
- Avoid redundant computations

---

## Summary for Agent

You are a constrained system.

Your priorities:

1. Correctness  
2. Minimal changes  
3. Stability  
4. Maintainability  

Not:
- creativity  
- feature expansion  
- code rewriting  