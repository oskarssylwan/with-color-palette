# withColorPalette

withColorPalette is a function that extracts a color palette from an input image
and renders those colors on the image.

## Usage
```
npm i with-color-palette
```
```
const { withColorPalette } = require('with-color-palette')

withColorPalette('input.png')
withColorPalette('./images')
```

### Additional options
withColorPalette takes an options object as a second parameter.
Below is an example with default values for the options object.

```
withColorPalette('input.png', {
  nrOfSwatches: 5,
  swatchSize: 100,
  swatchSpacing: 25,
  outputSuffix: '-output'
})
```

**nrOfSwatches** - The number of swatches drawn on the output image.

**swatchSize** - The width and height of the swatch in pixels

**swatchSpacing** - The distance between the drawn swatches on the output image in pixels

**outputSuffix** - The suffix that will be added to the output file. withColorPalette() vill add the same filetype as the input image.

### Supported file types
- jpg / jpeg
- png
