# Copilot Instructions

## Project Overview
This is an Obsidian plugin that allows users to copy external links (obsidian:// URIs) to block references in their vault. The plugin adds both a context menu item and a command palette command.

## Tech Stack
- TypeScript
- Obsidian Plugin API
- esbuild for bundling

## Code Style and Conventions
- Use TypeScript for all code
- Follow the existing code structure with a single plugin class extending `Plugin`
- Use the Obsidian API patterns (Editor, MarkdownView, Menu, Notice, Plugin)
- Use async/await for asynchronous operations
- Keep code simple and focused on the core functionality

## Key Implementation Details
- Block IDs in Obsidian follow the pattern `^blockid` at the end of a line
- Use regex pattern `/\^(\w+)$/` to match block IDs
- Obsidian URIs follow the format: `obsidian://open?vault={vaultName}&file={filePath}%23%5E{blockId}`
- Always URL encode vault names, file paths, and block IDs
- Use `navigator.clipboard.writeText()` to copy to clipboard
- Use Obsidian's `Notice` class for user feedback

## Plugin Structure
- `onload()`: Initialize plugin, register events and commands
- `onCopyBlockExternalLink()`: Main functionality to extract block ID and create URI
- `onunload()`: Cleanup (currently empty)
- `loadSettings()` / `saveSettings()`: Settings persistence (currently unused)

## Testing Considerations
- Test with various vault names (including special characters)
- Test with file paths containing spaces and special characters
- Test with valid and invalid block ID formats
- Ensure proper error handling with Notice messages

## API References
- Main API: https://github.com/obsidianmd/obsidian-api
- Type definitions: Use types from `obsidian` module

## Common Patterns
- Register editor menu items using `this.app.workspace.on('editor-menu', ...)`
- Add commands using `this.addCommand()`
- Access current file via `view.file`
- Access cursor position via `editor.getCursor()`
- Get line content via `editor.getLine(lineNumber)`
