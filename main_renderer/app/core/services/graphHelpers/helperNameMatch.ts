/**
 * Get the first matched group of a regex
 * @param regexp The regex element to match
 * @param str The string to test
 */
export function getFirstGroup(regexp: RegExp, str) {
  return Array.from(str.matchAll(regexp), m => m[1])[0];
}

/**
 * Match "p_portname-svgid" and return "portname". See https://regex101.com/r/2cTVd5/1/
 * @param id String to match
 */
export function getPortName(id: string): string | boolean {
  const regex = /^(?:p_)(.*?)(?:-|$)/g;
  return id ? getFirstGroup(regex, id) : false;
}

export function getSName(id: string): string | boolean {
  const regex = /^(?:s_)(.*?)(?:-|$)/g;
  return id ? getFirstGroup(regex, id) : false;
}

export function getWName(id: string): string | boolean {
  const regex = /^(?:w_)(.*?)(?:-|$)/g;
  return id ? getFirstGroup(regex, id) : false;
}

export function getModuleName(id: string): string | boolean {
  const regex = /^(?:m_)(.*?)(?:-|$)/g;
  return id ? getFirstGroup(regex, id) : false;
}
