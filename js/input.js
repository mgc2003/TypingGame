// Keyboard input. Events are queued by the browser and handed to the game one fixed step at a time.
// Movement/menu "actions" use physical key codes (so WASD works on any layout);
// text-entry scenes read the raw event queue and use event.key instead.

const ACTIONS = {
  up: ['ArrowUp', 'KeyW'],
  down: ['ArrowDown', 'KeyS'],
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
  confirm: ['KeyZ', 'Enter', 'NumpadEnter', 'KeyE'],
  cancel: ['KeyX', 'Escape', 'ShiftLeft', 'ShiftRight'],
  pause: ['Escape'],
};

const held = new Set();
let queue = [];
let events = [];
const listeners = [];

function onKeyDown(e) {
  const mod = e.ctrlKey || e.metaKey || e.altKey;
  // Keep browser shortcuts (copy, reload, devtools...) working, but stop the page from
  // scrolling, opening quick-find, or navigating back while playing.
  if (!mod && !/^F\d+$/.test(e.key) && e.key !== 'Tab') e.preventDefault();
  if (mod && e.key === 'Backspace') e.preventDefault();
  held.add(e.code);
  queue.push({
    key: e.key,
    code: e.code,
    repeat: e.repeat,
    ctrl: e.ctrlKey || e.metaKey,
    alt: e.altKey,
    time: performance.now(),
  });
  for (const fn of listeners) fn(e);
}

function onKeyUp(e) {
  held.delete(e.code);
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', () => held.clear());
}

export const input = {
  /** Called once per fixed update: moves queued key events into this step's event list. */
  beginFrame() {
    events = queue;
    queue = [];
  },
  /** Raw key events for this step (for text entry). */
  get events() {
    return events;
  },
  /** True if an action key went down this step. Repeats are ignored unless allowRepeat. */
  pressed(action, allowRepeat = false) {
    const codes = ACTIONS[action];
    return events.some((ev) => codes.includes(ev.code) && !ev.ctrl && !ev.alt && (allowRepeat || !ev.repeat));
  },
  held(action) {
    return ACTIONS[action].some((c) => held.has(c));
  },
  /** Drop everything queued (used when switching scenes so keys don't leak through). */
  flush() {
    queue = [];
    events = [];
  },
  onAnyKey(fn) {
    listeners.push(fn);
  },
};
