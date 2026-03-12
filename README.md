# AI Study Planner for Developers

A React + LocalStorage web app that helps developers plan and maintain consistent coding practice.

## Features

- Add learning goals with:
  - title
  - difficulty
  - target completion date
  - estimated daily study time
- Auto-generate today's schedule using rule-based logic:
  - deadline urgency
  - difficulty weighting
  - remaining workload distribution
  - daily available study time
- Track progress:
  - per-goal percentage
  - completed vs planned minutes
  - completed sessions
- Track streak:
  - current streak
  - longest streak
  - last study date
- Automatic redistribution:
  - if a day is missed, remaining workload is naturally redistributed over fewer days

## Tech

- React
- Vite
- LocalStorage for persistence

## Run

```bash
npm install
npm run dev
```

## Data Stored in LocalStorage

- `ai-study-planner:goals`
- `ai-study-planner:settings`
- `ai-study-planner:sessions`
- `ai-study-planner:streak`
