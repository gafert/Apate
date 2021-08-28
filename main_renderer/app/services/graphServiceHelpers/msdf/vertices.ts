/**
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
import {TextLayout} from "./layout-bmfont-text";


export function pages(glyphs) {
  const pages = new Float32Array(glyphs.length * 4)
  let i = 0
  glyphs.forEach(function (glyph) {
    const id = glyph.data.page || 0
    pages[i++] = id
    pages[i++] = id
    pages[i++] = id
    pages[i++] = id
  })
  return pages
}

export function uvs(glyphs, texWidth, texHeight, flipY) {
  const uvs = new Float32Array(glyphs.length * 4 * 2)
  let i = 0
  glyphs.forEach(function (glyph) {
    const bitmap = glyph.data
    const bw = (bitmap.x + bitmap.width)
    const bh = (bitmap.y + bitmap.height)

    // top left position
    const u0 = bitmap.x / texWidth
    const v1 = (texHeight - bitmap.y) / texHeight
    const u1 = bw / texWidth
    const v0 = (texHeight - bh) / texHeight

    // TL
    uvs[i++] = u0
    uvs[i++] = v0
    // TR
    uvs[i++] = u1
    uvs[i++] = v0
    // BR
    uvs[i++] = u1
    uvs[i++] = v1
    // BL
    uvs[i++] = u0
    uvs[i++] = v1
  })
  return uvs
}

export function positions(glyphs, layout: TextLayout) {
  const positions = new Float32Array(glyphs.length * 4 * 3)
  let i = 0

  glyphs.forEach(function (glyph) {
    const bitmap = glyph.data

    // bottom left position
    const x = glyph.position[0] + bitmap.xoffset;
    const y = glyph.position[1] - bitmap.yoffset + layout.lineHeight - 2; // TODO: Need to figure out what should be here

    // quad size
    const w = bitmap.width
    const h = bitmap.height

    // BL
    positions[i++] = x
    positions[i++] = y - h
    positions[i++] = 0;
    // BR
    positions[i++] = x + w
    positions[i++] = y - h
    positions[i++] = 0;
    // TR
    positions[i++] = x + w
    positions[i++] = y
    positions[i++] = 0;
    // TL
    positions[i++] = x
    positions[i++] = y
    positions[i++] = 0;


  })
  return positions
}
