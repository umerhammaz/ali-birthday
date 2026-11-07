import { config } from "./config.js";

export function initCountdown() {
  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins: document.getElementById("cd-mins"),
    secs: document.getElementById("cd-secs"),
    msg: document.getElementById("countdown-msg")
  };
  if (!els.days) return;

  const target = new Date(config.birthday);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const bday = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  let next = new Date(bday);
  if (bday < today) next.setFullYear(today.getFullYear() + 1);

  const pad = (n) => String(n).padStart(2, "0");

  function tick() {
    const diff = next - new Date();
    if (diff <= 0) {
      els.days.textContent = els.hours.textContent = els.mins.textContent = els.secs.textContent = "00";
      els.msg.textContent = `It's ${config.name}'s birthday today! 🎉`;
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    els.days.textContent = pad(d);
    els.hours.textContent = pad(h);
    els.mins.textContent = pad(m);
    els.secs.textContent = pad(s);
    if (bday.getTime() === today.getTime()) {
      els.msg.textContent = `It's ${config.name}'s birthday today! 🎉`;
    }
  }

  tick();
  setInterval(tick, 1000);
}