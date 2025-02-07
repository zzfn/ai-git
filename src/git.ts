import * as vscode from 'vscode';

export async function getGitChanges() {
    const gitExt = vscode.extensions.getExtension('vscode.git')?.exports;
    const api = gitExt.getAPI(1);
    const repo = api.repositories[0];
    
    if (!repo) {
        throw new Error('No git repository found');
    }

    const changes = await repo.diff(true); // 获取暂存区变更
    return changes;
}

export async function setCommitMessage(message: string) {
    const gitExt = vscode.extensions.getExtension('vscode.git')?.exports;
    const api = gitExt.getAPI(1);
    const repo = api.repositories[0];
    
    if (repo) {
        repo.inputBox.value = message;
    }
}

export async function hasGitChanges(): Promise<boolean> {
    try {
        const gitExt = vscode.extensions.getExtension('vscode.git')?.exports;
        const api = gitExt.getAPI(1);
        const repo = api.repositories[0];
        
        if (!repo) {
            return false;
        }

        const changes = await repo.diff(true);
        return changes.length > 0;
    } catch (error) {
        return false;
    }
} 