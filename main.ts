import { App, Editor, MarkdownView, Menu, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface ExternalLinkSettings {
	generateHtmlAnchor: boolean;
}

const DEFAULT_SETTINGS: ExternalLinkSettings = {
	generateHtmlAnchor: false
}

export default class MyPlugin extends Plugin {
	settings: ExternalLinkSettings;
	async onload() {
		await this.loadSettings();

		this.addSettingTab(new ExternalLinkSettingTab(this.app, this));

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
		const uri = `obsidian://open?vault=${vaultName}&file=${filePath}%23%5E${blockId}`;

		let textToCopy: string;
		if (this.settings.generateHtmlAnchor) {
			// Extract block text without the block ID
			const blockText = line.replace(/\s*\^(\w+)$/, '').trim();
			// Remove markdown heading markers if present
			const cleanText = blockText.replace(/^#{1,6}\s*/, '');
			textToCopy = `<a href="${uri}">${cleanText}</a>`;
		} else {
			textToCopy = uri;
		}

		navigator.clipboard.writeText(textToCopy);
		new Notice('Block link copied to clipboard');
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ExternalLinkSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Generate HTML anchor')
			.setDesc('When enabled, generates an HTML anchor tag (<a>) with the link text from the block content instead of just the plain obsidian:// URI.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.generateHtmlAnchor)
				.onChange(async (value) => {
					this.plugin.settings.generateHtmlAnchor = value;
					await this.plugin.saveSettings();
				}));
	}
}
