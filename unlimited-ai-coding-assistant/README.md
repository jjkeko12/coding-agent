# CodeCraft AI - Unlimited AI Coding Assistant

A powerful AI coding assistant available as both a web app and native macOS desktop application. Generate code, explore folders, and solve programming challenges with no limits.

![CodeCraft AI](./public/icon.png)

## Features

### 🤖 AI Code Generation
- Generate React components with TypeScript
- Create Next.js API routes
- Build database schemas and queries
- Define TypeScript types and interfaces
- Create styled components with Tailwind CSS
- Generate utility functions

### 📁 File & Folder Exploration
- Navigate directory structures
- Find specific files
- Create project folder structures
- Visual file tree explorer
- Search files and folders

### 💬 Conversation History
- Full conversation management
- Create multiple chat sessions
- Persistent storage in PostgreSQL
- Switch between conversations easily

### 🎨 Beautiful UI
- Dark/Light mode support
- macOS-native window controls (desktop app)
- Smooth animations
- Responsive design
- Tailwind CSS styling

## Quick Start

### Web Version

1. **Clone and install**
```bash
git clone <your-repo-url>
cd codecraft-ai
npm install
```

2. **Set up environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Run database migrations**
```bash
npx drizzle-kit push
```

4. **Start the server**
```bash
npm run dev
```

5. **Open** http://localhost:3000

### macOS Desktop App

See [MACOS_BUILD_GUIDE.md](./MACOS_BUILD_GUIDE.md) for detailed instructions.

**Quick build:**
```bash
npm install
npm run electron:build:mac:dmg
```

The app will be in the `dist/` folder.

## Development

### Web Development
```bash
npm run dev
```

### Desktop App Development
```bash
npm run electron:dev
```

This runs the Electron app with hot reloading.

## Building

### Web App
```bash
npm run build
npm start
```

### macOS App

```bash
# Build DMG installer
npm run electron:build:mac:dmg

# Build ZIP archive
npm run electron:build:mac:zip

# Build all formats
npm run electron:build:mac
```

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend**: PostgreSQL with Drizzle ORM
- **Desktop**: Electron 44
- **Icons**: Lucide React
- **Build**: electron-builder

## Database Schema

The app uses PostgreSQL with the following tables:
- `conversations` - Chat sessions
- `messages` - Individual messages
- `folders` - File/folder structure
- `codeSnippets` - Generated code
- `userPreferences` - User settings

## Usage Examples

### Generate a React Component
```
Create a React component for a todo list with add, delete, and toggle complete functionality
```

### Create an API Route
```
Generate a Next.js API route for user authentication with JWT
```

### Explore Folder Structure
```
Create a folder structure for a Next.js e-commerce project
```

### Define TypeScript Types
```
Define TypeScript types for a blog CMS with posts, authors, and categories
```

## Configuration

### Environment Variables
```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
```

### Electron Configuration
Edit `electron-builder.yml` to customize:
- App ID and product name
- Icon
- Build targets (dmg, zip)
- Publishing settings

## Keyboard Shortcuts

**Web Version:**
- `Enter` - Send message
- `Shift + Enter` - New line

**Desktop App:**
- `Cmd + R` - Reload window
- `Cmd + W` - Close window
- `Cmd + Q` - Quit app
- `Cmd + F` - Toggle fullscreen

## Troubleshooting

### Web Version

**Database connection errors:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists

**Build errors:**
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Desktop App

**App won't open on macOS:**
```bash
xattr -cr /Applications/CodeCraft\ AI.app
```

**Build fails:**
```bash
npm install
npm run postinstall
npm run electron:build:mac
```

See [MACOS_BUILD_GUIDE.md](./MACOS_BUILD_GUIDE.md) for more troubleshooting.

## Project Structure

```
codecraft-ai/
├── electron/                 # Electron source files
│   ├── electron-main.ts     # Main process
│   ├── preload.ts           # Preload script
│   └── tsconfig.json        # TypeScript config
├── src/                     # Next.js source files
│   ├── app/                 # App router pages & API routes
│   │   ├── api/             # API endpoints
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main page
│   └── db/                  # Database configuration
│       ├── index.ts         # Database client
│       └── schema.ts        # Drizzle schema
├── build/                   # Build resources
│   └── entitlements.mac.plist
├── public/                  # Static assets
│   └── icon.png
├── electron-builder.yml     # Electron builder config
├── package.json
├── README.md
└── MACOS_BUILD_GUIDE.md     # macOS build instructions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

MIT License - feel free to use this for personal and commercial projects.

## Support

For issues and questions:
- Open an issue on GitHub
- Check the troubleshooting section
- Review MACOS_BUILD_GUIDE.md for desktop app issues

---

Built with ❤️ using Next.js, Electron, PostgreSQL, and Tailwind CSS

**Web Version**: Fast, responsive, and accessible from any browser

**macOS Desktop App**: Native experience with full system integration
