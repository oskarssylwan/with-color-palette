const sharp = require('sharp')
const ColorThief = require('colorthief')
const path = require('path')
const fs = require('fs')
const cliArgs = require('minimist')(process.argv.slice(2));

const map = fn => arr => arr.map(fn)
const isSupportedFileType = file =>
  file.endsWith('.jpg')
  || file.endsWith('.jpeg')
  || file.endsWith('.png')

const defaultOptions = {
  nrOfSwatches: 5,
  swatchSize: 100,
  swatchSpacing: 25,
  direction: 'vertical',
  outputSuffix: '-output'
}

const createSwatch = ({ swatchSize }) => ([r, g, b]) => ({
  width: swatchSize,
  height: swatchSize,
  channels: 3,
  background: { r, g, b }
})

const getColorSwatches = options => imgPath =>
  ColorThief.getPalette(imgPath, options.nrOfSwatches)
    .then(map(createSwatch(options)))

const calculateTopOffset = ({ nrOfSwatches, swatchSize, swatchSpacing }) => ({ height }) => swatchIndex => {
  const paletteSize = ((swatchSize + swatchSpacing) * nrOfSwatches) - swatchSpacing
  const startOffset = (height / 2) - (paletteSize / 2)
  return startOffset + ((swatchSize + swatchSpacing) * swatchIndex)
}

const createCompositeImage = options => metadata => (swatch, swatchIndex) => ({
  input: { create: swatch },
  top: Math.floor(calculateTopOffset(options)(metadata)(swatchIndex)),
  left: Math.floor((metadata.width / 2) - (options.swatchSize / 2))
})

const imageWithColorPalette = (imgPath, userOptions) => {
  const options = { ...defaultOptions , ...userOptions }
  const image = sharp(imgPath)
  const imgName = imgPath.replace(/(\.jpg|\.jpeg|\.png)/, '')

  Promise.all([image, image.metadata(), getColorSwatches(options)(imgPath)])
    .then(([image, metadata, swatches]) => {
      return image
        .composite(map(createCompositeImage(options)(metadata))(swatches))
        .toFile(`${imgName}${options.outputSuffix}.${metadata.format}`, err => { err && console.log(err) })
    }
    ).catch(console.log)
}

const dirWithColorPalette = (dir, options) => {
  const absoluteDirectoryPath = path.join(__dirname, dir)
  fs.readdir(absoluteDirectoryPath, (err, files) => {
    if (err) return console.log('Unable to scan directory: ' + err);

    files
      .filter(isSupportedFileType)
      .forEach(file => {
        imageWithColorPalette(path.join(dir, file), options)
      });
});
}

const withColorPalette = (dir, options) => {
  isSupportedFileType(dir)
    ? imageWithColorPalette(dir, options)
    : dirWithColorPalette(dir, options)
}

if (cliArgs.path) { withColorPalette(cliArgs.path, cliArgs) }

module.exports = { withColorPalette }
