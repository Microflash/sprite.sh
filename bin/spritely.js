#!/usr/bin/env node

const path = require('path')
const fs = require('fs-extra')
const program = require('commander')
const cheerio = require('cheerio')

program
  .option('-i, --input [input]', 'specify input directory (default: current directory)')
  .option('-o, --output [output]', 'specify output file (default: "sprites.svg")')
  .option('-v, --viewbox [viewbox]', 'specify viewBox attribute (detected automatically, if not specified)')
  .option('-p, --prefix [prefix]', 'specify prefix for id attribute for symbols (default: none)')
  .option('-n, --normalize [normalize]', 'toggle whitespace normalization (default: true)')
  .option('-q, --quiet', 'disable verbose output')
  .parse(process.argv)

const SOURCE_FOLDER = program.input || '.'
const OUTPUT_FILE = program.output || 'sprites.svg'
const ID_PREFIX = program.prefix || ''
const VIEWBOX = program.viewbox || null
const PARSER_OPTIONS = {
  normalizeWhitespace: program.normalize || true
}
const QUIET = program.quiet || false

const log = message => {
  if (!QUIET) console.log(message)
}

const getSvgElement = content => {
  const $ = cheerio.load(content, PARSER_OPTIONS)
  return $('svg').first()
}

const getViewbox = content => {
  const svgContent = getSvgElement(content)
  return VIEWBOX || svgContent.attr('viewbox') || svgContent.attr('viewBox')
}

const getPreserveAspectRatio = content => {
  const svgContent = getSvgElement(content)
  return svgContent.attr('preserveaspectratio') || svgContent.attr('preserveAspectRatio')
}

const generateSymbolId = fileName => (ID_PREFIX + fileName).replace(' ', '-')

const generateAttributesString = attributes => {
  return Object.keys(attributes).reduce((acc, key) => {
    const value = attributes[key]
    return value ? `${acc} ${key}="${value}"` : acc
  }, '')
}

const getSvgContent = content => getSvgElement(content).html()

const generateSymbol = (content, attributes) => `<symbol${generateAttributesString(attributes)}>${getSvgContent(content)}</symbol>`

const wrapFile = (fileName, content) => {
  const attributes = {
    viewBox: getViewbox(content),
    id: generateSymbolId(fileName),
    preserveAspectRatio: getPreserveAspectRatio(content)
  }

  log(`Process "${fileName}" (viewBox "${attributes.viewBox}")...`)

  return generateSymbol(content, attributes)
}

const processFile = file => {
  const filePath = path.resolve(SOURCE_FOLDER, file)
  const fileName = path.basename(file, path.extname(file))
  const wrapContent = wrapFile.bind(null, fileName)

  return fs.readFile(filePath, 'utf8').then(wrapContent)
}

const removeOutputFile = () => fs.remove(OUTPUT_FILE)

const readSourceDirectory = d => fs.readdir(SOURCE_FOLDER)

const processFiles = files => {
  const processedFiles = files.filter(filterSvgFile).map(processFile)

  return Promise.all(processedFiles)
}

const filterSvgFile = file => path.extname(file) === '.svg'

const getSpriteContent = contents => `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${contents.join('')}</svg>`

const writeOutputFile = content => fs.writeFile(OUTPUT_FILE, content, 'utf8')

const conclude = () => log(`File "${OUTPUT_FILE}" successfully generated.`)

const rethrowErrors = err => {
  throw err
}

removeOutputFile()
  .then(readSourceDirectory)
  .then(processFiles)
  .then(getSpriteContent)
  .then(writeOutputFile)
  .then(conclude)
  .catch(rethrowErrors)
