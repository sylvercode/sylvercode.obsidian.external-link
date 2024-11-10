import { Editor, MarkdownView, Menu, Notice, Plugin } from 'obsidian';


export default class MyPlugin extends Plugin {
	async onload() {
		await this.loadSettings();

		this.registerEvent(
			this.app.workspace.on('editor-menu', (menu: Menu, editor: Editor, view: MarkdownView) => {
				menu.addItem((item) => {
					item
						.setTitle('Copy block external link')
						.setIcon('links-coming-in')
						.onClick(async () => {
							this.onCopyBlockExternalLink(editor, view);
						});
				});
			})
		);

		this.addCommand({
			id: 'copy-block-external-link',
			name: 'Copy block external link',
			editorCallback: this.onCopyBlockExternalLink
		});
	}

	onCopyBlockExternalLink(editor: Editor, view: MarkdownView) {
		const cursor = editor.getCursor();
		const line = editor.getLine(cursor.line);
		const blockIdMatch = line.match(/\^(\w+)$/);
		const blockId = !blockIdMatch ? null : encodeURIComponent(blockIdMatch[1]);
		if (!blockId) {
			new Notice('No block found');
			return;
		}

		const file = view.file;
		if (!file) {
			new Notice('No file found');
			return;
		}

		const filePath = encodeURIComponent(file.path);

		const vaultName = encodeURIComponent(file.vault.getName());

		navigator.clipboard.writeText(`obsidian://open?vault=${vaultName}&file=${filePath}%23%5E${blockId}`);
		new Notice('Block link copied to clipboard');
	}

	onunload() {

	}

	async loadSettings() {
	}

	async saveSettings() {
	}
}
