import * as vscode from "vscode";

const TERMINAL_NAME = "opencode";

export function activate(context: vscode.ExtensionContext) {
  // Command: Open or reveal existing OpenCode terminal in editor area
  const openTerminalCmd = vscode.commands.registerCommand(
    "opencode.openTerminal",
    async () => {
      const existing = vscode.window.terminals.find(
        (t) => t.name === TERMINAL_NAME
      );
      if (existing) {
        existing.show();
        return;
      }
      await launchOpenCodeTerminal(context);
    }
  );

  // Command: Always open a new OpenCode terminal tab
  const openNewTerminalCmd = vscode.commands.registerCommand(
    "opencode.openNewTerminal",
    async () => {
      await launchOpenCodeTerminal(context);
    }
  );

  // Command: Insert active editor path/selection reference into the terminal
  const addFilepathCmd = vscode.commands.registerCommand(
    "opencode.addFilepathToTerminal",
    async () => {
      const ref = getActiveEditorReference();
      if (!ref) {
        return;
      }
      const activeTerminal = vscode.window.activeTerminal;
      if (activeTerminal && activeTerminal.name === TERMINAL_NAME) {
        activeTerminal.sendText(`${ref} `, false);
        activeTerminal.show();
      }
    }
  );

  // Status Bar Item: Quick launch button on the status bar (bottom-right)
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = "opencode.openTerminal";
  statusBarItem.text = "$(terminal) OpenCode";
  statusBarItem.tooltip = "Open OpenCode Terminal (Ctrl+Escape)";
  statusBarItem.show();

  context.subscriptions.push(
    openTerminalCmd,
    openNewTerminalCmd,
    addFilepathCmd,
    statusBarItem
  );
}

export function deactivate() {}

async function launchOpenCodeTerminal(
  context: vscode.ExtensionContext
): Promise<vscode.Terminal> {
  const config = vscode.workspace.getConfiguration("opencode");
  const command = config.get<string>("command", "opencode2") || "opencode2";
  const locationSetting = config.get<string>("location", "editorBeside");

  let location:
    | vscode.TerminalEditorLocationOptions
    | vscode.TerminalLocation = {
    viewColumn: vscode.ViewColumn.Beside,
    preserveFocus: false,
  };

  if (locationSetting === "editorActive") {
    location = {
      viewColumn: vscode.ViewColumn.Active,
      preserveFocus: false,
    };
  } else if (locationSetting === "panel") {
    location = vscode.TerminalLocation.Panel;
  }

  const iconDark = context.asAbsolutePath("images/button-dark.svg");
  const iconLight = context.asAbsolutePath("images/button-light.svg");

  const terminal = vscode.window.createTerminal({
    name: TERMINAL_NAME,
    iconPath: {
      light: vscode.Uri.file(iconLight),
      dark: vscode.Uri.file(iconDark),
    },
    location,
    env: {
      OPENCODE_CALLER: "vscode",
    },
  });

  terminal.show();
  terminal.sendText(command);

  // If there is an active editor selection, append initial reference context
  const initialRef = getActiveEditorReference();
  if (initialRef) {
    setTimeout(() => {
      terminal.sendText(`In ${initialRef} `, false);
    }, 1200);
  }

  return terminal;
}

function getActiveEditorReference(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return undefined;
  }
  const document = editor.document;
  if (!vscode.workspace.getWorkspaceFolder(document.uri)) {
    return undefined;
  }
  let ref = `@${vscode.workspace.asRelativePath(document.uri)}`;
  const selection = editor.selection;
  if (!selection.isEmpty) {
    const start = selection.start.line + 1;
    const end = selection.end.line + 1;
    ref += start === end ? `#L${start}` : `#L${start}-${end}`;
  }
  return ref;
}
