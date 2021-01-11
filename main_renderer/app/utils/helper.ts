/**
 * Read the custom property of body section with given name
 * @property name The element to read. E.g. "grey" to read --grey.
 */
export function readStyleProperty(name: string): string {
  const bodyStyles = window.getComputedStyle(document.body);
  return bodyStyles.getPropertyValue('--' + name);
}

// Only add setZeroTimeout to the window object, and hide everything
// else in a closure.
const timeouts = [];
const messageName = 'zero-timeout-message';

// Like setTimeout, but only takes a function argument.  There's
// no time argument (always zero) and no arguments (you have to
// use a closure).
export function setZeroTimeout(fn) {
  timeouts.push(fn);
  window.postMessage(messageName, '*');
}

function handleMessage(event) {
  if (event.source == window && event.data == messageName) {
    event.stopPropagation();
    if (timeouts.length > 0) {
      const fn = timeouts.shift();
      fn();
    }
  }
}

window.addEventListener('message', handleMessage, true);
