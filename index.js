const sharp = require('sharp')
const ColorThief = require('colorthief')

const map = fn => arr => arr.map(fn)

const defaultOptions = {
  nrOfSwatches: 5,
  swatchSize: 100,
  swatchSpacing: 25,
  direction: 'vertical',
  outputName: 'output'
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

const withColorPalette = (imgPath, userOptions) => {
  const options = { ...defaultOptions , ...userOptions }
  const image = sharp(imgPath)

  Promise.all([image, image.metadata(), getColorSwatches(options)(imgPath)])
    .then(([image, metadata, swatches]) => image
      .composite(map(createCompositeImage(options)(metadata))(swatches))
      .toFile(`${options.outputName}.${metadata.format}`, err => { err && console.log(err) })
    ).catch(console.log)

}

withColorPalette('20200803-DSCF1453.jpg')

module.exports = { withColorPalette }
