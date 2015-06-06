[![npm](https://nodei.co/npm/hise.png)](https://nodei.co/npm/hise/)

# hise

[![Dependency Status][david-badge]][david]

[Expand DOM selection][expand-selection] on mouse-up, as a CLI tool.

[expand-selection]: https://github.com/eush77/expand-selection

This tool can be plugged into other html-producing utilities, adding simple yet useful feature of highlighting all occurences of some piece of text by selecting that piece of text.

[david]: https://david-dm.org/eush77/hise
[david-badge]: https://david-dm.org/eush77/hise.png

## Example

```
# with source-highlight
$ source-highlight -i index.js |hise |bcat

# with marked
$ marked README.md |hise |bcat
```

## CLI

### `hise [option]... [<file>]`

Appends the script to the HTML page.

Reads `<file>` or stdin, writes to stdout.

#### Option: `--ignore-case, -i`

Ignore case while attempting a match in a string.

## Install

```
npm install -g hise
```

## License

MIT
