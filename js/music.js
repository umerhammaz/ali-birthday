import { config } from "./config.js";

let playing = false;
let stopFn = null;

function birthdayTune() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const notes = [
    [392, 0.4], [392, 0.2], [440, 0.4], [392, 0.4], [523.25, 0.4], [493.88, 0.8],
    [392, 0.4], [392, 0.2], [440, 0.4], [392, 0.4], [587.33, 0.4], [523.25, 0.8],
    [392, 0.4], [392, 0.2], [783.99, 0.4], [659.25, 0.4], [523.25, 0.4], [493.88, 0.4], [440, 0.8],
    [698.46, 0.4], [698.46, 0.2], [659.25, 0.4], [523.25, 0.4], [587.33, 0.4], [523.25, 0.8]
  ];
  let time = ctx.currentTime + 0.05;
  notes.forEach(([freq, dur]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.15, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.95);
    osc.connect(gain).connect(ctx.destination);
    osc.start(time);
    osc.stop(time + dur);
    time += dur;
  });
  return { ctx, totalTime: time - ctx.currentTime };
}

function playUrl(url) {
  const audio = new Audio(url);
  audio.loop = true;
  audio.play();
  return () => { audio.pause(); audio.currentTime = 0; };
}

function playTune() {
  let cancelled = false;
  let timers = [];
  let lastCtx = null;

  const run = () => {
    if (cancelled) return;
    try {
      const tune = birthdayTune();
      lastCtx = tune.ctx;
      const t = setTimeout(() => { if (!cancelled) run(); }, tune.totalTime * 1000 + 500);
      timers.push(t);
    } catch (e) { /* silent */ }
  };
  run();

  return () => {
    cancelled = true;
    timers.forEach(clearTimeout);
    if (lastCtx) try { lastCtx.close(); } catch (e) {}
  };
}

export function initMusic() {
  const btn = document.getElementById("music-toggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (playing) {
      if (stopFn) stopFn();
      stopFn = null;
      playing = false;
      btn.classList.remove("playing");
      btn.textContent = "🎵";
      return;
    }
    try {
      stopFn = config.musicUrl ? playUrl(config.musicUrl) : playTune();
      playing = true;
      btn.classList.add("playing");
      btn.textContent = "🔊";
    } catch (e) {
      console.warn("Audio error:", e);
    }
  });
}