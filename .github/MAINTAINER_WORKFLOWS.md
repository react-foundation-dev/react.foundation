# React Foundation Maintainer Workflows

These workflows define the minimum bar for issue triage and pull request review.
They are intentionally explicit so maintainers can make consistent decisions
without relying on private context.

## Issue Triage Workflow

### Objective

Every issue should be acknowledged, classified, and moved toward either
implementation or clarification.

### Phase 0: Intake

1. Add an `eyes` reaction to acknowledge the report.
2. Classify the issue with exactly one type label:
   - `type:bug`
   - `type:feature`
   - `type:content`
   - `type:ecosystem`
3. Assign one priority label:
   - `priority:P0`: breaks the core experience
   - `priority:P1`: high-impact issue or major user-facing gap
   - `priority:P2`: normal priority
   - `priority:P3`: low priority or nice-to-have
4. Assign the current status:
   - `status:needs-info`
   - `status:ready`
   - `status:blocked`
   - `status:in-progress`
5. Add `good-first-issue` only when the scope is narrow, the expected behavior is
   clear, and the implementation path is safe for a new contributor.

### Phase A: Clear Issues

An issue is clear when the desired behavior, acceptance criteria, and non-goals
can be stated without guessing.

Before implementation starts, write a maintainer comment that includes:

```text
Acceptance Criteria:
- ...

Non-goals:
- ...

Test Plan:
1. Reproduce the current behavior or bug.
2. Add a regression test for the expected behavior.
3. Confirm the test fails before the fix.
4. Implement the smallest change that passes the test.
5. Run the relevant test, lint, typecheck, and build commands.
6. Manually verify UI behavior when applicable.
```

Implementation should happen in a focused branch or worktree:

```bash
git worktree add ../rf-issue-<id> -b fix/issue-<id>
cd ../rf-issue-<id>
```

Use `feature/issue-<id>` for feature work and `docs/issue-<id>` for
documentation-only work.

Implementation rules:

- Write tests first for code behavior.
- Keep the first implementation pass minimal.
- Refactor only after the tests pass.
- Avoid unrelated cleanup or hidden refactors.
- Move the issue to `status:in-progress` once active work begins.

Final validation before PR:

- Relevant tests pass.
- `npm run lint` passes.
- `npx tsc --noEmit` passes.
- `npm run build` passes when the change can affect runtime behavior.
- Manual verification is documented for UI changes.

### Phase B: Unclear Issues

If the issue is unclear, keep `status:needs-info` and ask for the minimum
information needed to define acceptance criteria.

Use this shape:

```text
Thanks for opening this. I want to make sure we fully understand the expected
behavior before implementation.

A few questions:
1. What behavior did you expect?
2. What happened instead?
3. Can you share a minimal reproduction, screenshot, or relevant environment
   details?

Once we have enough detail to write acceptance criteria and a test plan, we can
move this to ready.
```

Do not start implementation until the behavior is unambiguous.

## Pull Request Review Workflow

### Objective

Every PR should be correct, focused, tested, maintainable, and aligned with the
React Foundation codebase.

### Phase 0: Intake

1. Add an `eyes` reaction to acknowledge the PR.
2. Confirm the PR has exactly one primary concern:
   - bugfix
   - feature
   - content
   - ecosystem
   - refactor or cleanup
3. Confirm the PR links to an issue or explains why no issue is needed.
4. Confirm the linked issue carries the relevant `type:*`, `priority:*`, and
   `status:*` labels when applicable.

### Phase 1: Structural Review

Request changes immediately when PR hygiene blocks review:

- The title is vague.
- The description explains only what changed, not why.
- There is no linked issue or context.
- The test plan is missing or generic.
- The diff includes unrelated changes.

Scope requirements:

- One PR should solve one concern.
- Refactors should be explicit, not hidden inside behavior changes.
- Large changes should be split unless the coupling is unavoidable.

### Phase 2: Code Review

Review in this order:

1. Correctness
   - Does the PR solve the stated issue?
   - Are edge cases handled?
   - Could this regress existing behavior?
2. Tests
   - Is the original bug or new behavior covered?
   - Would the test fail without the implementation?
   - Are UI interactions covered when applicable?
3. Architecture
   - Is this the simplest viable solution?
   - Does it follow existing patterns?
   - Does it avoid unnecessary abstraction?
4. Readability
   - Are names clear?
   - Is the control flow easy to follow?
   - Is future maintenance obvious?
5. Performance
   - Does the change avoid unnecessary renders?
   - Does it avoid inefficient queries or repeated work?
   - Is bundle impact reasonable?
6. Product and UX
   - Does the behavior match the expected user experience?
   - Are accessibility states and keyboard paths preserved?
   - Are loading, empty, and error states covered when relevant?

Tests are non-negotiable for code behavior changes. Request changes when a PR
changes behavior without tests and no clear exception is documented.

### Phase 3: Review Decision

Approve only when:

- CI passes.
- Tests cover the behavior.
- The implementation is clean and focused.
- No unresolved review threads remain.
- No debug code, TODOs, or unrelated changes remain.

Request changes when:

- Tests are missing for behavior changes.
- The expected behavior is still ambiguous.
- The implementation is over-engineered.
- The PR includes unrelated scope.
- The PR does not follow existing project patterns.

Approval template:

```text
This looks solid.

- Clear fix
- Tests cover the behavior
- Implementation is focused and follows existing patterns

Approved.
```

Request changes template:

```text
Thanks for the contribution. This is a good direction, but we need a few changes
before merging:

1. Tests
   Add explicit coverage for the bug or behavior this PR changes.
2. Scope
   Separate unrelated changes from this PR.
3. Implementation
   Simplify the approach to match the existing pattern in <area>.

Once these are addressed, we can take another pass.
```

### Phase 4: Merge Readiness

Before merge:

- CI is passing.
- Review threads are resolved.
- The commit history is clean enough for the merge strategy.
- The PR title is suitable for the squash commit.

Prefer squash merge with this commit shape:

```text
Fix: <short description> (#<PR>)
```

Use `Feature:`, `Content:`, `Ecosystem:`, or `Refactor:` when that better
matches the change.
