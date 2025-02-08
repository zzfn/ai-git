import * as vscode from 'vscode';

interface ApiResponse {
    choices: {
        message: {
            content: string;
        };
    }[];
}

export async function generateCommitMessage(changes: string) {
    const apiKey = vscode.workspace.getConfiguration('aiAssistant').get('apiKey') as string;
    if (!apiKey) {
        throw new Error('请先配置 AI API Key');
    }

    const language = vscode.workspace.getConfiguration('aiAssistant').get('language') || '中文';
    const customPrompt = vscode.workspace.getConfiguration('aiAssistant').get('customPrompt') as string;

    // 构建 prompt
    const prompt = customPrompt.replace('{diff}', changes);

    try {
        const response = await callAIAPI(apiKey, prompt);
        return response.trim();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to generate commit message: ${error.message}`);
        }
        throw error;
    }
}

async function callAIAPI(apiKey: string, prompt: string): Promise<string> {
    const language = vscode.workspace.getConfiguration('aiAssistant').get('language') || '中文';
    const systemPrompt = `You are an AI assistant. Please respond in ${language}.`;
    const provider = vscode.workspace.getConfiguration('aiAssistant').get('provider') as string;
    const model = vscode.workspace.getConfiguration('aiAssistant').get(`${provider}Model`) as string;

    const API_ENDPOINTS = {
        siliconflow: 'https://api.siliconflow.cn/v1/chat/completions',
        deepseek: 'https://api.deepseek.com/v1/chat/completions'
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ]
        })
    };

    try {
        const response = await fetch(API_ENDPOINTS[provider as keyof typeof API_ENDPOINTS], options);
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        const data = await response.json() as ApiResponse;
        return data.choices[0].message.content as string;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`API call failed: ${error.message}`);
        }
        throw error;
    }
} 