// ===================== SELETORES GLOBAIS =====================
const menuToggle = document.getElementById("menu-toggle");
const menuLinks = document.getElementById("menu-links");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");
const galleryImages = document.querySelectorAll(".lightbox-img");
const track = document.getElementById("carousel-track");
const dotsContainer = document.getElementById("carousel-dots");
const totalSlides = track.children.length;
let currentSlide = 0;
let autoplayInterval;
let isTransitioning = false;

// ===================== PRELOADER =====================
const preloader = document.getElementById("preloader");
const preloaderBar = document.getElementById("preloader-bar");
const preloaderPercent = document.getElementById("preloader-percent");

const allImages = document.querySelectorAll("img:not([loading='lazy'])");
const totalImages = allImages.length;
let loadedImages = 0;

function updateProgress() {
  loadedImages++;
  const percent = Math.round((loadedImages / totalImages) * 100);
  preloaderBar.style.width = percent + "%";
  preloaderPercent.textContent = percent + "%";

  if (loadedImages >= totalImages) {
    setTimeout(() => {
      preloader.classList.add("preloader-hidden");
      setTimeout(() => preloader.remove(), 600);
    }, 400);
  }
}

if (totalImages === 0) {
  preloader.remove();
} else {
  allImages.forEach((img) => {
    if (img.complete) {
      updateProgress();
    } else {
      img.addEventListener("load", updateProgress);
      img.addEventListener("error", updateProgress);
    }
  });
}

// ===================== MENU MOBILE =====================
menuToggle.addEventListener("click", () => {
  menuLinks.classList.toggle("opacity-0");
  menuLinks.classList.toggle("-translate-y-4");
  menuLinks.classList.toggle("pointer-events-none");

  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
});

const links = menuLinks.querySelectorAll("a");
links.forEach((link) => {
  link.addEventListener("click", () => {
    menuLinks.classList.add(
      "opacity-0",
      "-translate-y-4",
      "pointer-events-none",
    );
  });
});

// ===================== SCROLL ANIMATIONS (fade-in + stagger) =====================
const faders = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const staggerGroup = entry.target.closest("[data-stagger-group]");
        let delay = 0;

        if (staggerGroup) {
          const siblings = Array.from(
            staggerGroup.querySelectorAll(".fade-in"),
          );
          const index = siblings.indexOf(entry.target);
          delay = index * 100;
        }

        setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  },
);

faders.forEach((el) => observer.observe(el));

// ===================== CARROSSEL DE CRÍTICAS (autoplay + loop infinito) =====================
const firstClone = track.children[0].cloneNode(true);
track.appendChild(firstClone);

for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `Ir para avaliação ${i + 1}`);
  dot.classList.add(
    "w-2.5",
    "h-2.5",
    "rounded-full",
    "bg-bat-text-muted",
    "transition-colors",
  );
  dot.addEventListener("click", () => goToSlide(i));
  dotsContainer.appendChild(dot);
}
const dots = dotsContainer.children;

function updateDots() {
  const realIndex = currentSlide % totalSlides;
  Array.from(dots).forEach((dot, i) => {
    dot.classList.toggle("bg-bat-red-bright", i === realIndex);
    dot.classList.toggle("bg-bat-text-muted", i !== realIndex);
  });
}

function goToSlide(index) {
  isTransitioning = true;
  currentSlide = index;
  track.style.transition = "transform 0.5s ease-in-out";
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  updateDots();
}

function nextSlide() {
  if (isTransitioning) return;
  goToSlide(currentSlide + 1);
}

track.addEventListener("transitionend", () => {
  isTransitioning = false;
  if (currentSlide === totalSlides) {
    track.style.transition = "none";
    currentSlide = 0;
    track.style.transform = `translateX(0%)`;
    track.offsetHeight;
    track.style.transition = "transform 0.5s ease-in-out";
  }
});

function startAutoplay() {
  autoplayInterval = setInterval(nextSlide, 4000);
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
}

goToSlide(0);
startAutoplay();

const carousel = document.getElementById("carousel");
carousel.addEventListener("mouseenter", stopAutoplay);
carousel.addEventListener("mouseleave", startAutoplay);

// ===================== PARALLAX DO HERO =====================
const heroBg = document.getElementById("hero-bg");

function updateParallax() {
  const scrolled = window.scrollY;
  heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
}

window.addEventListener("scroll", () => {
  requestAnimationFrame(updateParallax);
});

// ===================== EFEITO DE CHUVA (Hero) =====================
const rainCanvas = document.getElementById("rain-canvas");
const ctx = rainCanvas.getContext("2d");
const heroSection = document.getElementById("hero");

const rainAngle = 0.35;

let drops = [];

function resizeCanvas() {
  rainCanvas.width = heroSection.offsetWidth;
  rainCanvas.height = heroSection.offsetHeight;
}

function createDrops() {
  const dropCount = 250;
  drops = [];
  for (let i = 0; i < dropCount; i++) {
    drops.push({
      x: Math.random() * rainCanvas.width,
      y: Math.random() * rainCanvas.height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 4 + 4,
      opacity: Math.random() * 0.3 + 0.1,
    });
  }
}

function drawRain() {
  ctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
  ctx.strokeStyle = "rgba(200, 210, 220, 0.5)";
  ctx.lineWidth = 1;

  drops.forEach((drop) => {
    ctx.globalAlpha = drop.opacity;
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x - drop.length * rainAngle, drop.y + drop.length);
    ctx.stroke();

    drop.y += drop.speed;
    drop.x -= drop.speed * rainAngle;

    if (drop.y > rainCanvas.height) {
      drop.y = -drop.length;
      drop.x = Math.random() * rainCanvas.width;
    }
  });

  requestAnimationFrame(drawRain);
}

resizeCanvas();
createDrops();
drawRain();

window.addEventListener("resize", () => {
  resizeCanvas();
  createDrops();
});

// ===================== INDICADOR DE SEÇÃO ATIVA NO MENU =====================
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll('#menu-links a[href^="#"]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const correspondingLink = document.querySelector(
        `#menu-links a[href="#${id}"]`,
      );

      if (entry.isIntersecting) {
        navLinks.forEach((link) =>
          link.classList.remove("text-bat-red-bright"),
        );
        correspondingLink.classList.add("text-bat-red-bright");
      }
    });
  },
  {
    rootMargin: "-40% 0px -40% 0px",
  },
);

sections.forEach((section) => navObserver.observe(section));

// ===================== HEADER TRANSPARENTE NO TOPO, SÓLIDO AO ROLAR =====================
const header = document.getElementById("header");

function updateHeaderBackground() {
  if (window.scrollY > 50) {
    header.classList.add("bg-bat-black/80", "backdrop-blur-sm");
  } else {
    header.classList.remove("bg-bat-black/80", "backdrop-blur-sm");
  }
}

updateHeaderBackground();
window.addEventListener("scroll", () => {
  requestAnimationFrame(updateHeaderBackground);
});

// ===================== BOTÃO VOLTAR AO TOPO =====================
const backToTopBtn = document.getElementById("back-to-top");

function toggleBackToTop() {
  if (window.scrollY > 500) {
    backToTopBtn.classList.remove(
      "opacity-0",
      "pointer-events-none",
      "translate-y-4",
    );
  } else {
    backToTopBtn.classList.add(
      "opacity-0",
      "pointer-events-none",
      "translate-y-4",
    );
  }
}

window.addEventListener("scroll", () => {
  requestAnimationFrame(toggleBackToTop);
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===================== LIGHTBOX (galeria de cenas) =====================
let currentImageIndex = 0;

function openLightbox(index) {
  currentImageIndex = index;
  const img = galleryImages[currentImageIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.remove("hidden");
  lightbox.classList.add("flex");
  requestAnimationFrame(() => {
    lightbox.classList.remove("opacity-0");
  });
}

function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  const img = galleryImages[currentImageIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
}

function showPrevImage() {
  currentImageIndex =
    (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
  const img = galleryImages[currentImageIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
}

galleryImages.forEach((img, index) => {
  img.addEventListener("click", () => openLightbox(index));
});

function closeLightbox() {
  lightbox.classList.add("opacity-0");
  setTimeout(() => {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
  }, 300);
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (lightbox.classList.contains("hidden")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") showNextImage();
  if (e.key === "ArrowLeft") showPrevImage();
});

// ===================== EFEITO DE DIGITAÇÃO (Sinopse) =====================
const terminalText = document.getElementById("synopsis-text");
const fullText = terminalText.getAttribute("data-text");
const typingSpeed = 25;

function typeWriter() {
  let i = 0;
  terminalText.textContent = "";
  const typingInterval = setInterval(() => {
    terminalText.textContent += fullText[i];
    i++;
    if (i >= fullText.length) clearInterval(typingInterval);
  }, typingSpeed);
}

const typingObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        typeWriter();
        typingObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 },
);

typingObserver.observe(terminalText);

// ===================== TRAILER SOB DEMANDA (lazy load do iframe) =====================
const trailerWrapper = document.getElementById("trailer-wrapper");

trailerWrapper.addEventListener(
  "click",
  () => {
    trailerWrapper.innerHTML = `
    <iframe class="w-full h-full" 
      src="https://www.youtube.com/embed/mqqft2x_Aa4?autoplay=1"
      title="The Batman - Trailer Oficial" 
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen>
    </iframe>
  `;
  },
  { once: true },
);

// ===================== EFEITO LANTERNA (Elenco) =====================
const castCards = document.querySelectorAll(".cast-card");

castCards.forEach((card) => {
  const overlay = card.querySelector(".lantern-overlay");

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    overlay.style.setProperty("--x", `${x}%`);
    overlay.style.setProperty("--y", `${y}%`);
  });
});

// ===================== CONTAGEM ANIMADA DAS NOTAS (Avaliações) =====================
const ratingElements = document.querySelectorAll(".rating-count");

function animateCount(el) {
  const target = parseFloat(el.getAttribute("data-target"));
  const duration = 1000;
  const startTime = performance.now();

  function updateCount(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = (progress * target).toFixed(1);
    el.textContent = `${current}/5`;

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    }
  }

  requestAnimationFrame(updateCount);
}

const ratingObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        ratingElements.forEach((el) => animateCount(el));
        ratingObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 },
);

const reviewsSection = document.getElementById("reviews");
ratingObserver.observe(reviewsSection);

// ===================== MÚSICA DE FUNDO (Web Audio API, loop sample-accurate) =====================
const musicToggle = document.getElementById("music-toggle");
const iconOff = document.getElementById("music-icon-off");
const iconOn = document.getElementById("music-icon-on");

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer = null;
let source = null;
let isPlaying = false;
let isLoaded = false;
let audioLoadStarted = false;

async function loadAudio() {
  try {
    const response = await fetch("assets/audio/trilha-corte.mp3");
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    isLoaded = true;
  } catch (err) {
    console.error("Erro ao carregar áudio:", err);
  }
}

function playLoop() {
  source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = true;
  source.connect(audioContext.destination);
  source.start(0);
  isPlaying = true;
}

function stopLoop() {
  if (source) {
    source.stop();
    source = null;
  }
  isPlaying = false;
}

musicToggle.addEventListener("click", async () => {
  // Só carrega o áudio (4MB) na primeira vez que o usuário clicar, não ao abrir a página
  if (!audioLoadStarted) {
    audioLoadStarted = true;
    await loadAudio();
  }

  if (!isLoaded) return;

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  if (isPlaying) {
    stopLoop();
    iconOn.classList.add("hidden");
    iconOff.classList.remove("hidden");
    musicToggle.setAttribute("aria-label", "Ativar música");
  } else {
    playLoop();
    iconOff.classList.add("hidden");
    iconOn.classList.remove("hidden");
    musicToggle.setAttribute("aria-label", "Desativar música");
  }
});
