# find-more README
## No Maintenance WARNING
It is going to **No Maintenance**!
I have tried to make the find better (plugin or PR), none of them seem good.
But vscode is giving more and more on it, so we may (and hope) no need for this in the future.

> some struggle: 
> [issue](https://github.com/Microsoft/vscode/issues/14836)
> [pr](https://github.com/Microsoft/vscode/pull/54038)
> [plugin in github](https://github.com/FFengIll/vscode-find-more)
> [plugin in market](https://marketplace.visualstudio.com/items?itemName=FengYouzheng.find-more)

## Description
Wish to extend vscode build-in find functions, so it is "find-more".  
The find results will show in `Symbol Reference` panel and `PROBLEMS` panel (default not).

- Select target, click `FindAll` on title toolbar (the top-right).
- Or click `FindAll` and `key in` the target.
- Only support plain text!

## Features
find all results in one file
- Show `all find results` in an interactive panel.
- `Navigate` the edit according to the find results.
- `Highlight` the find results.
- Close to clear.
- Can work with `engin` like `ripgrep`, `grep`, ... (while set).
- Only work in `single file` and `plain text`.

## Mention
* If use engine like ripgrep / grep / ... to help find all, please set it first.
* If no engine given (or error), it will fall into general text find method.

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
Source code in [Github](https://github.com/FFengIll/vscode-find-more.git) 
under [MIT](https://mit-license.org/).

Thanks to 
[vscode-markdownlint](https://github.com/DavidAnson/vscode-markdownlint) (about diagnostic)
[vscode-ext-color-highlight](https://github.com/sergiirocks/vscode-ext-color-highlight) (about decorations).

**Enjoy!**