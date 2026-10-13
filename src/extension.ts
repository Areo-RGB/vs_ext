import * as vscode from "vscode";

const OPENCODE_TERMINAL_NAME = "opencode";
const PI_BOLT_TERMINAL_NAME = "pi-bolt";
const JCODE_TERMINAL_NAME = "jcode";

interface AgentTerminalConfig {
  id: string;
  terminalName: string;
  defaultCommand: string;
  configSection: string;
  iconPath: vscode.TerminalOptions["iconPath"];
  callerEnvVar: string;
}

export function activate(context: vscode.ExtensionContext) {
  const opencodeAgent: AgentTerminalConfig = {
    id: "opencode",
    terminalName: OPENCODE_TERMINAL_NAME,
    defaultCommand: "opencode2",
    configSection: "opencode",
    iconPath: {
      light: vscode.Uri.file(context.asAbsolutePath("images/button-light.svg")),
      dark: vscode.Uri.file(context.asAbsolutePath("images/button-dark.svg")),
    },
    callerEnvVar: "OPENCODE_CALLER",
  };

  const piBoltAgent: AgentTerminalConfig = {
    id: "pibolt",
    terminalName: PI_BOLT_TERMINAL_NAME,
    defaultCommand: "pi-bolt",
    configSection: "pibolt",
    iconPath: new vscode.ThemeIcon("zap"),
    callerEnvVar: "PI_BOLT_CALLER",
  };

  const jcodeAgent: AgentTerminalConfig = {
    id: "jcode",
    terminalName: JCODE_TERMINAL_NAME,
    defaultCommand: "jcode",
    configSection: "jcode",
    iconPath: new vscode.ThemeIcon("code"),
    callerEnvVar: "JCODE_CALLER",
  };

  // Register commands for OpenCode, Pi-Bolt, and J-Code
  registerAgentCommands(context, opencodeAgent);
  registerAgentCommands(context, piBoltAgent);
  registerAgentCommands(context, jcodeAgent);

  // Status Bar Item: OpenCode quick launch (Right, priority 100)
  const openCodeStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  openCodeStatusBarItem.command = "opencode.openTerminal";
  openCodeStatusBarItem.text = "$(terminal) OpenCode";
  openCodeStatusBarItem.tooltip = "Open OpenCode Terminal (Ctrl+Escape)";
  openCodeStatusBarItem.show();

  // Status Bar Item: Pi-Bolt quick launch (Right, priority 99)
  const piBoltStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    99
  );
  piBoltStatusBarItem.command = "pibolt.openTerminal";
  piBoltStatusBarItem.text = "$(zap) Pi-Bolt";
  piBoltStatusBarItem.tooltip = "Open Pi-Bolt Terminal (Ctrl+Alt+B)";
  piBoltStatusBarItem.show();

  // Status Bar Item: J-Code quick launch (Right, priority 98)
  const jcodeStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    98
  );
  jcodeStatusBarItem.command = "jcode.openTerminal";
  jcodeStatusBarItem.text = "$(code) J-Code";
  jcodeStatusBarItem.tooltip = "Open J-Code Terminal (Ctrl+Alt+J)";
  jcodeStatusBarItem.show();

  context.subscriptions.push(
    openCodeStatusBarItem,
    piBoltStatusBarItem,
    jcodeStatusBarItem
  );
}

export function deactivate() {}

function registerAgentCommands(
  context: vscode.ExtensionContext,
  agent: AgentTerminalConfig
) {
  // Command: Open or reveal existing terminal tab
  const openCmd = vscode.commands.registerCommand(
    `${agent.id}.openTerminal`,
    async () => {
      const existing = vscode.window.terminals.find(
        (t) => t.name === agent.terminalName
      );
      if (existing) {
        existing.show();
        return;
      }
      await launchTerminal(context, agent);
    }
  );

  // Command: Always open a new terminal tab
  const openNewCmd = vscode.commands.registerCommand(
    `${agent.id}.openNewTerminal`,
    async () => {
      await launchTerminal(context, agent);
    }
  );

  // Command: Insert active editor path/selection reference into the terminal
  const addFilepathCmd = vscode.commands.registerCommand(
    `${agent.id}.addFilepathToTerminal`,
    async () => {
      const ref = getActiveEditorReference();
      if (!ref) {
        return;
      }
      const activeTerminal = vscode.window.activeTerminal;
      if (activeTerminal && activeTerminal.name === agent.terminalName) {
        activeTerminal.sendText(`${ref} `, false);
        activeTerminal.show();
      }
    }
  );

  context.subscriptions.push(openCmd, openNewCmd, addFilepathCmd);
}

async function launchTerminal(
  context: vscode.ExtensionContext,
  agent: AgentTerminalConfig
): Promise<vscode.Terminal> {
  const config = vscode.workspace.getConfiguration(agent.configSection);
  const command =
    config.get<string>("command", agent.defaultCommand) || agent.defaultCommand;
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

  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

  const terminal = vscode.window.createTerminal({
    name: agent.terminalName,
    iconPath: agent.iconPath,
    location,
    cwd: workspaceFolder,
    env: {
      [agent.callerEnvVar]: "vscode",
    },
  });

  terminal.show();
  terminal.sendText(command);

  // If there is an active editor selection, append initial reference context
  const initialRef = getActiveEditorReference();
  if (initialRef) {
    setTimeout(() => {
      const prefix = agent.id === "opencode" ? "In " : "";
      terminal.sendText(`${prefix}${initialRef} `, false);
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
