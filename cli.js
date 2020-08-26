#!/usr/bin/env node

const { dirAbsoluteWithColorPalette } = require('./index.js')
const cliArgs = require('minimist')(process.argv.slice(2))

if (cliArgs.path) {
  dirAbsoluteWithColorPalette(cliArgs.path, cliArgs)
} else {
  throw "No path provided. Provide path with the --path flag"
}
