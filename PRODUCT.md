# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite + TypeScript + Tailwind CSS + shadcn/ui (decided 2026-09-13, user-approved).
Mock layer: MSW. Charts: Recharts. Forms: react-hook-form + zod. i18n: react-i18next (vi/en).
Note: current phase produces a static HTML design artifact for visual approval before the React build.

## Users

Four web roles (one app, role-guarded routes):
1. **Parish Christmas Committee** — creates the preparation season, assigns work-area leaders & material officers, monitors progress/shortages/donations, approves major purchases, coordinates cross-community support, views readiness checklists, exports final reports.
2. **Work Area Leader** — manages one work area (grotto, tree, lighting, church yard, stage): breaks down tasks, defines skills/estimates/materials, assigns volunteers, approves support registrations and task completion, reviews progress photos, requests parish-wide support, completes readiness checklists.
3. **Material & Contribution Officer** — prepares material lists with quantity tracking (required/existing/to-purchase/donated/received/shortage), creates purchase requests, assigns buyer volunteers, records purchases with receipt photos, tracks donations (full/partial/unusable/canceled), manages borrowed items, allocates materials.
4. **System Administrator** — accounts, roles/permissions, parish/community/category configuration, recognition point rules, notifications, activity history, lock/unlock, export/backup.

A Volunteer mobile app is in the project but **out of scope** for this web build (phase 2 / other team). The web side covers the approval/confirmation ends of volunteer actions.

Real users are Vietnamese parish members of mixed ages and digital literacy (docx NFR: "simple and understandable for users of different age groups"). UI language: Vietnamese (i18n with English fallback).

## Product Purpose

Coordinate Christmas preparation works (grotto construction, tree setup, lighting, church yard, stage) that are today managed through chat groups, verbal announcements, and manual spreadsheets. Success = every parishioner can see what is missing, who is buying it, what has been pledged and received, and which areas are behind schedule; plus transparent final reports on expenses, working hours, completed tasks, and contributor recognition.

## Positioning

Parish-level coordination of materials, volunteers, working hours, and cross-community support in one shared system — replacing informal chat-group coordination that loses track of shortages and pledges.

## Operating Context

- Season-based usage: activity peaks Sep–Dec before Christmas; final reports after.
- Works involve materials, purchases, donated items, borrowed items (with return dates), skilled volunteers (electrical, carpentry, welding, decoration, transport, logistics, painting), check-in/check-out working hours, safety/readiness checklists before celebrations.
- Cross-community: one community lacking skills/materials can be supported by another.

## Capabilities and Constraints

Confirmed (from docx functional requirements, all mapped to ~43 screens across the 4 role sections):
- Season creation & closing; work-area management (5 area types, parish- and community-level)
- Task breakdown with required skills, estimated time, volunteer count, related materials
- Volunteer assignment, cross-area registration approval, task completion approval with revision requests
- Material quantity ledger; purchase requests (major ones need committee approval); purchase records (quantity, cost, supplier, date, receipt photos); buyer assignment
- Donation records with 4 confirmation states; borrowed-item tracking with return dates and condition
- Material allocation to tasks/areas
- Urgent support requests and cross-community coordination
- Readiness checklists pre-celebration
- Reports: expenses, donated materials, working hours, completed tasks, contributor recognition (points), CSV export
- Admin: accounts, roles, config of parishes/communities/categories/contribution types/recognition rules/notifications, audit log, lock/unlock, export/backup

Non-functional: dashboards/material summaries load within 3s; simple UI for low-digital-literacy users; documents linked to correct task/material/purchase; configurable categories.

## Brand Commitments

Name: **GrottoWorks**. No logo/brand assets yet (to be created). Domain: parish Christmas — warm, communal, trustworthy; not corporate-cold.
**Chosen visual direction (user-locked 2026-09-13): "Hang Đá & Rơm" (grotto & straw).** Straw-cream ground #EFE4CC, panel #FBF6E9, dark-brown ink #3E2F23, terracotta sidebar/primary #B96A3B, moss-green progress #6B7D45, straw-gold warning #C9972F, brick-red alert #9C3D2E; area cards use grotto-arch top radii; status tags = glyph + color. Motion: stagger entrance, count-up stats, animated progress bars, reduced-motion respected.

## Evidence on Hand

- Capstone project register docx (FA26SE067) with full context and functional requirements — the product source of truth.
- No real data, photos, or testimonials yet — mock data must be plausible Vietnamese parish data, clearly non-production.

## Product Principles

1. **Danh mục rõ ràng hơn dòng chat** — every screen answers "còn thiếu gì, ai làm gì, đến đâu rồi" at a glance.
2. **Usability cho mọi độ tuổi** — large touch targets, plain Vietnamese labels, no hidden gestures; complexity lives in data, not in the interface.
3. **Minh bạch tới đồng cuối cùng / giờ cuối cùng** — quantities, costs, and hours are always traceable to their source records.
4. **Một mùa, một sự thật** — the current season is the spine; historical seasons stay queryable for reports.

## Accessibility & Inclusion

Mixed-age, low-digital-literacy audience (docx NFR): WCAG-minded contrast, readable base font size, keyboard navigable tables/forms.
