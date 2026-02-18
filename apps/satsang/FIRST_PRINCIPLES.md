# Satsang: First Principles (Working Draft)

## Primary User + Job
Primary user: a devotee who wants to decide **what they can attend** (or watch) **this week** with minimal effort.

Secondary users:
- Followers of specific speakers/organizations (wants "only what I care about")
- Families planning weekend visits
- Organizers (wants updates reflected accurately)

## Trust + Verification Model
Promise: Satsang is an aggregator, not an authority.
- `Verified`: listing came from an official/curated source configured in the scraper.
- `Source`: where the listing was collected from (YouTube/Website/Instagram/Manual).
- `Stale`: the event date is older than 14 days (heuristic signal, not a guarantee).

Why trust an event:
- Verified + official sources are higher confidence.
- The user should always be able to open the source link to cross-check details.

## Freshness
Current: show **Last scrape** timestamp and local cache timestamp.
No fixed freshness SLA is promised yet; aim is "daily updates when scraper runs".

## Coverage Completeness
Coverage is explicitly shown as "counts by source" from `js/data/scrape_report.json`.
Non-goal: claiming completeness. The UI should make it clear this is "what we currently have", not "everything".

## Location Relevance
Goal: answer "What can I realistically attend?"
Current: "Near me" uses approximate city-level coordinates (when known) and a radius (km).

## Time Clarity
Dates are normalized to YYYY-MM-DD.
Times are currently free text ("as listed at source") and are not converted across timezones.

## Personalization
Users can follow speakers and optionally filter Discover to "Following only".

## Organizer Action Loop
There is no in-app submission/update flow yet.
Today, data accuracy relies on:
- official listings being correct at source
- scraper/manual dataset updates being run and shipped

