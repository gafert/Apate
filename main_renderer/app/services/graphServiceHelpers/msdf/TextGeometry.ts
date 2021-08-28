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

import {BufferGeometry} from "three";

import {TextLayout} from './layout-bmfont-text'
import {createQuadElements }  from './quad-indices'
import {setAttribute, setIndex} from './three-buffer-vertex-data'

import * as vertices from './vertices'

export class TextGeometry extends BufferGeometry {
  private positions: any;
  public layout: TextLayout;
  public visibleGlyphs: any[];
  private uvs: any;

  constructor(private opt) {
    super();

    if (typeof opt === 'string') {
      this.opt = { text: opt }
    }

    // also do an initial setup...
    if (opt) this.update(opt)
  }

  update(opt) {
    if (typeof opt === 'string') {
      opt = { text: opt }
    }

    // use constructor defaults
    opt = Object.assign({}, this.opt, opt)

    if (!opt.font) {
      throw new TypeError('must specify a { font } in options')
    }

    this.layout = new TextLayout(opt)

    // get vec2 texcoords
    const flipY = true;

    // the desired BMFont data
    const font = opt.font

    // determine texture size from font file
    const texWidth = font.common.scaleW
    const texHeight = font.common.scaleH

    // get visible glyphs
    const glyphs = this.layout.glyphs.filter(function (glyph) {
      const bitmap = glyph.data
      return bitmap.width * bitmap.height > 0
    })

    // provide visible glyphs for convenience
    this.visibleGlyphs = glyphs

    // get common vertex data
    const positions = vertices.positions(glyphs, this.layout)
    const uvs = vertices.uvs(glyphs, texWidth, texHeight, flipY)
    const indices = createQuadElements({
      clockwise: true,
      type: 'uint16',
      count: glyphs.length
    })

    // update vertex data
    setIndex(this, indices, 1, 'uint16')

    setAttribute(this, 'position', positions, 3)
    this.positions = positions;

    setAttribute(this, 'uv', uvs, 2)
    this.uvs = uvs;

    // update multipage data
    if (!opt.multipage && 'page' in this.attributes) {
      // disable multipage rendering
      this.deleteAttribute('page')
    } else if (opt.multipage) {
      const pages = vertices.pages(glyphs)
      // enable multipage rendering
      setAttribute(this, 'page', pages, 1)
    }
  }
}
