# Task Completion Guidelines

## After Completing Any Task

### 1. Code Quality Checks
- **TypeScript**: Run `npm run build` to check for type errors
- **Build Verification**: Ensure the application builds successfully
- **Functionality Test**: Manually test the feature in development mode

### 2. Required Commands to Run
```bash
# Build the project to check for TypeScript errors
npm run build

# Start development server to test functionality
npm run dev
```

### 3. Code Review Checklist
- [ ] TypeScript compilation passes without errors
- [ ] Application builds successfully
- [ ] New features work as expected in browser
- [ ] No console errors in development mode
- [ ] Code follows established conventions
- [ ] Japanese UI text is correct and consistent
- [ ] Responsive layout works on different screen sizes

### 4. Browser Testing
- Test new functionality in Chrome/Safari (macOS default browsers)
- Verify kanban board interactions work correctly
- Check modal functionality
- Verify calendar embeds display properly
- Test status updates and employee management

### 5. Special Considerations
- **Japanese Language**: Ensure all UI text remains in Japanese
- **Calendar Integration**: Verify Google Calendar embeds work with provided URLs
- **State Management**: Test that employee state updates persist correctly
- **Theming**: Verify brand colors and styling are consistent

### 6. No Additional Tools Required
- This project does not use ESLint, Prettier, or testing frameworks
- Manual testing in the browser is sufficient
- TypeScript compiler provides the main code quality checks

### 7. Documentation Updates
- Update README.md if adding new setup steps
- Update inline comments for complex functionality
- Add JSDoc comments for new utility functions if created

### 8. Git Workflow (if committing changes)
```bash
# Build project to ensure no errors
npm run build

# Check git status
git status

# Add changes
git add .

# Commit with descriptive message
git commit -m "feat: description of changes"

# Push changes
git push origin main
```