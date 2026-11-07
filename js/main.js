import { config } from "./config.js";
import { initCountdown } from "./countdown.js";
import { initGallery } from "./gallery.js";
import { initWishes } from "./wishes.js";
import { initCake } from "./cake.js";
import { initMusic } from "./music.js";
import { burst, rain } from "./confetti.js";

document.addEventListener("DOMContentLoaded", () => {
  const heroName = document.getElementById("hero-name");
  const heroSub = document.getElementById("hero-sub");
  if (heroName) heroName.textContent = `${config.name} 🎉`;
  if (heroSub) heroSub.textContent = `Wishing you joy, laughter, and endless cake, ${config.name}.`;

  initCountdown();
  initGallery();
  initWishes();
  initCake();
  initMusic();

  const giftBtn = document.getElementById("gift-btn");
  const modal = document.getElementById("gift-modal");
  const modalClose = document.getElementById("gift-modal-close");
  const giftMsg = document.getElementById("gift-message");
  if (giftMsg) giftMsg.textContent = config.giftMessage;

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  };

  if (giftBtn && modal) {
    giftBtn.addEventListener("click", () => {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      burst(200);
      setTimeout(() => rain(3000), 300);
    });
  }
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  setTimeout(() => burst(80), 800);
});