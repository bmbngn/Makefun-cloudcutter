// Touch controls: virtual stick, throttle lever and action buttons.
// Built only on touch devices; on desktop this module does nothing and
// the game stays the keyboard+mouse game it was. Everything here drives
// the same input flags the keyboard sets, so the flight model is untouched.
const DEADZONE = 0.22;
const STICK_TRAVEL = 36; // knob travel in px from centre

export function createTouchUI(inputApi) {
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const touchPoints = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (!coarse && !touchPoints) return null;
  document.body.classList.add('touch');

  const input = inputApi.input;

  const ui = document.createElement('div');
  ui.id = 'touch-ui';
  ui.innerHTML = `
    <div id="touch-stick"><div class="stick-label">STICK</div><div id="touch-knob"></div></div>
    <div id="touch-throttle">
      <div class="thr-label">THR</div>
      <div id="touch-throttle-track"><div id="touch-throttle-fill"></div></div>
      <div id="touch-throttle-handle"></div>
    </div>
    <div id="touch-small-buttons">
      <button type="button" class="touch-btn" id="touch-pause" aria-label="Pause">II</button>
      <button type="button" class="touch-btn" id="touch-mute" aria-label="Sound">SOUND</button>
    </div>
    <div id="touch-buttons">
      <button type="button" class="touch-btn" id="touch-gear">GEAR</button>
      <button type="button" class="touch-btn" id="touch-brake">BRAKE</button>
    </div>`;
  document.body.appendChild(ui);
  ui.addEventListener('contextmenu', (e) => e.preventDefault());

  // ---- Virtual stick: drag to steer. Up = pitch up, right = bank right. --
  const stick = ui.querySelector('#touch-stick');
  const knob = ui.querySelector('#touch-knob');
  let stickPointer = null;

  function setStick(nx, ny) {
    const mag = Math.hypot(nx, ny);
    if (mag > 1) { nx /= mag; ny /= mag; }
    knob.style.transform = `translate(calc(-50% + ${nx * STICK_TRAVEL}px), calc(-50% + ${ny * STICK_TRAVEL}px))`;
    input.pitchUp = ny < -DEADZONE;
    input.pitchDown = ny > DEADZONE;
    input.rollRight = nx > DEADZONE;
    input.rollLeft = nx < -DEADZONE;
  }
  function resetStick() {
    stickPointer = null;
    knob.style.transform = 'translate(-50%, -50%)';
    input.pitchUp = false;
    input.pitchDown = false;
    input.rollLeft = false;
    input.rollRight = false;
  }
  function moveStick(e) {
    const r = stick.getBoundingClientRect();
    const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    setStick(nx, ny);
  }
  stick.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    stickPointer = e.pointerId;
    stick.setPointerCapture(e.pointerId);
    moveStick(e);
  });
  stick.addEventListener('pointermove', (e) => {
    if (e.pointerId !== stickPointer) return;
    moveStick(e);
  });
  stick.addEventListener('pointerup', (e) => { if (e.pointerId === stickPointer) resetStick(); });
  stick.addEventListener('pointercancel', (e) => { if (e.pointerId === stickPointer) resetStick(); });

  // ---- Throttle lever: drag up for more throttle, down for less. ----------
  // The lever sets the throttle directly and holds it where it is left.
  const thr = ui.querySelector('#touch-throttle');
  const track = ui.querySelector('#touch-throttle-track');
  const fill = ui.querySelector('#touch-throttle-fill');
  const handle = ui.querySelector('#touch-throttle-handle');
  let thrPointer = null;

  function setThrottle(clientY) {
    const r = track.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (clientY - r.top) / r.height));
    const value = 1 - frac; // top of the track is full throttle
    input.throttleSet = value;
    handle.style.top = `${frac * 100}%`;
    fill.style.height = `${value * 100}%`;
  }
  thr.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    thrPointer = e.pointerId;
    thr.setPointerCapture(e.pointerId);
    setThrottle(e.clientY);
  });
  thr.addEventListener('pointermove', (e) => {
    if (e.pointerId !== thrPointer) return;
    setThrottle(e.clientY);
  });
  thr.addEventListener('pointerup', (e) => { if (e.pointerId === thrPointer) thrPointer = null; });
  thr.addEventListener('pointercancel', (e) => { if (e.pointerId === thrPointer) thrPointer = null; });

  // ---- Action buttons ------------------------------------------------------
  function holdButton(el, on, off) {
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      el.classList.add('active');
      on();
    });
    const release = () => { el.classList.remove('active'); off(); };
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
  }
  function tapButton(el, fn) {
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      el.classList.add('active');
      setTimeout(() => el.classList.remove('active'), 150);
      fn();
    });
  }
  holdButton(
    ui.querySelector('#touch-brake'),
    () => { input.brake = true; },
    () => { input.brake = false; },
  );
  tapButton(ui.querySelector('#touch-gear'), () => { input.gearToggle = true; });
  tapButton(ui.querySelector('#touch-pause'), () => { input.pauseToggle = true; });
  tapButton(ui.querySelector('#touch-mute'), () => { input.muteToggle = true; });

  return {
    // Called when leaving play (pause, end, title): no held touch input
    // may survive into the next screen.
    reset() {
      resetStick();
      input.brake = false;
      input.throttleSet = null;
      handle.style.top = '100%';
      fill.style.height = '0%';
    },
  };
}
