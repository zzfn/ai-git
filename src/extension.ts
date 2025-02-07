// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getGitChanges, setCommitMessage, hasGitChanges } from './git';
import { generateCommitMessage } from './ai-service';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ai-git" is now active!');

	// 注册生成 commit message 命令
	let disposableCommitMessage = vscode.commands.registerCommand('ai-git.generateCommitMessage', async () => {
		try {
			// 检查是否有暂存的更改
			if (!await hasGitChanges()) {
				vscode.window.showWarningMessage('No staged changes found. Please stage your changes first.');
				return;
			}

			// 获取 git 变更
			const changes = await getGitChanges();
			
			// 显示进度提示
			await vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: "Generating commit message...",
				cancellable: false
			}, async () => {
				// 生成 commit message
				const message = await generateCommitMessage(changes);
				
				// 直接设置 commit message
				await setCommitMessage(message);
				vscode.window.showInformationMessage('Commit message generated!');
			});
		} catch (error: any) {
			vscode.window.showErrorMessage(error.message);
		}
	});

	context.subscriptions.push(disposableCommitMessage);

	// 建议添加以下功能:
	// 1. Git 仓库状态检测
	// 2. 变更文件分析
	// 3. AI commit message 生成
	// 4. Git 操作建议
}

// This method is called when your extension is deactivated
export function deactivate() {}
