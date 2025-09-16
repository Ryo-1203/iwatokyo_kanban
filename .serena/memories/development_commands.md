# Development Commands

## Package Scripts
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup
1. Create `.env.local` file in project root
2. Add `GEMINI_API_KEY=your_api_key_here` to the file
3. Ensure Node.js is installed (prerequisite)

## Development Workflow
1. `npm install` - Install dependencies when first setting up
2. `npm run dev` - Start development server for local development
3. Make code changes
4. Test changes in browser (auto-reloads)
5. `npm run build` - Create production build when ready
6. `npm run preview` - Test production build locally

## Git Commands (Darwin/macOS)
```bash
# Initialize repository (if needed)
git init

# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "commit message"

# Push to remote
git push origin main

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes
git pull origin main
```

## File System Commands (Darwin/macOS)
```bash
# List files
ls -la

# Show current directory
pwd

# Change directory
cd /path/to/directory

# Find files
find . -name "*.tsx"

# Search in files
grep -r "search_term" .

# Create directory
mkdir new_directory

# Remove file
rm file_name

# Remove directory
rm -rf directory_name
```

## TypeScript Commands
```bash
# Type checking (built into Vite)
npm run build  # Includes type checking

# TypeScript compiler (if needed)
npx tsc --noEmit
```

## Vite Commands
```bash
# Development server with custom host/port
npm run dev -- --host 0.0.0.0 --port 3000

# Build with custom mode
npm run build -- --mode production
```