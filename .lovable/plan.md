# Dashboard Polish + Tutor E-Commerce Section

## Current State

The dashboard has: WelcomeCard (gradient hero), DashboardStats (3 stat cards), Today's Classes, Quick Actions, and All Classes Summary. The Tutors page exists separately at `/tutors` with full filtering. The goal is a Teams-like clean layout with an embedded "Find Tutors" marketplace section directly on the dashboard.

## Plan

### 1. Animated Stats Cards (`DashboardStats.tsx`)

- Add staggered `animate-fade-in` with increasing delays per card
- Add a counting animation effect (number ticks up from 0 to final value on mount)
- Add subtle gradient left-border accent per card for visual pop

### 2. Recent Activity Feed (new `RecentActivity.tsx`)

- A simple card showing recent events: "You enrolled in...", "Class started...", "New resource uploaded..."
- For now, derive activity from enrollments and classes data (no new DB table needed)
- Clean list with icons, timestamps using `date-fns` `formatDistanceToNow`
- Limit to 5 items, Teams-style compact list

### 3. "Find Tutors" E-Commerce Section on Dashboard

- New component `DashboardTutorMarketplace.tsx` embedded in Dashboard
- Horizontal scrollable row of tutor class cards (compact version of TutorCard)
- Each card shows: tutor avatar, name, subject, price badge, rating placeholder, "View" button
- "See All Tutors" link at top-right navigates to `/tutors`
- Only shown to **students** (tutors see a "Your Performance" or similar section instead)
- &nbsp;

### 4. Dashboard Layout Restructure (`Dashboard.tsx`)

New layout order:

1. WelcomeCard (existing)
2. Stats row with animations (existing, enhanced)
3. Two-column grid: Today's Classes + Quick Actions (existing)
4. students only)
5. Recent Activity feed (new)
6. All Classes summary (existing)

### Files to Create

- &nbsp;
- `src/components/dashboard/RecentActivity.tsx` — activity feed component

### Files to Modify

- `src/components/dashboard/DashboardStats.tsx` — add fade-in animation + counting effect
- `src/pages/Dashboard.tsx` — integrate new sections, reorder layout

### Technical Details

- Counting animation: `useEffect` with `requestAnimationFrame` loop over ~500ms
- Tutor marketplace fetches from `classes` table with tutor join, limited to 6 items
- Activity feed derives from enrollments data already fetched in Dashboard
- No new dependencies needed; uses existing UI components (Card, Badge, Avatar, Button, ScrollArea)
- No backend changes required