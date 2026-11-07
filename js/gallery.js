import { config } from "./config.js";

export function initGallery() {
  const grid = document.getElementById("gallery-grid");
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbClose = document.getElementById("lightbox-close");
  if (!grid) return;

  config.photos.forEach((src, i) => {
    const item = document.createElement("div");
    item.className = "gallery-item";
    const img = document.createElement("img");
    img.src = src;
    img.alt = `${config.name} photo ${i + 1}`;
    img.loading = "lazy";
    img.onerror = () => {
      img.remove();
      const fb = document.createElement("div");
      fb.className = "gallery-fallback";
      fb.textContent = config.name[0];
      item.appendChild(fb);
    };
    item.appendChild(img);
    item.addEventListener("click", () => {
      if (!item.querySelector("img")) return;
      lbImg.src = src;
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
    });
    grid.appendChild(item);
  });

  const close = () => {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
  };
  if (lbClose) lbClose.addEventListener("click", close);
  if (lb) lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}