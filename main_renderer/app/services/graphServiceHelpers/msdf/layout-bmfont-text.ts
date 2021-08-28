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



*/

import * as wordWrap from './word-wrapper'

const X_HEIGHTS = ['x', 'e', 'a', 'o', 'n', 's', 'r', 'c', 'u', 'm', 'v', 'w', 'z']
const M_WIDTHS = ['m', 'w']
const CAP_HEIGHTS = ['H', 'I', 'N', 'E', 'F', 'K', 'L', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

const TAB_ID = '\t'.charCodeAt(0)
const SPACE_ID = ' '.charCodeAt(0)
const ALIGN_LEFT = 0,
  ALIGN_CENTER = 1,
  ALIGN_RIGHT = 2

export class TextLayout {
  public width: any;
  public xHeight: number;
  public lineHeight: number;P
  public ascender: number;
  public capHeight: any;
  public baseline: any;
  public descender: number;
  public linesTotal: any;
  public fallbackSpaceGlyph: null;
  public fallbackTabGlyph: null;
  public height: number;
  public glyphs: any[] = [];
  public font: any;
  public align: number;
  public letterSpacing: number;

  constructor(public opt) {
    this.update(opt)
  }

  update(opt) {
    this.opt.measure = this.computeMetrics.bind(this)
    this.opt.tabSize = TextLayout.numtype(this.opt.tabSize, 4)

    if (!opt.font)
      throw new Error('must provide a valid bitmap font')

    const text = opt.text || ''
    this.font = opt.font

    this.setupSpaceGlyphs()

    const lines = wordWrap.lines(text, opt)

    const minWidth = opt.width || 0

    //clear glyphs
    this.glyphs.length = 0

    //get max line width
    const maxLineWidth = lines.reduce(function (prev, line) {
      return Math.max(prev, line.width, minWidth)
    }, 0)

    //the pen position
    let x = 0
    let y = 0


    this.lineHeight = TextLayout.numtype(opt.lineHeight, this.font.common.lineHeight)
    this.baseline = this.font.common.base
    this.letterSpacing = opt.letterSpacing || 0
    this.align = TextLayout.getAlignType(this.opt.align)
    this.width = maxLineWidth;
    this.descender = this.lineHeight - this.baseline
    this.height = this.lineHeight * lines.length - this.descender
    this.xHeight = this.getXHeight()
    this.capHeight = this.getCapHeight()
    this.ascender = this.lineHeight - this.descender - this.xHeight

    //draw text along baseline
    y -= this.height

    //layout each glyph
    lines.forEach((line, lineIndex) => {
      const start = line.start
      const end = line.end
      const lineWidth = line.width
      let lastGlyph

      //for each glyph in that line...
      for (let i = start; i < end; i++) {
        const id = text.charCodeAt(i)
        const glyph = this.getGlyph(id)

        if (glyph) {
          if (lastGlyph)
            x += this.getKerning(lastGlyph.id, glyph.id)

          let tx = x
          if (this.align === ALIGN_CENTER)
            tx += (maxLineWidth - lineWidth) / 2
          else if (this.align === ALIGN_RIGHT)
            tx += (maxLineWidth - lineWidth)

          this.glyphs.push({
            position: [tx, y],
            data: glyph,
            index: i,
            line: lineIndex
          })

          //move pen forward
          x += glyph.xadvance + this.letterSpacing


          lastGlyph = glyph
        }
      }

      //next line down
      y += this.lineHeight
      x = 0
    })
    this.linesTotal = lines.length;
  }

  setupSpaceGlyphs() {
    //These are fallbacks, when the font doesn't include
    //' ' or '\t' glyphs
    this.fallbackSpaceGlyph = null
    this.fallbackTabGlyph = null

    if (!this.font.chars || this.font.chars.length === 0)
      return

    //try to get space glyph
    //then fall back to the 'm' or 'w' glyphs
    //then fall back to the first glyph available
    const space = this.getGlyphById(SPACE_ID)
      || this.getMGlyph()
      || this.font.chars[0]

    //and create a fallback for tab
    const tabWidth = this.opt.tabSize * space.xadvance
    this.fallbackSpaceGlyph = space
    this.fallbackTabGlyph = {
      ...space,
      x: 0, y: 0, xadvance: tabWidth, id: TAB_ID,
      xoffset: 0, yoffset: 0, width: 0, height: 0
    }
  }

  getGlyph(id) {
    const glyph = this.getGlyphById(id)
    if (glyph)
      return glyph
    else if (id === TAB_ID)
      return this.fallbackTabGlyph
    else if (id === SPACE_ID)
      return this.fallbackSpaceGlyph
    return null
  }

  computeMetrics(text, start, end, width) {
    const letterSpacing = this.opt.letterSpacing || 0
    let curPen = 0
    let curWidth = 0
    let count = 0
    let lastGlyph

    if (!this.font.chars || this.font.chars.length === 0) {
      return {
        start: start,
        end: start,
        width: 0
      }
    }

    end = Math.min(text.length, end)
    for (let i = start; i < end; i++) {
      const id = text.charCodeAt(i)
      const glyph = this.getGlyph(id)

      if (glyph) {
        //move pen forward
        const xoff = glyph.xoffset
        const kern = lastGlyph ? this.getKerning(lastGlyph.id, glyph.id) : 0
        curPen += kern

        const nextPen = curPen + glyph.xadvance + letterSpacing
        const nextWidth = curPen + glyph.width

        //we've hit our limit; we can't move onto the next glyph
        if (nextWidth >= width || nextPen >= width)
          break

        //otherwise continue along our line
        curPen = nextPen
        curWidth = nextWidth
        lastGlyph = glyph
      }
      count++
    }

    //make sure rightmost edge lines up with rendered glyphs
    if (lastGlyph)
      curWidth += lastGlyph.xoffset

    return {
      start: start,
      end: start + count,
      width: curWidth
    }
  }

  getGlyphById(id) {
    if (!this.font.chars || this.font.chars.length === 0)
      return null

    const glyphIdx = TextLayout.findChar(this.font.chars, id)
    if (glyphIdx >= 0)
      return this.font.chars[glyphIdx]
    return null
  }

  getXHeight() {
    for (let i = 0; i < X_HEIGHTS.length; i++) {
      const id = X_HEIGHTS[i].charCodeAt(0)
      const idx = TextLayout.findChar(this.font.chars, id)
      if (idx >= 0)
        return this.font.chars[idx].height
    }
    return 0
  }

  getMGlyph() {
    for (let i = 0; i < M_WIDTHS.length; i++) {
      const id = M_WIDTHS[i].charCodeAt(0)
      const idx = TextLayout.findChar(this.font.chars, id)
      if (idx >= 0)
        return this.font.chars[idx]
    }
    return 0
  }

  getCapHeight() {
    for (let i = 0; i < CAP_HEIGHTS.length; i++) {
      const id = CAP_HEIGHTS[i].charCodeAt(0)
      const idx = TextLayout.findChar(this.font.chars, id)
      if (idx >= 0)
        return this.font.chars[idx].height
    }
    return 0
  }

  public getKerning(left, right) {
    if (!this.font.kernings || this.font.kernings.length === 0)
      return 0

    const table = this.font.kernings
    for (let i = 0; i < table.length; i++) {
      const kern = table[i]
      if (kern.first === left && kern.second === right)
        return kern.amount
    }
    return 0
  }

  public getKerningOfChars(left: string, right: string) {
    if (!this.font.kernings || this.font.kernings.length === 0)
      return 0

    const leftId = this.getGlyph(left.charCodeAt(0))
    const rightId = this.getGlyph(right.charCodeAt(0))

    const table = this.font.kernings
    for (let i = 0; i < table.length; i++) {
      const kern = table[i]
      if (kern.first === leftId && kern.second === rightId)
        return kern.amount
    }
    return 0
  }

  static getAlignType(align) {
    if (align === 'center')
      return ALIGN_CENTER
    else if (align === 'right')
      return ALIGN_RIGHT
    return ALIGN_LEFT
  }

  static findChar(array, value, start = 0) {
    for (let i = start; i < array.length; i++) {
      if (array[i].id === value) {
        return i
      }
    }
    return -1
  }

  static numtype(num, def) {
    return typeof num === 'number' ? num : (typeof def === 'number' ? def : 0)
  }

}
