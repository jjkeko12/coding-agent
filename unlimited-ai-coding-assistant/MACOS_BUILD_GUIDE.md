# Building CodeCraft AI for macOS

This guide will help you build CodeCraft AI as a native macOS application using Electron.

## Prerequisites

Before building the macOS app, ensure you have:

1. **Node.js 18+** installed
2. **npm** or **yarn** package manager
3. **PostgreSQL** database running locally
4. **macOS** operating system (for building the native app)
5. **Xcode Command Line Tools** installed:
   ```bash
   xcode-select --install
   ```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
```

### 3. Set Up Database

Run the database migrations:

```bash
npx drizzle-kit push
```

### 4. Build the Application

```bash
npm run build
```

### 5. Compile Electron Files

```bash
cd electron
npx tsc -p tsconfig.json
cd ..
```

### 6. Build macOS App

#### Build DMG Installer (Recommended)

```bash
npm run electron:build:mac:dmg
```

This creates a `.dmg` file in the `dist/` directory that users can install.

#### Build ZIP Archive

```bash
npm run electron:build:mac:zip
```

This creates a portable `.zip` file in the `dist/` directory.

#### Build All Formats

```bash
npm run electron:build:mac
```

This builds both DMG and ZIP formats.

## Development Mode

To run the Electron app in development mode:

```bash
npm run electron:dev
```

This will:
1. Start the Next.js development server on port 3000
2. Wait for the server to be ready
3. Compile the Electron TypeScript files
4. Launch the Electron window with hot reloading

## Installation

### From DMG

1. Navigate to the `dist/` folder
2. Double-click `CodeCraft AI-x.x.x.dmg`
3. Drag the CodeCraft AI icon to the Applications folder
4. Eject the DMG
5. Open CodeCraft AI from Applications

### From ZIP

1. Navigate to the `dist/` folder
2. Extract `CodeCraft AI-x.x.x.zip`
3. Drag the extracted app to Applications
4. Open from Applications

### First Launch Security Warning

On first launch, macOS may show a security warning. To resolve:

1. Go to **System Preferences** > **Security & Privacy**
2. Click **Open Anyway** under the General tab
3. Or run in terminal:
   ```bash
   xattr -cr /Applications/CodeCraft\ AI.app
   ```

## App Permissions

The app requests the following permissions:

- **Camera**: For visual coding assistance features
- **Microphone**: For voice command features
- **Documents Folder**: For file management
- **Downloads Folder**: For file management

Grant these permissions when prompted for full functionality.

## Troubleshooting

### Build Fails with "electron-builder not found"

```bash
npm install
npm run postinstall
```

### App Won't Open (Quarantine Issue)

```bash
xattr -cr /path/to/CodeCraft\ AI.app
```

### Database Connection Errors

- Ensure PostgreSQL is running: `brew services list | grep postgresql`
- Check DATABASE_URL in `.env`
- Verify database exists: `psql -U postgres -l`

### TypeScript Errors in Electron

```bash
cd electron
npx tsc --noEmit
```

### Missing Dependencies in Built App

Check that all dependencies are listed in `package.json` and included in `electron-builder.yml`.

## Configuration

### App Metadata

Edit `electron-builder.yml` to customize:

```yaml
appId: com.codecraft.ai          # Unique app identifier
productName: CodeCraft AI        # Display name
```

### Icon

Replace `public/icon.png` with your own icon (512x512 or 1024x1024 PNG recommended).

### Entitlements

Edit `build/entitlements.mac.plist` to modify app permissions.

## Keyboard Shortcuts

Once the app is running:

- `Cmd + R` - Reload window
- `Cmd + Shift + I` - Open DevTools (development only)
- `Cmd + W` - Close window
- `Cmd + Q` - Quit app
- `Cmd + F` - Toggle fullscreen
- `Cmd + [/-]` - Zoom out
- `Cmd + ]/+` - Zoom in
- `Cmd + 0` - Reset zoom

## File Structure

```
codecraft-ai/
├── electron/                 # Electron source files
│   ├── electron-main.ts     # Main process
│   ├── preload.ts           # Preload script
│   └── tsconfig.json        # TypeScript config
├── src/                     # Next.js source files
│   ├── app/                 # App router pages
│   ├── db/                  # Database schema
│   └── ...
├── build/                   # Build resources
│   └── entitlements.mac.plist
├── public/                  # Static assets
│   └── icon.png
├── dist/                    # Built app output
├── dist-electron/          # Compiled Electron files
├── out/                     # Next.js build output
├── electron-builder.yml     # Electron builder config
├── package.json
└── README.md
```

## Publishing

To publish to GitHub Releases:

1. Update `electron-builder.yml`:
   ```yaml
   publish:
     - provider: github
       owner: your-username
       repo: codecraft-ai
   ```

2. Set GitHub token:
   ```bash
   export GH_TOKEN=your_github_token
   ```

3. Build and publish:
   ```bash
   npm run electron:build:mac -- --publish always
   ```

## Updates

For automatic updates, consider integrating `electron-updater`:

```bash
npm install electron-updater --save
```

Then configure in `electron-main.ts`:

```typescript
import { autoUpdater } from 'electron-updater';

autoUpdater.checkForUpdatesAndNotify();
```

## Support

For issues or questions:
- Open an issue on GitHub
- Check the main README.md
- Review the troubleshooting section

---

Happy coding with CodeCraft AI! 🚀
