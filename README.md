# find-more README

Wish to extend vscode build-in find functions, so it is "find-more".  
The extra find results can be shown in `Symbol Reference` panel and `PROBLEMS` panel (default not).

## Features

### Find
- Show all find results in an interactive panel.
- `Navigate` the edit according to the find results.
- `Highlight` the find results.
- Clear find results.
- Can work with `ripgrep`.
- Only work in `single file` now.

[\\]: # (\!\[feature X\]\(images/feature-x.png\))

## Requirements

* If use ripgrep to help find all, please set the ripgrep.
* If no ripgrep given (or error), it will directly do text find.

## Extension Settings

This extension contributes the following settings:

```json
    "find.engine": {
        "default": "rg"  // put the path of ripgrep here
    },
    "find.options": {
        "default": "-n" // default need
    },
    "find.diagnostics": {
        "default": false // keep the old mode, default false for close
    }
```

## Known Issues
None for now.

## Release Notes
* [0.1.0] Can work with ripgrep.
* [0.0.2] Basic functions completed.
* [0.0.1] Initial release.

# Misc
Thanks to 
[vscode-markdownlint](https://github.com/DavidAnson/vscode-markdownlint) (about diagnostic)
and 
[vscode-ext-color-highlight](https://github.com/sergiirocks/vscode-ext-color-highlight) (about decorations).

Source code in [Github](https://github.com/FengYouzheng/vscode-find-more.git) under [MIT](https://mit-license.org/).

**Enjoy!**