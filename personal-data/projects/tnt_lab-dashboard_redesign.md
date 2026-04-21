---
title: Dashboard Redesign — Analytics Module
company: tnt_lab
role: Frontend Developer
dates: Jan 2024 – Jun 2024
type: product
tags: [product, architecture, performance, data-visualization, reactjs, typescript, end-to-end]
stack: [ReactJS, TypeScript, Recharts, TailwindCSS]
---

## Description
Analytics dashboard redesign for the TNT Lab project management platform, replacing an older class-component implementation with a modern React hooks architecture. Focused on performance and scalability for growing customer base.

## Achievements
- Migrated analytics dashboard from class components to React hooks and functional components — reduced load time from 4.2s to 1.1s (73% improvement) by eliminating unnecessary re-renders and optimising data flow.
- Implemented a shared visualization component library reused across 6 different dashboard views — reduced per-page development time by 40% and improved consistency across reporting surfaces.
- Established Lighthouse CI baseline and automated performance monitoring in CI/CD pipeline — preventing future regressions and keeping page metrics within strict budget.

## Valued Inputs
- Proposed chunking the data fetching strategy to load critical metrics first, deferring secondary visualizations — improved perceived performance and reduced initial page interactivity time by 50%.
- Initiated a cross-squad component library initiative, demonstrating ROI with the dashboard project — adopted by two other feature squads within one quarter.
- Documented the hook-based patterns and optimization techniques in an internal wiki — used as reference material for onboarding new frontend engineers.
