/*
  Original license:

  The MIT License (MIT)
  Copyright (c) 2015 Jam3

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
  OR OTHER DEALINGS IN THE SOFTWARE.

  Changes:
    Modified by gafert to work in r131

 */

var createLayout = require('./layout-bmfont-text')
var createIndices = require('./quad-indices')
var buffer = require('./three-buffer-vertex-data')

var vertices = require('./vertices')
var utils = require('./utils')

export class TextGeometry extends THREE.BufferGeometry {

  constructor(opt) {
    super();

    if (typeof opt === 'string') {
      opt = { text: opt }
    }

    // use these as default values for any subsequent
    // calls to update()
    this._opt = Object.assign({}, opt)

    // also do an initial setup...
    if (opt) this.update(opt)
  }

  update(opt) {
    if (typeof opt === 'string') {
      opt = { text: opt }
    }

    // use constructor defaults
    opt = Object.assign({}, this._opt, opt)

    if (!opt.font) {
      throw new TypeError('must specify a { font } in options')
    }

    this.layout = createLayout(opt)

    // get vec2 texcoords
    var flipY = true;

    // the desired BMFont data
    var font = opt.font

    // determine texture size from font file
    var texWidth = font.common.scaleW
    var texHeight = font.common.scaleH

    // get visible glyphs
    var glyphs = this.layout.glyphs.filter(function (glyph) {
      var bitmap = glyph.data
      return bitmap.width * bitmap.height > 0
    })

    // provide visible glyphs for convenience
    this.visibleGlyphs = glyphs

    // get common vertex data
    var positions = vertices.positions(glyphs, this.layout)
    var uvs = vertices.uvs(glyphs, texWidth, texHeight, flipY)
    var indices = createIndices({
      clockwise: true,
      type: 'uint16',
      count: glyphs.length
    })

    // update vertex data
    buffer.index(this, indices, 1, 'uint16')
    buffer.attr(this, 'position', positions, 3)

    this.positions = positions;

    buffer.attr(this, 'uv', uvs, 2)
    this.uvs = uvs;


    // update multipage data
    if (!opt.multipage && 'page' in this.attributes) {
      // disable multipage rendering
      this.deleteAttribute('page')
    } else if (opt.multipage) {
      var pages = vertices.pages(glyphs)
      // enable multipage rendering
      buffer.attr(this, 'page', pages, 1)
    }
  }
}
