# Maintainers Guide

This document describes the branching model and release process for maintainers.

## Branching model

### Long-lived branches

| Branch | Purpose |
|--------|---------|
| `master` | Stable. Always releasable. Only receives merges from `canary` immediately before a release. Protected — all changes require a PR. |
| `canary` | Integration. All PRs target here. The working tip of the project. |
| `examples` | Example personal data for reference and testing. Never merged into `master` or `canary`. |
| `personal` | User's own `personal-data/` and `jobs/` commits. Never pushed to the public remote or merged upstream. |

### Short-lived branches

These are created off `canary` and deleted after merging.

| Prefix | Purpose |
|--------|---------|
| `feat/[name]` | New features |
| `fix/[name]` | Bug fixes |
| `docs/[name]` | Documentation-only changes |

### Exploratory and archive branches

| Prefix | Purpose |
|--------|---------|
| `dev/[name]` | Experimental work — proof of concept, spikes. May never merge. |
| `archive/[name]` | Frozen historical snapshots. Never merge back. |

---

## Release process

```
canary ──► master ──► tag ──► gh release
                 └──► rebase long-lived branches on top
```

1. **Open a release PR: `canary → master`**

   ```bash
   gh pr create \
     --base master \
     --head canary \
     --title "chore: release vX.Y.Z — merge canary into master"
   ```

   Then merge it on GitHub (or `gh pr merge --merge`).

   This is an administrative merge, not a code review — no approval needed. Its purpose is to satisfy the branch protection rule and leave a clear merge commit in `master`'s history marking exactly when each release landed. Do not squash it: the merge commit is the record.

   After this step, `master` must reflect exactly the code being released — the release commit lives here, not on `canary`.

   When merging a PR that modifies a skill file, bump `metadata.version` in that skill's frontmatter as part of the merge commit.

2. **Rebase long-lived branches onto `master`**

   Branches like `examples` carry their own commits (e.g. example data) that are never merged into `master`. After each release, rebase them so their custom commits sit on top of the latest `master`:

   ```bash
   git fetch origin
   git checkout examples
   git rebase origin/master
   git push origin examples --force-with-lease
   ```

   Repeat for any other long-lived branch that follows this pattern, including users' `personal` branches (see [Personal branch](#personal-branch) below). The goal: no long-lived branch should lag behind `master` in toolkit code — only its own branch-specific commits should be ahead.

3. **Tag and publish the release**

   ```bash
   gh release create <version> \
     --repo <owner/repo> \
     --title "<version>" \
     --notes "<release notes>" \
     --target master
   ```

4. **Verify**

   - The release tag appears on GitHub pointing to a commit on `master`
   - `master` history includes the merge commit from `canary`
   - Long-lived branches (e.g. `examples`) show no commits behind `master`, only their own commits ahead

---

## Personal branch

Users who clone this repo keep their own data on a long-lived `personal` branch that is **never pushed to the public remote and never merged upstream**.

### Purpose

The `personal` branch carries all commits to `personal-data/` and `jobs/`. Keeping them on a separate branch means:

- The public remote stays free of personal information.
- Toolkit updates on `master` can be pulled in cleanly without touching user data.

### Setup

After cloning, create the branch once:

```bash
git checkout -b personal
```

All `personal-data/` and `jobs/` commits go here. Never push this branch to `origin`.

### Staying current after a release

When a new release lands on `master`, rebase `personal` on top of it:

```bash
git fetch origin
git checkout personal
git rebase origin/master
```

Resolve any conflicts (rare — toolkit files and personal-data files rarely overlap), then continue. Do **not** push `personal` to `origin`.

### What not to push

The following must remain local on the `personal` branch:

- `personal-data/` — raw career facts
- `jobs/` — job-application outputs
- `agents-ref/archetypes.yaml` — user's target role definitions (populated by `setup-archetypes`)

---

## Semantic versioning

| Change type | Version bump |
|-------------|-------------|
| Breaking change (removed command, changed schema) | Major `x.0.0` |
| New feature (new skill, new theme, new flag) | Minor `0.x.0` |
| Bug fix, docs, refactor | Patch `0.0.x` |

Pre-release qualifiers: `v1.1.0-beta.1`, `v1.1.0-rc.1`.

Skill files carry their own `metadata.version` that follows the same rules, tracking the skill's change history independently of the toolkit version. The `metadata.introduced_in` field records the first toolkit release tag that shipped the skill — set it once at introduction and never change it.
