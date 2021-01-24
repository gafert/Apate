function navigateInAngular(url) {
  const evt = new CustomEvent('navigate_in_angular', { detail: { url: url, primary: true } });
  window.dispatchEvent(evt);
}
