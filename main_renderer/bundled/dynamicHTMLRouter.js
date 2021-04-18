/**
 * Is used by dynamic elements to force a route change inside angular.
 * This function forwards the function call to an event which will be captured by angular and changes the route.
 *
 * Script is included in index.html
 *
 * @param url Relative URL to go to
 */
function navigateInAngular(url) {
  const evt = new CustomEvent('navigate_in_angular', { detail: { url: url, primary: true } });
  window.dispatchEvent(evt);
}
