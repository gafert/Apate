/**

The MIT License (MIT)

Copyright (c) 2016-2020 Andrei Kashcha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

See https://github.com/anvaka/three.map.control.

Changes:
Removed smooth drag
Added resize event
*/


import {cumulativeOffset} from "./helper";

const eventify = require('ngraph.events');
const kinetic = require('./kinetic.js');
const animate = require('amator');

/**
 * Creates a new input controller.
 *
 * @param {Object} camera - a three.js perspective camera object.
 * @param {DOMElement+} owner - owner that should listen to mouse/keyboard/tap
 * events. This is optional, and defaults to document.body.
 *
 * @returns {Object} api for the input controller. It currently supports only one
 * method `dispose()` which should be invoked when you want to to release input
 * controller and all events.
 *
 * Consumers can listen to api's events via `api.on('change', function() {})`
 * interface. The change event will be fire every time when camera's position changed.
 */
function panzoom(camera, owner) {
	let isDragging = false;
	let panstartFired = false;
	let touchInProgress = false;
	let lastTouchTime = new Date(0);
	let smoothZoomAnimation, smoothPanAnimation;
	const panPayload = {
		dx: 0,
		dy: 0,
	};
	const zoomPayload = {
		dx: 0,
		dy: 0,
		dz: 0,
	};

	let lastPinchZoomLength;

	const mousePos = {
		x: 0,
		y: 0,
	};

	owner = owner || document.body;
	owner.setAttribute('tabindex', 1); // TODO: not sure if this is really polite

  // Makes scrolling continue when mouse up
	// const smoothScroll = kinetic(getCameraPosition, {
	// 	scrollCallback: onSmoothScroll,
	// });

	owner.addEventListener('wheel', onMouseWheel);

	const api = eventify({
		dispose: dispose,
		speed: 0.03,
		min: 0.0001,
		max: Number.POSITIVE_INFINITY,
	});

	owner.addEventListener('mousedown', handleMouseDown);
	owner.addEventListener('touchstart', onTouch);
	owner.addEventListener('keydown', onKeyDown);

  // Event fired after resize
  let offsetInWindow = cumulativeOffset(owner);
  window.addEventListener('resize', onResize)

  return api;

  function onResize(e) {
    offsetInWindow = cumulativeOffset(owner);
  }

	function onTouch(e) {
		const touchTime = new Date();
		const timeBetweenTaps = touchTime - lastTouchTime;
		lastTouchTime = touchTime;

		const touchesCount = e.touches.length;

		if (timeBetweenTaps < 400 && touchesCount === 1) {
			handleDoubleTap(e);
		} else if (touchesCount < 3) {
			handleTouch(e);
		}
	}

	function onKeyDown(e) {
		let x = 0,
			y = 0,
			z = 0;
		if (e.keyCode === 38) {
			y = 1; // up
		} else if (e.keyCode === 40) {
			y = -1; // down
		} else if (e.keyCode === 37) {
			x = 1; // left
		} else if (e.keyCode === 39) {
			x = -1; // right
		} else if (e.keyCode === 189 || e.keyCode === 109) {
			// DASH or SUBTRACT
			z = 1; // `-` -  zoom out
		} else if (e.keyCode === 187 || e.keyCode === 107) {
			// EQUAL SIGN or ADD
			z = -1; // `=` - zoom in (equal sign on US layout is under `+`)
		}
		// TODO: Keypad keycodes are missing.

		if (x || y) {
			e.preventDefault();
			e.stopPropagation();
			smoothPanByOffset(5 * x, 5 * y);
		}

		if (z) {
			smoothZoom(owner.clientWidth / 2, owner.clientHeight / 2, z);
		}
	}

	function getPinchZoomLength(finger1, finger2) {
		return (
			(finger1.clientX - finger2.clientX) * (finger1.clientX - finger2.clientX) +
			(finger1.clientY - finger2.clientY) * (finger1.clientY - finger2.clientY)
		);
	}

	function handleTouch(e) {
		e.stopPropagation();
		e.preventDefault();

		setMousePos(e.touches[0]);

		if (!touchInProgress) {
			touchInProgress = true;
			window.addEventListener('touchmove', handleTouchMove);
			window.addEventListener('touchend', handleTouchEnd);
			window.addEventListener('touchcancel', handleTouchEnd);
		}
	}

	function handleDoubleTap(e) {
		e.stopPropagation();
		e.preventDefault();

		const tap = e.touches[0];

		// smoothScroll.cancel();

		smoothZoom(tap.clientX, tap.clientY, -1);
	}

	function smoothPanByOffset(x, y) {
		if (smoothPanAnimation) {
			smoothPanAnimation.cancel();
		}

		const from = { x: x, y: y };
		const to = { x: 2 * x, y: 2 * y };
		smoothPanAnimation = animate(from, to, {
			easing: 'linear',
			duration: 200,
			step: function (d) {
				panByOffset(d.x, d.y);
			},
		});
	}

	function smoothZoom(x, y, scale) {
		const from = { delta: scale };
		const to = { delta: scale * 2 };
		if (smoothZoomAnimation) {
			smoothZoomAnimation.cancel();
		}

		smoothZoomAnimation = animate(from, to, {
			duration: 200,
			step: function (d) {
				const scaleMultiplier = getScaleMultiplier(d.delta);
				zoomTo(x, y, scaleMultiplier);
			},
		});
	}

	function handleTouchMove(e) {
		triggerPanStart();

		if (e.touches.length === 1) {
			e.stopPropagation();
			const touch = e.touches[0];

			const dx = touch.clientX - mousePos.x;
			const dy = touch.clientY - mousePos.y;

			setMousePos(touch);

			panByOffset(dx, dy);
		} else if (e.touches.length === 2) {
			// it's a zoom, let's find direction
			const t1 = e.touches[0];
			const t2 = e.touches[1];
			const currentPinchLength = getPinchZoomLength(t1, t2);

			let delta = 0;
			if (currentPinchLength < lastPinchZoomLength) {
				delta = 1;
			} else if (currentPinchLength > lastPinchZoomLength) {
				delta = -1;
			}

			const scaleMultiplier = getScaleMultiplier(delta);

			setMousePosFromTwoTouches(e);

			zoomTo(mousePos.x, mousePos.y, scaleMultiplier);

			lastPinchZoomLength = currentPinchLength;

			e.stopPropagation();
			e.preventDefault();
		}
	}

	function setMousePosFromTwoTouches(e) {
		const t1 = e.touches[0];
		const t2 = e.touches[1];
		mousePos.x = (t1.clientX + t2.clientX) / 2;
		mousePos.y = (t1.clientY + t2.clientY) / 2;
	}

	function handleTouchEnd(e) {
		if (e.touches.length > 0) {
			setMousePos(e.touches[0]);
		} else {
			touchInProgress = false;
			triggerPanEnd();
			disposeTouchEvents();
		}
	}

	function disposeTouchEvents() {
		window.removeEventListener('touchmove', handleTouchMove);
		window.removeEventListener('touchend', handleTouchEnd);
		window.removeEventListener('touchcancel', handleTouchEnd);
	}

	function getCameraPosition() {
		return camera.position;
	}

	function onSmoothScroll(x, y) {
		camera.position.x = x;
		camera.position.y = y;

		api.fire('change');
	}

	function handleMouseDown(e) {
		isDragging = true;
		setMousePos(e);

		window.addEventListener('mouseup', handleMouseUp, true);
		window.addEventListener('mousemove', handleMouseMove, true);
	}

	function handleMouseUp() {
		disposeWindowEvents();
		isDragging = false;

		triggerPanEnd();
	}

	function setMousePos(e) {
		mousePos.x = e.clientX;
		mousePos.y = e.clientY;
	}

	function handleMouseMove(e) {
		if (!isDragging) return;

		triggerPanStart();

		const dx = e.clientX - mousePos.x;
		const dy = e.clientY - mousePos.y;

		panByOffset(dx, dy);

		setMousePos(e);
	}

	function triggerPanStart() {
		if (!panstartFired) {
			api.fire('panstart');
			panstartFired = true;
			// smoothScroll.start();
		}
	}

	function triggerPanEnd() {
		if (panstartFired) {
			// smoothScroll.stop();
			api.fire('panend');
			panstartFired = false;
		}
	}

	function disposeWindowEvents() {
		window.removeEventListener('mouseup', handleMouseUp, true);
		window.removeEventListener('mousemove', handleMouseMove, true);
    window.removeEventListener('resize', onResize);
	}

	function dispose() {
		owner.removeEventListener('wheel', onMouseWheel);
		disposeWindowEvents();
		disposeTouchEvents();

		// smoothScroll.cancel();
		triggerPanEnd();

		owner.removeEventListener('mousedown', handleMouseDown);
		owner.removeEventListener('touchstart', onTouch);
		owner.removeEventListener('keydown', onKeyDown);
	}

	function panByOffset(dx, dy) {
		const currentScale = getCurrentScale();

		panPayload.dx = -dx / currentScale;
		panPayload.dy = dy / currentScale;

		// we fire first, so that clients can manipulate the payload
		api.fire('beforepan', panPayload);

		camera.position.x += panPayload.dx;
		camera.position.y += panPayload.dy;

		api.fire('change');
	}

	function onMouseWheel(e) {
		const scaleMultiplier = getScaleMultiplier(e.deltaY);

		const mouse = {};
    mouse.x = (e.clientX - offsetInWindow.left);
    mouse.y = (e.clientY - offsetInWindow.top);
		// smoothScroll.cancel();
		zoomTo(mouse.x, mouse.y, scaleMultiplier);
	}

	function zoomTo(offsetX, offsetY, scaleMultiplier) {
		const currentScale = getCurrentScale();

		const dx = (offsetX - owner.clientWidth / 2) / currentScale;
		const dy = (offsetY - owner.clientHeight / 2) / currentScale;

		const newZ = camera.position.z * scaleMultiplier;
		if (newZ < api.min || newZ > api.max) {
			return;
		}

		zoomPayload.dz = newZ - camera.position.z;
		zoomPayload.dx = -(scaleMultiplier - 1) * dx;
		zoomPayload.dy = (scaleMultiplier - 1) * dy;

		api.fire('beforezoom', zoomPayload);

		camera.position.z += zoomPayload.dz;
		camera.position.x -= (scaleMultiplier - 1) * dx;
		camera.position.y += (scaleMultiplier - 1) * dy;

		api.fire('change');
	}

	function getCurrentScale() {
		// TODO: This is the only code that depends on camera. Extract?
		const vFOV = (camera.fov * Math.PI) / 180;
		const height = 2 * Math.tan(vFOV / 2) * camera.position.z;
		const currentScale = owner.clientHeight / height;

		return currentScale;
	}

	function getScaleMultiplier(delta) {
		let scaleMultiplier = 1;
		if (delta > 10) {
			delta = 10;
		} else if (delta < -10) {
			delta = -10;
		}
		scaleMultiplier = 1 + api.speed * delta;

		return scaleMultiplier;
	}
}

export default panzoom;
