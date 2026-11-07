import { config } from "./config.js";
import { burst } from "./confetti.js";

let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function whoosh() {
  try {
    const ctx = getCtx();
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.4), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    const gain = ctx.createGain();
    gain.gain.value = 0.3;
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start();
  } catch (e) { /* silent */ }
}

export function initCake() {
  const candles = document.querySelectorAll(".candle");
  const msg = document.getElementById("cake-msg");
  if (!candles.length || !msg) return;
  let outCount = 0;

  candles.forEach((c) => {
    c.addEventListener("click", () => {
      if (c.classList.contains("out")) return;
      c.classList.add("out");
      whoosh();
      outCount++;
      if (outCount === candles.length) {
        msg.textContent = `Make a Wish, ${config.name}! ✨`;
        burst(180);
        setTimeout(() => burst(120), 400);
      }
    });
  });
}