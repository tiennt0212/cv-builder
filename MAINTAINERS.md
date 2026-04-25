# Maintainers Guide

This document describes the branching model and release process for maintainers.

## Branching model

### Long-lived branches

| Branch | Purpose |
|--------|---------|
| `master` | Stable. Always releasable. Only receives merges from `canary` immediately before a release. |
| `canary` | Integration. All PRs target here. The working tip of the project. |
| `examples` | Example personal data for reference and testing. Never merged into `master` or `canary`. |

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

1. **Merge `canary` into `master`**

   ```bash
   git checkout master
   git merge canary
   git push origin master
   ```

   After this step, `master` must reflect exactly the code being released — the release commit lives here, not on `canary`.

2. **Rebase long-lived branches onto `master`**

   Branches like `examples` carry their own commits (e.g. example data) that are never merged into `master`. After each release, rebase them so their custom commits sit on top of the latest `master`:

   ```bash
   git checkout examples
   git rebase master
   git push origin examples --force-with-lease
   ```

   Repeat for any other long-lived branch that follows this pattern. The goal: no long-lived branch should lag behind `master` in toolkit code — only its own branch-specific commits should be ahead.

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

## Semantic versioning

| Change type | Version bump |
|-------------|-------------|
| Breaking change (removed command, changed schema) | Major `x.0.0` |
| New feature (new skill, new theme, new flag) | Minor `0.x.0` |
| Bug fix, docs, refactor | Patch `0.0.x` |

Pre-release qualifiers: `v1.1.0-beta.1`, `v1.1.0-rc.1`.
