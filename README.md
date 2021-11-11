# Spritely

[![npm (scoped)](https://img.shields.io/npm/v/@microflash/spritely)](https://www.npmjs.com/package/@microflash/spritely)
[![GitHub last commit](https://img.shields.io/github/last-commit/Microflash/spritely)](https://github.com/Microflash/spritely/commits/main)
[![License](https://img.shields.io/github/license/Microflash/spritely)](./LICENSE.md)

> A handy Node.js CLI to generate SVG sprites

## Installation

```sh
npm install -g @microflash/spritely
yarn global add @microflash/spritely
```

## Usage

```
Usage: spritely [options]

Options:
  -V, --version                output the version number
  -i, --input [input]          specify input directory (default: current directory)
  -o, --output [output]        specify output file (default: "sprites.svg")
  -r, --recursive [recursive]  enable recursive traversal of input directory (default: false)
  -v, --viewbox [viewbox]      specify viewBox attribute (detected automatically, if not specified)
  -p, --prefix [prefix]        specify prefix for id attribute for symbols (default: none)
  -a, --a11y [a11y]            toggle accessibility mode (default: false)
  -q, --quiet                  disable verbose output
  -h, --help                   display help for command
```

### Examples

```sh
# Generate `sprites.svg` from SVG files in the current directory
$ spritely

# Generate `icons.svg` from SVG files in the directory `/mnt/e/assets`
$ spritely --input /mnt/e/assets/icons --output icons.svg
$ spritely -i /mnt/e/assets/icons -o icons.svg

# Generate `sprites.svg` from SVG files in the current directory with viewBox `0 0 24 24`
$ spritely --viewbox "0 0 24 24"
$ spritely -v "0 0 24 24"

# Generate `sprites.svg` from SVG files in the current directory with prefix `icon-`
$ spritely --prefix "icon-"
$ spritely -p "icon-"

# Generate `sprites.svg` from SVG files in the directory `/mnt/e/assets` and the directories within it
$ spritely --input /mnt/e/assets/icons --recursive true
$ spritely -i /mnt/e/assets/icons -r

# Generate `sprites.svg` from SVG files in the current directory with accessibility mode
$ spritely --a11y true
$ spritely -a
```

## Optimization

Pair `spritely` with [svgo](https://github.com/svg/svgo) to optimize the SVG files and generate sprites from them. A sample pipeline may look like this:

```sh
svgo -f /mnt/e/assets/icons && spritely -i /mnt/e/assets/icons
```

## Accessibility

`spritely` comes with a rudimentary accessibility mode (using `--a11y` option) which injects a `<title>` tag in the symbols based on the file name. 

For more control, you can add the `<title>` tag manually in an SVG file.

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <title>Airplay icon</title>
  <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
  <polygon points="12 15 17 21 7 21 12 15"></polygon>
</svg>
```

For better guidelines on using SVGs accessibly, refer to [Accessible SVGs: Perfect Patterns For Screen Reader Users](https://www.smashingmagazine.com/2021/05/accessible-svg-patterns-comparison/).
