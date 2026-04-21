---
title: Notification System — Real-time Alerts
company: tnt_lab
role: Frontend Developer
dates: Aug 2023 – Dec 2023
type: product
tags: [product, system-design, architecture, performance, state-management, api-integration, end-to-end, reactjs, typescript, user-metrics]
stack: [ReactJS, TypeScript, TailwindCSS]
team_size: "1 PM, 1 BE, 2 FE"
---

## Description
Real-time notification module for the TNT Lab project management platform, delivering in-app alerts for task assignments, deadlines, and team mentions across 50+ enterprise client workspaces.

## Achievements
- Architected the frontend WebSocket integration layer — designed a reconnection strategy with exponential back-off and connection state management, enabling the system to handle 3,000+ concurrent connections at peak without visible disruption to end users.
- Implemented a read/unread state engine using optimistic UI updates — reduced perceived latency for notification interactions from ~800ms (round-trip) to under 50ms, improving responsiveness across all client workspaces.
- Delivered the full notification centre component end-to-end — from schema review with the backend team through to production release — in 18 weeks across a 3-person team with zero post-launch P1 bugs.

## Valued Inputs
- Proposed WebSocket over polling after benchmarking both options — estimated 60% reduction in server load, adopted by the team.
- Authored a WebSocket reconnection runbook documenting failure modes and recovery paths — referenced by the backend team during a subsequent infrastructure incident.
- Initiated a schema alignment meeting with the backend developer before implementation began, catching a field-naming inconsistency that would have required a breaking API change mid-sprint.
