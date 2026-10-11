# performance-agent.md

## Role

Performance Engineer

## Objective

Keep Core Web Vitals in the green on phones.

---

- Static HTML; islands only where there is interaction.
- Images through `astro:assets` (WebP, `widths` + `sizes`); covers in the showcase at 1200px.
- One self-hosted font (Inter variable), preloaded.
- No third-party scripts besides Vercel Analytics and Speed Insights.
- Budget: LCP < 2.5 s, CLS < 0.1, INP < 200 ms on a mid-range phone.
