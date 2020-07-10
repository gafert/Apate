/**
 * Allows smooth kinetic scrolling of the surface
 */

function kinetic(getPointCallback, options) {
	options = options || {};

	const minVelocity = options.minVelocity || 10;
	const amplitude = options.amplitude || 0.42;
	const trackerSpeed = options.trackerSpeed || 100;
	const scrollCallback = options.scrollCallback || noop;

	const lastPoint = { x: 0, y: 0 };
	let timestamp;
	const timeConstant = 342;

	let ticker;
	let vx, targetX, ax;
	let vy, targetY, ay;

	let raf;

	return {
		start: start,
		stop: stop,
		cancel: cancel,
		isStarted: isStarted,
	};

	function isStarted() {
		return ticker !== 0;
	}

	function cancel() {
		window.clearInterval(ticker);
		window.cancelAnimationFrame(raf);
	}

	function start() {
		setInternalLastPoint(getPointCallback());

		ax = ay = vx = vy = 0;
		timestamp = new Date();

		window.clearInterval(ticker);
		window.cancelAnimationFrame(raf);

		ticker = window.setInterval(trackPointMovement, trackerSpeed);
	}

	function trackPointMovement() {
		const now = Date.now();
		const elapsed = now - timestamp;
		timestamp = now;

		const point = getPointCallback();

		const dx = point.x - lastPoint.x;
		const dy = point.y - lastPoint.y;

		setInternalLastPoint(point);

		const dt = 1000 / (1 + elapsed);

		// moving average
		vx = 0.8 * dx * dt + 0.2 * vx;
		vy = 0.8 * dy * dt + 0.2 * vy;
	}

	function setInternalLastPoint(p) {
		lastPoint.x = p.x;
		lastPoint.y = p.y;
	}

	function stop() {
		window.clearInterval(ticker);
		window.cancelAnimationFrame(raf);
		ticker = 0;

		const point = getPointCallback();

		targetX = point.x;
		targetY = point.y;
		timestamp = Date.now();

		if (vx < -minVelocity || vx > minVelocity) {
			ax = amplitude * vx;
			targetX += ax;
		}

		if (vy < -minVelocity || vy > minVelocity) {
			ay = amplitude * vy;
			targetY += ay;
		}

		raf = window.requestAnimationFrame(autoScroll);
	}

	function autoScroll() {
		const elapsed = Date.now() - timestamp;

		let moving = false;
		let dx = 0;
		let dy = 0;

		if (ax) {
			dx = -ax * Math.exp(-elapsed / timeConstant);

			if (dx > 0.5 || dx < -0.5) moving = true;
			else dx = ax = 0;
		}

		if (ay) {
			dy = -ay * Math.exp(-elapsed / timeConstant);

			if (dy > 0.5 || dy < -0.5) moving = true;
			else dy = ay = 0;
		}

		if (moving) {
			scrollCallback(targetX + dx, targetY + dy);
			raf = window.requestAnimationFrame(autoScroll);
		}
	}
}

function noop() {}

module.exports = kinetic;
