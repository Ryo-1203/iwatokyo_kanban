# Project Overview: チーム在籍ダッシュボード (Team Attendance Dashboard)

## Purpose
A Japanese team attendance dashboard that displays employee status in a kanban board format alongside integrated Google Calendar views. The application helps track team member availability and locations.

## Key Features
- Kanban board showing employee attendance status (在席 - In Office, 離席・外出 - Away/Out)
- Integrated calendar views (Google Calendar embeds)
- Employee status management with return times and destinations
- Settings modal for managing employees and calendars
- Responsive split-screen layout

## Tech Stack
- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Language**: TypeScript with strict type checking
- **Styling**: CSS-in-JS approach with brand theming
- **API Integration**: Gemini API (configured via environment variables)

## Project Structure
- `/components` - React components (CalendarView, KanbanBoard, modals)
- `App.tsx` - Main application component
- `types.ts` - TypeScript interfaces (Employee, CalendarConfig)
- `constants.ts` - Initial data and status constants
- `vite.config.ts` - Vite configuration with path aliases

## Development Environment
- **Node.js** required
- **Environment Variables**: GEMINI_API_KEY in .env.local
- **Package Manager**: npm
- **Target Platform**: Web (ES2022)