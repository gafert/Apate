/**
 * Read the custom property of body section with given name
 * @property name The element to read. E.g. "grey" to read --grey.
 */
export function readStyleProperty(name: string): string {
	const bodyStyles = window.getComputedStyle(document.body);
	return bodyStyles.getPropertyValue('--' + name);
}
