import SVG_IDS from '../../../../yamls/ids.yml';

const portRegex = new RegExp('^(?:' + SVG_IDS.portID + ')(.*?)(?:-|$)', 'g');
const signalRegex = new RegExp('^(?:' + SVG_IDS.signalID + ')(.*?)(?:-|$)', 'g');
const wireRegex = new RegExp('^(?:' + SVG_IDS.wireID + ')(.*?)(?:-|$)', 'g');
const moduleRegex = new RegExp('^(?:' + SVG_IDS.moduleID + ')(.*?)(?:-|$)', 'g');

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
  return id ? getFirstGroup(portRegex, id) : false;
}

export function getSName(id: string): string | boolean {
  return id ? getFirstGroup(signalRegex, id) : false;
}

export function getWName(id: string): string | boolean {
  return id ? getFirstGroup(wireRegex, id) : false;
}

export function getModuleName(id: string): string | boolean {
  return id ? getFirstGroup(moduleRegex, id) : false;
}
