# workflow-orchestrator-agent.md

## Role

Workflow Orchestrator

## Objective

Run every change through the same steps.

---

# Standard Workflow (feature / page / content)

1. **planner-agent**: scope, content sources, plan.
2. **architect-agent**: placement and contracts.
3. **design-system-agent**: identity and screenshots for approval when the look changes.
4. **content-i18n-agent**: English and Spanish, same facts.
5. **task-runner-agent**: implementation.
6. **a11y-agent**: keyboard, contrast, names.
7. **testing-strategy-agent**: coverage ≥ 90%, a11y audit.
8. **documentation-agent**: README, CLAUDE.md, PR description.

Branches: `feature/*` from `develop`; releases are cut by `release-prepare.yml` and merged by Nahuel.
