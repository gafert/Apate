/**
 *
 * Matt DesLauriers
 *
 * MIT, see [LICENSE.md](http://github.com/mattdesl/word-wrapper/blob/master/LICENSE.md) for details.
 *
 */

const newline = /\n/
const newlineChar = '\n'
const whitespace = /\s/

interface WordWrapperInterface {
  mode: 'pre' | 'nowrap' | 'greedy';
  width: number;
  start: number;
  end: number;
  measure: (text: string, start: number, end: number, width: number) => { start: number; end: number };
}


function idxOf(text, chr, start, end) {
  const idx = text.indexOf(chr, start)
  if (idx === -1 || idx > end)
    return end
  return idx
}

function isWhitespace(chr) {
  return whitespace.test(chr)
}

function pre(measure, text, start, end, width) {
  const lines = []
  let lineStart = start
  for (let i = start; i < end && i < text.length; i++) {
    const chr = text.charAt(i)
    const isNewline = chr.includes("\n")

    //If we've reached a newline, then step down a line
    //Or if we've reached the EOF
    if (isNewline || i === end - 1) {
      const lineEnd = isNewline ? i : i + 1
      const measured = measure(text, lineStart, lineEnd, width)
      lines.push(measured)

      lineStart = i + 1
    }
  }
  return lines
}

function greedy(measure, text, start, end, width, mode) {
  //A greedy word wrapper based on LibGDX algorithm
  //https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/BitmapFontCache.java
  const lines = []

  let testWidth = width
  //if 'nowrap' is specified, we only wrap on newline chars
  if (mode === 'nowrap')
    testWidth = Number.MAX_VALUE


  while (start < end && start < text.length) {
    //get next newline position
    const newLine = idxOf(text, newlineChar, start, end)

    //eat whitespace at start of line
    while (start < newLine) {
      if (!isWhitespace(text.charAt(start)))
        break
      start++
    }

    //determine visible # of glyphs for the available width
    const measured = measure(text, start, newLine, testWidth)

    let lineEnd = start + (measured.end - measured.start)
    let nextStart = lineEnd + newlineChar.length

    //if we had to cut the line before the next newline...
    if (lineEnd < newLine) {
      //find char to break on
      while (lineEnd > start) {
        if (isWhitespace(text.charAt(lineEnd)))
          break
        lineEnd--
      }
      if (lineEnd === start) {
        if (nextStart > start + newlineChar.length) nextStart--
        lineEnd = nextStart // If no characters to break, show all.
      } else {
        nextStart = lineEnd
        //eat whitespace at end of line
        while (lineEnd > start) {
          if (!isWhitespace(text.charAt(lineEnd - newlineChar.length)))
            break
          lineEnd--
        }
      }
    }
    if (lineEnd >= start) {
      const result = measure(text, start, lineEnd, testWidth)
      lines.push(result)
    }
    start = nextStart
  }
  return lines
}

//determines the visible number of glyphs within a given width
function monospace(text, start, end, width) {
  const glyphs = Math.min(width, end - start)
  return {
    start: start,
    end: start + glyphs
  }
}

export function lines(text, opt: WordWrapperInterface) {
  opt = opt || {} as WordWrapperInterface

  //zero width results in nothing visible
  if (opt.width === 0 && opt.mode !== 'nowrap')
    return []

  text = text || ''
  const width = typeof opt.width === 'number' ? opt.width : Number.MAX_VALUE
  const start = Math.max(0, opt.start || 0)
  const end = typeof opt.end === 'number' ? opt.end : text.length
  const mode = opt.mode


  const measure = opt.measure || monospace
  if (mode === 'pre')
    return pre(measure, text, start, end, width)
  else
    return greedy(measure, text, start, end, width, mode)
}

export function wordWrap(text, opt) {
  const liness = lines(text, opt)
  return liness.map(function (line) {
    return text.substring(line.start, line.end)
  }).join('\n')
}

