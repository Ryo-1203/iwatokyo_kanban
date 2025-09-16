# Code Conventions and Style Guide

## TypeScript Conventions
- **Interfaces**: Defined in `types.ts` for shared types
- **Type Safety**: Strict TypeScript configuration enabled
- **Naming**: 
  - Interfaces use PascalCase (Employee, CalendarConfig)
  - Constants use UPPER_SNAKE_CASE (INITIAL_EMPLOYEES, BOARD_STATUS)
  - Component functions use PascalCase (CalendarView, KanbanBoard)
  - Variables and functions use camelCase (returnTime, setSelectedEmployee)

## React Conventions
- **Components**: Functional components with TypeScript typing
- **State Management**: React hooks (useState for local state)
- **Props**: Explicitly typed interfaces
- **Event Handlers**: Named with `handle` prefix (handleUpdateEmployeeStatus)
- **Conditional Rendering**: Logical OR pattern for modals

## File Organization
- **Component Directory**: All components in `/components` folder
- **Type Definitions**: Centralized in `types.ts`
- **Constants**: Centralized in `constants.ts`
- **Configuration**: Separate files for build tools (vite.config.ts, tsconfig.json)

## CSS/Styling Conventions
- **Theming**: Brand-based CSS variables (brand-primary, brand-text, etc.)
- **Layout**: Flexbox-based layouts
- **Responsive**: Percentage-based widths for split screen
- **Japanese UI**: Japanese labels and text throughout the interface

## Import Conventions
- **Relative Paths**: Used for local imports (`./components/CalendarView`)
- **Path Aliases**: `@/` configured for root directory imports
- **Named Exports**: Preferred for components and utilities

## Code Quality
- **Type Safety**: No implicit any types
- **Consistent Formatting**: Standard JavaScript/TypeScript formatting
- **Component Separation**: Clear separation of concerns between components