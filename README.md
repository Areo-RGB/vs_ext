# OpenCode Terminal VS Code Extension

A lightweight, clean Visual Studio Code extension that launches **OpenCode 2** (`opencode2`) directly in an editor-area terminal tab (split view beside your code).

## Features

- **Editor Tab Terminal**: Opens OpenCode directly inside an editor tab beside your active code, rather than cramped in the bottom panel.
- **Status Bar Integration**: A discreet `$(terminal) OpenCode` button on the bottom status bar for quick one-click launching.
- **Context Injection**: Quickly insert the active file and line selection (e.g. `@src/main.rs#L12-30`) straight into the OpenCode prompt.
- **Fast & Minimal**: Zero background daemons, zero webview bloat — purely launches the native OpenCode TUI interface.

## Shortcuts

| Shortcut | macOS | Windows / Linux | Action |
| --- | --- | --- | --- |
| **Open / Focus OpenCode** | `Cmd + Escape` | `Ctrl + Escape` | Opens or focuses the OpenCode editor terminal |
| **New OpenCode Tab** | `Cmd + Shift + Escape` | `Ctrl + Shift + Escape` | Spawns a new OpenCode editor terminal tab |
| **Insert Active File / Selection** | `Cmd + Alt + K` | `Ctrl + Alt + K` | Injects `@filepath#L10-20` into OpenCode |

## Configuration

You can customize the extension in your VS Code `settings.json`:

```json
{
  // Command to run in the terminal (default: "opencode2")
  "opencode.command": "opencode2",

  // Where to open the terminal: "editorBeside", "editorActive", or "panel" (default: "editorBeside")
  "opencode.location": "editorBeside"
}
```

## Prerequisites

Requires OpenCode CLI installed on your system (`opencode` or `opencode2` in your `PATH`).

## Development & Build

```bash
# Install dependencies
bun install   # or npm install

# Build extension
bun run package   # or npm run package

# Build VSIX package
npx @vscode/vsce package
```

## License

MIT © [Areo-RGB](https://github.com/Areo-RGB)
