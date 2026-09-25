# Getting Started with CodeCraft AI

Welcome to CodeCraft AI! This guide will help you get up and running quickly.

## What is CodeCraft AI?

CodeCraft AI is an unlimited AI coding assistant that helps you:
- Generate code for any programming task
- Explore and manage file/folder structures
- Create React components, API routes, database schemas, and more
- Maintain conversation history for all your coding sessions

Available as both a **web app** and **macOS desktop application**.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **PostgreSQL** database ([Download](https://postgresql.org/download/))
- **Git** (for cloning the repository)

### Verify Installation

```bash
node --version  # Should be 18+
npm --version   # Should be 9+
psql --version  # Should show PostgreSQL version
```

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd codecraft-ai
```

### 2. Install Dependencies

```bash
npm install
```

This may take a few minutes.

### 3. Set Up Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
```

### 4. Set Up Database

Create the database:

```bash
createdb app_db
```

Or with PostgreSQL user:

```bash
psql -U postgres -c "CREATE DATABASE app_db;"
```

Run migrations:

```bash
npx drizzle-kit push
```

## Running the App

### Option 1: Web Version (Recommended for Quick Start)

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to http://localhost:3000

3. **Start coding!**
   - Click "New Chat" to start a conversation
   - Type your coding request
   - Get instant code generation

### Option 2: macOS Desktop App

#### Development Mode

```bash
npm run electron:dev
```

Or use the script:

```bash
./scripts/dev-electron.sh
```

#### Production Build

```bash
npm run electron:build:mac:dmg
```

Or use the script:

```bash
./scripts/build-macos.sh
```

The built app will be in the `dist/` folder.

## First Steps

### 1. Create a New Conversation

Click the **"New Chat"** button in the sidebar.

### 2. Try a Sample Request

Type one of these in the chat:

- "Create a React component"
- "Generate an API route"
- "Explore folder structure"
- "Define TypeScript types"

### 3. Explore the File Explorer

- Click the **"+"** button in the Explorer panel
- Create a sample project structure
- Navigate folders and files

### 4. Customize Your Experience

- Toggle **Dark/Light mode** using the sun/moon icon
- **Search** for files in the Explorer
- **Delete** conversations you no longer need

## Common Tasks

### Generate a React Component

```
Create a React component for a user profile with avatar, name, and bio
```

### Create an API Route

```
Generate a Next.js API route for creating and listing todos
```

### Build Database Operations

```
Create database operations for a blog with posts and comments
```

### Define TypeScript Types

```
Define TypeScript types for an e-commerce store with products, orders, and customers
```

### Explore Folder Structure

```
Create a folder structure for a Next.js SaaS application
```

## Tips & Tricks

### Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in message
- **Cmd + R**: Reload (desktop app)
- **Cmd + F**: Toggle fullscreen (desktop app)

### Best Practices

1. **Be specific** in your requests for better code generation
2. **Use conversation history** to build on previous code
3. **Create separate conversations** for different projects
4. **Save useful code snippets** in your project

### Customization

- Edit `src/app/page.tsx` to customize the UI
- Modify `src/app/api/chat/route.ts` to change AI responses
- Update `electron-builder.yml` for app configuration

## Troubleshooting

### "Database connection error"

1. Check if PostgreSQL is running:
   ```bash
   brew services list | grep postgresql
   ```

2. Verify DATABASE_URL in `.env`

3. Ensure database exists:
   ```bash
   psql -U postgres -l | grep app_db
   ```

### "Module not found" errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Desktop app won't open (macOS)

```bash
xattr -cr /Applications/CodeCraft\ AI.app
```

### Build fails

```bash
rm -rf .next dist dist-electron
npm run build
```

## Next Steps

- Read the full [README.md](./README.md)
- Check [MACOS_BUILD_GUIDE.md](./MACOS_BUILD_GUIDE.md) for desktop app details
- Explore the source code in `src/` and `electron/`
- Contribute to the project!

## Need Help?

- Check the [Troubleshooting](#troubleshooting) section
- Review the documentation files
- Open an issue on GitHub

---

Happy coding with CodeCraft AI! 🚀
