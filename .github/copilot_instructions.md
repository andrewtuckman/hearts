# GitHub Copilot / Assistant instructions

These are project-specific preferences to help GitHub Copilot (and other AI assistants) write code that fits this repository's conventions.

General
- Be concise and explicit. Make minimal, focused changes.
- Don't modify unrelated files or refactor code unless requested.

Code style
- Follow existing project style (TypeScript, React conventions). Keep changes consistent with surrounding code.
- Prefer clear, descriptive variable and function names.

Docstrings and comments (IMPORTANT)
- Always include docstrings for functions, classes, and methods that are non-trivial or exported.
- Docstrings must explicitly list parameters and return values. For JavaScript/TypeScript use JSDoc-style tags (`@param`, `@returns`) with types when appropriate. For Python use the project's preferred style but include params and returns sections.
  - Example (TypeScript / JSDoc):
    /**
     * Computes the total score for a hand.
     * @param {Hand} hand - The hand to score.
     * @returns {number} The total score for the hand.
     */

Testing and safety
- When changing logic, include or update tests where reasonable.
- Avoid introducing security or performance regressions. If performance is relevant, comment trade-offs.

Commits and diffs
- Keep diffs small and focused. Prefer a single logical change per commit.

If unsure
- Ask a clarifying question instead of guessing the intended behavior.

Thank you — these guidelines help keep contributions readable and maintainable.
