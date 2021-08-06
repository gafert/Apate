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
 */


var itemSize = 2
var box = { min: [0, 0], max: [0, 0] }

function bounds (positions) {
  var count = positions.length / itemSize
  box.min[0] = positions[0]
  box.min[1] = positions[1]
  box.max[0] = positions[0]
  box.max[1] = positions[1]

  for (var i = 0; i < count; i++) {
    var x = positions[i * itemSize + 0]
    var y = positions[i * itemSize + 1]
    box.min[0] = Math.min(x, box.min[0])
    box.min[1] = Math.min(y, box.min[1])
    box.max[0] = Math.max(x, box.max[0])
    box.max[1] = Math.max(y, box.max[1])
  }
}

module.exports.computeBox = function (positions, output) {
  bounds(positions)
  output.min.set(box.min[0], box.min[1], 0)
  output.max.set(box.max[0], box.max[1], 0)
}

module.exports.computeSphere = function (positions, output) {
  bounds(positions)
  var minX = box.min[0]
  var minY = box.min[1]
  var maxX = box.max[0]
  var maxY = box.max[1]
  var width = maxX - minX
  var height = maxY - minY
  var length = Math.sqrt(width * width + height * height)
  output.center.set(minX + width / 2, minY + height / 2, 0)
  output.radius = length / 2
}
