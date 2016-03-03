[![npm](https://nodei.co/npm/hise.png)](https://nodei.co/npm/hise/)

# hise

[![Dependency Status][david-badge]][david]

[Expand DOM selection][expand-selection] on mouse-up, as a CLI tool.

[expand-selection]: https://github.com/eush77/expand-selection

`hise` reads HTML or plaintext from input file and adds a `<script>` tag that, when viewing in a web browser, will add an event listener to highlight matching text on mouse selection.

[david]: https://david-dm.org/eush77/hise
[david-badge]: https://david-dm.org/eush77/hise.png

## Example

```
# wrap arbitrary output
$ ps --sort-pcpu | head | hise

# with source-highlight
$ source-highlight -i index.js | hise

# with marked
$ marked README.md | hise
```

**Hint**: use [bcat] to pipe HTML output to a browser tab.

[bcat]: https://github.com/rtomayko/bcat

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
