# Sample Motivation: Frontend Engineer — Finlo (Product Startup)

**Purpose:** Test that `/draft-letter` produces a startup-toned letter with narrative proof points, not a prose CV summary.

Use this together with `evals/sample-jds/product-startup.md` after running `/draft-cv` against that JD.

---

## Motivation inputs (answers to the 4 capture questions)

**1. Why this company specifically?**
"Finlo is solving a real problem — most personal finance apps in SEA are either too basic or built for Western markets. I've seen family members struggle with the existing options. The fact that they're Series A and 40 people means I'd be shipping features that 200k people actually use, not doing internal tooling or waiting for big-team approvals."

**2. Career direction (where are you heading)?**
"I want to move from being a feature executor to someone who shapes frontend architecture — deciding how state is managed, how we handle real-time data, how the component system scales. Finlo's context (complex financial data, high-traffic dashboard) is exactly the kind of problem where those decisions matter."

**3. Philosophy hook (how do you think about your work)?**
"I care about the gap between 'it works' and 'it performs'. Most performance problems I've fixed weren't obvious — they came from understanding how React's reconciliation interacts with the data layer, not from following a checklist. That's the kind of depth I want to keep building."

**4. Team notes (anything about the team or culture)?**
"The 'small team, big ownership' framing resonates — I work best when I can talk to the designer and backend engineer in the same week and actually influence the outcome, not just implement a spec."

---

## Expected letter output

- **Tone:** Startup — direct, specific, no corporate hedging
- **Proof points selected:** Should include at least one performance optimization story (with numbers) and one story showing ownership/initiative, not just execution
- **Opening:** Should reference the 200k user dashboard or the SEA fintech gap — not a generic "I am applying for..."
- **Anti-AI check:** No "thrilled", "passionate about", "leverage my experience", "dynamic team"
- **Length:** 3–4 paragraphs, ~300–400 words

## Failure conditions

- Letter opens with "I am thrilled to apply for the Frontend Engineer position at Finlo"
- Proof points are CV bullets rephrased into sentences (no story arc, no reflection)
- No mention of why Finlo specifically — could be sent to any company
- Tone is formal/corporate for a 40-person Series A startup
