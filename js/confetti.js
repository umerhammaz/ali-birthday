const canvas = document.getElementById("confetti-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;
let particles = [];
let animating = false;

const COLORS = ["#ffc107", "#ff6b6b", "#4dabf7", "#b197fc", "#f783ac", "#51cf66", "#ffffff"];

function resize() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
if (canvas) {
  resize();
  window.addEventListener("resize", resize);
}

function createParticle(x, y) {
  return {
    x, y,
    vx: (Math.random() - 0.5) * 12,
    vy: Math.random() * -14 - 4,
    size: Math.random() * 8 + 4,
    color: COLORS[(Math.random() * COLORS.length) | 0],
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.3,
    life: 1,
    decay: 0.008 + Math.random() * 0.006
  };
}

function loop() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let alive = false;
  for (const p of particles) {
    p.vy += 0.35;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= p.decay;
    if (p.life > 0) alive = true;
    ctx.save();
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  }
  particles = particles.filter((p) => p.life > 0);
  if (alive) requestAnimationFrame(loop);
  else animating = false;
}

export function burst(count = 120, origin) {
  if (!canvas) return;
  const ox = origin && origin.x != null ? origin.x : canvas.width / 2;
  const oy = origin && origin.y != null ? origin.y : canvas.height / 2;
  for (let i = 0; i < count; i++) particles.push(createParticle(ox, oy));
  if (!animating) { animating = true; loop(); }
}

export function rain(duration = 2500) {
  if (!canvas) return;
  const start = Date.now();
  const iv = setInterval(() => {
    if (Date.now() - start > duration) { clearInterval(iv); return; }
    for (let i = 0; i < 6; i++) {
      const p = createParticle(Math.random() * canvas.width, -10);
      p.vy = Math.random() * 4 + 2;
      particles.push(p);
    }
    if (!animating) { animating = true; loop(); }
  }, 60);
}