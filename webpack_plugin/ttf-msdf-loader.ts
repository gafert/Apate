/**
 * Loader plugin for converting true type fonts to msdf fonts which are packed by webpack
 */

import * as generateBMFont from 'msdf-bmfont-xml'

const msdfOptions = {
  charset: '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzüÜäÄöÖ ,;.:-_#\'*+~´`!"§$%&/()=?²³{[]}\\<>|^°',
  fieldType: 'msdf',
  outputType: 'json'
};

export default function (source) {
  const callback = this.async();
  generateBMFont(this.resourcePath, msdfOptions, (error, textures, font) => {
    const realTextures = textures.map((texture) => {
      return 'data:image/png;base64,' + texture.texture.toString('base64');
    });
    callback(null, `export default ${JSON.stringify({font: JSON.parse(font.data), textures: realTextures})}`);
  });
}
