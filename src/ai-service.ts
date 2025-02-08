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

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "Pro/deepseek-ai/DeepSeek-V3",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ]
        })
    };

    try {
        const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', options);
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