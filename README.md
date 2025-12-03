# find-more

A VS Code extension that enhances the built-in find functionality with convenient file-specific search options.

## 🚀 Features

- **Quick File Search**: Search for text directly within selected files
- **Easy Access**: Right-click on any file to search within it
- **Toolbar Integration**: Use the "Find All In File" button in the editor toolbar
- **Built-in Search**: Leverages VS Code's internal search capabilities

## 📖 Usage

### Method 1: Toolbar
1. Open a file in the editor
2. Click `Find All In File` in the editor toolbar (top-right)

### Method 2: Context Menu
1. Right-click on any file in the explorer
2. Select `Find All In File` to search within that specific file

## 🔧 How It Works

This extension extends VS Code's built-in find functions by providing quick access to file-specific search operations. It uses the VS Code command `workbench.action.findInFiles` to perform searches efficiently.

## ⚙️ Extension Settings

Currently, no additional settings are required. The extension works out of the box.

## 📝 Release Notes

### [0.3.0] - Current
- Integrated with VS Code's `workbench.action.findInFiles` command
- Improved search functionality using VS Code's internal search engine

### [0.1.0]
- Added ripgrep support

### [0.0.2]
- Implemented basic search functions

### [0.0.1]
- Initial release

## 🤝 Acknowledgments

Thanks to the following projects for inspiration:
- [vscode-markdownlint](https://github.com/DavidAnson/vscode-markdownlint) - for diagnostic handling concepts
- [vscode-ext-color-highlight](https://github.com/sergiirocks/vscode-ext-color-highlight) - for decoration handling concepts

## 📚 Related Resources

- [VS Code Issue #14836](https://github.com/Microsoft/vscode/issues/14836)
- [VS Code PR #54038](https://github.com/Microsoft/vscode/pull/54038)
- [GitHub Repository](https://github.com/FFengIll/vscode-find-more.git)
- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=FengYouzheng.find-more)

## 📄 License

MIT License

---

**Enjoy enhanced file searching in VS Code!**
