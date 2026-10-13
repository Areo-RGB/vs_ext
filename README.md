# OpenCode, Pi-Bolt & J-Code Terminal VS Code Extension

A lightweight, clean Visual Studio Code extension that launches **OpenCode 2** (`opencode2`), **Pi-Bolt** (`pi-bolt`), and **J-Code** (`jcode`) directly in editor-area terminal tabs (split view beside your code) with one-click status bar buttons.

## Features

- **Editor Tab Terminal**: Opens OpenCode, Pi-Bolt, or J-Code directly inside an editor tab beside your active code, rather than cramped in the bottom panel.
- **Status Bar Integration**:
  - `$(terminal) OpenCode` button for instant OpenCode launching.
  - `$(zap) Pi-Bolt` button for instant Pi-Bolt launching.
  - `$(code) J-Code` button for instant J-Code launching.
- **Context Injection**: Quickly insert the active file and line selection (e.g. `@src/main.rs#L12-30`) straight into the terminal prompt.
- **Fast & Minimal**: Zero background daemons, zero webview overhead — purely launches the native TUI interfaces.

## Shortcuts

| Shortcut | macOS | Windows / Linux | Action |
| --- | --- | --- | --- |
| **Open / Focus OpenCode** | `Cmd + Escape` | `Ctrl + Escape` | Opens or focuses the OpenCode editor terminal |
| **New OpenCode Tab** | `Cmd + Shift + Escape` | `Ctrl + Shift + Escape` | Spawns a new OpenCode editor terminal tab |
| **Insert Active File / Selection (OpenCode)** | `Cmd + Alt + K` | `Ctrl + Alt + K` | Injects `@filepath#L10-20` into OpenCode |
| **Open / Focus Pi-Bolt** | `Cmd + Alt + B` | `Ctrl + Alt + B` | Opens or focuses the Pi-Bolt editor terminal |
| **New Pi-Bolt Tab** | `Cmd + Shift + B` | `Ctrl + Shift + B` | Spawns a new Pi-Bolt editor terminal tab |
| **Open / Focus J-Code** | `Cmd + Alt + J` | `Ctrl + Alt + J` | Opens or focuses the J-Code editor terminal |
| **New J-Code Tab** | `Cmd + Shift + J` | `Ctrl + Shift + J` | Spawns a new J-Code editor terminal tab |

## Configuration

You can customize the tools in your VS Code `settings.json`:

```json
{
  // Command to run for OpenCode (default: "opencode2")
  "opencode.command": "opencode2",

  // Where to open OpenCode: "editorBeside", "editorActive", or "panel"
  "opencode.location": "editorBeside",

  // Command to run for Pi-Bolt (default: "pi-bolt")
  "pibolt.command": "pi-bolt",

  // Where to open Pi-Bolt: "editorBeside", "editorActive", or "panel"
  "pibolt.location": "editorBeside",

  // Command to run for J-Code (default: "jcode")
  "jcode.command": "jcode",

  // Where to open J-Code: "editorBeside", "editorActive", or "panel"
  "jcode.location": "editorBeside"
}
```

## Prerequisites

- OpenCode CLI (`opencode` or `opencode2`) installed in your `PATH`.
- Pi-Bolt CLI (`pi-bolt`) installed in your `PATH`.
- J-Code CLI (`jcode`) installed in your `PATH`.

## License

MIT © [Areo-RGB](https://github.com/Areo-RGB)
