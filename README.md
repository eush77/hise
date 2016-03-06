[![npm](https://nodei.co/npm/hise.png)](https://nodei.co/npm/hise/)

# hise

[![Build Status][travis-badge]][travis] [![Dependency Status][david-badge]][david]

Inject `<script>` to [expand DOM selection][expand-selection] on mouse-up.

[expand-selection]: https://github.com/eush77/expand-selection

`hise` reads HTML or plaintext from input file and adds a `<script>` tag that, when viewing in a web browser, will add an event listener to highlight matching text on mouse selection.

[travis]: https://travis-ci.org/eush77/hise
[travis-badge]: https://travis-ci.org/eush77/hise.svg?branch=master
[david]: https://david-dm.org/eush77/hise
[david-badge]: https://david-dm.org/eush77/hise.png

## Example

```
# wrap arbitrary output
$ ps --sort=pcpu | head | hise -r

# with source-highlight
$ source-highlight -i index.js | hise

# with marked
$ marked README.md | hise
```

**Hint**: use [bcat] to pipe HTML output to a browser tab.

[bcat]: https://github.com/rtomayko/bcat

## CLI

### `hise [option]... [<file>]`

Appends the script to an HTML page. If input is not HTML but plaintext, wraps it in `<pre>` first.

Reads `<file>` or stdin, writes to stdout.

#### Option: `--raw, -r`

Wrap input stream in a `<pre>` tag.

#### Option: `--ignore-case, -i`

Ignore case when matching a string.

## Install

```
npm install -g hise
```

## License

MIT
