# find-more README

## Re-Maintenance

Since new version vscode provide more commands include `workbench.action.findInFiles`,
I can continue this work since some features needed by myself.

## Description

Wish to extend vscode build-in find functions, so it is "find-more".  
~~The find results will show in `Symbol Reference` panel and `PROBLEMS` panel (default not).~~

- Select target, click `Find All In File` on title toolbar (the top-right), or `key in` the target.
- `Right click` on the file, `Find All In File` to search only in the choosen.

> Actually, use vscode provided search

## Features

- Use vscode internal find/search to find text in the given file.
- ~~`Navigate` the edit according to the find results.~~
- ~~`Highlight` the find results.~~

## Extension Settings

None for now.

## Known Issues

None for now.

## Release Notes

- [0.3.0] Use new vscode command `workbench.action.findInFiles` for search.
- [0.1.0] Can work with ripgrep.
- [0.0.2] Basic functions completed.
- [0.0.1] Initial release.

# Misc

Source code in [Github](https://github.com/FFengIll/vscode-find-more.git)
under [MIT](https://mit-license.org/).

Thanks to
[vscode-markdownlint](https://github.com/DavidAnson/vscode-markdownlint) (about diagnostic)
[vscode-ext-color-highlight](https://github.com/sergiirocks/vscode-ext-color-highlight) (about decorations).

Old events

- [issue](https://github.com/Microsoft/vscode/issues/14836)
- [pr](https://github.com/Microsoft/vscode/pull/54038)
- [plugin in github](https://github.com/FFengIll/vscode-find-more)
- [plugin in market](https://marketplace.visualstudio.com/items?itemName=FengYouzheng.find-more)

**Enjoy!**
