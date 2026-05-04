# Contributing to React Foundation

Thanks for contributing to the React Foundation website.

We operate with a **high bar for clarity, correctness, and maintainability**. This document outlines how to contribute effectively.

---

## Guiding Principles

- **Clarity over cleverness**
- **Tests before implementation**
- **Small, focused changes**
- **Explicit over implicit behavior**

---

## Getting Started

```bash
git clone https://github.com/react-foundation-dev/react.foundation.git
cd react.foundation
npm install
npm run dev
```

Before opening a PR, run the relevant checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

---

## Workflow

### 1. Pick or Create an Issue

- Check existing issues first
- If creating a new one, use the issue template

### 2. Branching

```bash
git checkout -b fix/<issue-id>-short-description
```

Use `feature/<issue-id>-short-description` for feature work and `docs/<issue-id>-short-description` for documentation-only changes.

### 3. Test-First Development (Required)

Before writing code:

1. Write tests that reproduce the issue
2. Ensure tests fail
3. Implement the fix incrementally
4. Ensure all tests pass

### 4. Code Standards

- Follow existing patterns
- Avoid unnecessary abstractions
- Keep functions small and readable
- Prefer explicit naming

### 5. Commit Messages

Use clear, structured messages:

```text
Fix: resolve map popup navigation bug (#47)
```

### 6. Pull Request Requirements

Every PR must:

- Link to an issue
- Include a clear summary
- Include a test plan
- Add or update tests
- Pass CI

---

## Review Process

PRs are evaluated on:

- Correctness
- Test coverage
- Simplicity
- Maintainability

We may request changes even for working code if it does not meet standards.

---

## Labels

We use structured labels:

- `type:bug`
- `type:feature`
- `type:content`
- `type:ecosystem`
- `priority:P0`-`priority:P3`
- `status:*`

---

## Code of Conduct

Be respectful, constructive, and professional. Harassment or toxic behavior will not be tolerated.

---

## Questions?

Open an issue with the `status:needs-info` label.
