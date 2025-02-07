import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	// 建议添加以下测试:
	// 1. Git 仓库检测测试
	// 2. 文件变更分析测试
	// 3. AI 功能集成测试
});

suite('Commit Message Generation', () => {
	test('should generate commit message for changes', async () => {
		// 测试 commit message 生成功能
	});

	test('should handle missing API key', async () => {
		// 测试 API key 未配置的情况
	});

	test('should handle API errors', async () => {
		// 测试 API 调用失败的情况
	});
});
