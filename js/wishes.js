import { config } from "./config.js";

export function initWishes() {
  const track = document.getElementById("wishes-track");
  const dots = document.getElementById("wishes-dots");
  if (!track || !dots) return;

  let current = 0;

  config.wishes.forEach((w, i) => {
    const card = document.createElement("div");
    card.className = "wish-card";
    const text = document.createElement("p");
    text.className = "wish-text";
    text.textContent = `"${w.text}"`;
    const from = document.createElement("p");
    from.className = "wish-from";
    from.textContent = `— ${w.from}`;
    card.appendChild(text);
    card.appendChild(from);
    track.appendChild(card);

    const dot = document.createElement("button");
    dot.className = "wish-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Wish ${i + 1}`);
    dot.addEventListener("click", () => go(i));
    dots.appendChild(dot);
  });

  function go(i) {
    current = i;
    track.style.transform = `translateX(-${i * 100}%)`;
    dots.querySelectorAll(".wish-dot").forEach((d, idx) => {
      d.classList.toggle("active", idx === i);
    });
  }

  setInterval(() => go((current + 1) % config.wishes.length), 5000);
}