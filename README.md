# MixxFit

MixxFit is a fitness tracking web application built with Angular 21. The goal is to keep it as
simple as possible for the user while still covering what someone who actually trains needs —
workouts, progress, and body metrics in one place, without the clutter.

Landing page: **[getmixxfit.com](https://getmixxfit.com)**.

Live app **[app.getmixxfit.com](https://app.getmixxfit.com)**.

## Features

**Workouts**
- Create, view and delete workouts
- Exercise catalog with a built-in library plus your own custom exercises
- Reusable workout templates — build a session once, start from it next time
- Weightlifting, bodyweight, cardio and stretching entries with sets, reps and weight

**Weight tracking**
- Log entries and follow them on a progress chart
- Set a target weight and track the gap
- Filter entries by period

**Dashboard**
- Workout streak and recent sessions at a glance
- Workout and weight charts
- TDEE calculator (BMR, maintenance, cut and bulk targets) that sets your daily calorie goal

**Account**
- Registration and login with JWT access tokens and refresh token rotation
- Password reset over email
- Profile page with personal info, body metrics and password change

## Planned

- Nutrition tracking page. A food diary on top of the existing calorie goal
- Sleep tracking page
- Trainer and client accounts, so a coach can follow their clients' progress

## Tech stack

- Angular 21 with standalone components and signals
- TypeScript
- Tailwind CSS 4.1 and Angular Material
- TanStack Query for server state
- ApexCharts for charts

## The rest of the platform

| Repo | What it is |
|---|---|
| [mixxfit-api](https://github.com/Miks02/mixxfit-api) | .NET 10 Web API on PostgreSQL, built in vertical slice architecture |
| [mixxfit-admin](https://github.com/Miks02/mixxfit-admin) | WinForms desktop client for administration, platform statistics and user moderation |

The API base URL lives in `src/environments/environment.development.ts` and points at
`https://localhost:7250/api` by default.

## Status

Work in progress. Expect new pages and improvements over time.

## Screenshots

<img width="1915" alt="MixxFit1" src="https://github.com/user-attachments/assets/64b724d6-806a-4973-8f90-97a0470b27c9" />

<img width="1915" alt="MixxFit2" src="https://github.com/user-attachments/assets/4efebb38-a1e2-409c-b9b1-bb67d4814831" />
