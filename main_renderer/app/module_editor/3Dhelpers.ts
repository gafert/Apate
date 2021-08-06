export function setUVofVertex(minX, maxX, minY, maxY, vertexArray) {
  const uv = [];

  function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  let vertMinX = Infinity, vertMaxX = -Infinity, vertMinY = Infinity, vertMaxY = -Infinity;
  for (let index = 0; index < vertexArray.length; index = index + 3) {
    const x = vertexArray[index];
    const y = vertexArray[index + 1];
    const z = vertexArray[index + 2];
    if (x < vertMinX) vertMinX = x;
    if (x > vertMaxX) vertMaxX = x;
    if (y < vertMinY) vertMinY = y;
    if (y > vertMaxY) vertMaxY = y;
  }

  for (let index = 0; index < vertexArray.length; index = index + 3) {
    const x = vertexArray[index];
    const y = vertexArray[index + 1];
    const z = vertexArray[index + 2];
    uv.push(map(x, vertMinX, vertMaxX, minX, maxX))
    uv.push(map(y, vertMinY, vertMaxY, minY, maxY))
  }

  return uv;
}

export function triangleLeftBottom(width = 1, height = 1, offsetX = 0, offsetY = 0, offsetZ = 0) {
  return [
    0.0 + offsetX, 0.0 + offsetY, 0.0 + offsetZ,
    0.0 + offsetX, -height + offsetY, 0.0 + offsetZ,
    width + offsetX, -height + offsetY, 0.0 + offsetZ,
  ];
}

export function triangleLeftTop(width = 1, height = 1, offsetX = 0, offsetY = 0, offsetZ = 0) {
  return [
    0.0 + offsetX, -height + offsetY, 0.0 + offsetZ,
    width + offsetX, 0 + offsetY, 0.0 + offsetZ,
    0.0 + offsetX, 0 + offsetY, 0.0 + offsetZ,
  ];
}

export function triangleRightTop(width = 1, height = 1, offsetX = 0, offsetY = 0, offsetZ = 0) {
  return [
    0.0 + offsetX, 0 + offsetY, 0.0 + offsetZ,
    width + offsetX, -height + offsetY, 0.0 + offsetZ,
    width + offsetX, 0 + offsetY, 0.0 + offsetZ,
  ];
}

export function makeBox(width = 1, height = 1, offsetX = 0, offsetY = 0, offsetZ = 0) {
  return [
    ...triangleRightTop(width, height, offsetX, offsetY, offsetZ),
    ...triangleLeftBottom(width, height, offsetX, offsetY, offsetZ),
  ];
}