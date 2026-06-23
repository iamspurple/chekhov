const header = document.querySelector(".header");
const hero = document.querySelector(".hero");

new IntersectionObserver(
  function (entries) {
    header.classList.toggle("dark", !entries[0].isIntersecting);
  },
  { threshold: 0.15 },
).observe(hero);

function formatDate(value) {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  return d + "." + m + "." + y;
}

document.getElementById("checkin").addEventListener("change", function () {
  document.getElementById("checkin-display").textContent = formatDate(
    this.value,
  );
});

document.getElementById("checkout").addEventListener("change", function () {
  document.getElementById("checkout-display").textContent = formatDate(
    this.value,
  );
});

const phoneInput1 = document.getElementById("phone-1");
const phoneInput2 = document.getElementById("phone-2");

if (phoneInput1) {
  IMask(phoneInput1, {
    mask: "+{7}(000)000-00-00",
    lazy: false,
  });
}

if (phoneInput2) {
  IMask(phoneInput2, {
    mask: "+{7}(000)000-00-00",
    lazy: false,
  });
}

document.querySelectorAll(".rooms-tab").forEach(function (tab) {
  tab.addEventListener("click", function () {
    document.querySelectorAll(".rooms-tab").forEach(function (t) {
      t.classList.remove("active");
    });
    this.classList.add("active");
  });
});

const roomsSlides = [
  {
    name: "Стандарт",
    image: "/assets/images/room-1.png",
    area: "59 м<sup>2</sup>",
    price: "20 117",
    facility1: [
      { icon: "bed.svg", text: "1 большая кровать" },
      { icon: "balcony.svg", text: "Балкон" },
      { icon: "shower.svg", text: "Душ" },
    ],
    facility2: [
      { icon: "wifi.svg", text: "Бесплатный Wi-Fi" },
      { icon: "safe.svg", text: "Сейф" },
      { icon: "wine.svg", text: "Бар" },
    ],
  },
  {
    name: "Стандарт",
    image: "/assets/images/room-2.png",
    area: "45 м<sup>2</sup>",
    price: "17 490",
    facility1: [
      { icon: "bed.svg", text: "2 кровати" },
      { icon: "ac.svg", text: "Кондиционер" },
      { icon: "shower.svg", text: "Душ" },
    ],
    facility2: [
      { icon: "wifi.svg", text: "Бесплатный Wi-Fi" },
      { icon: "safe.svg", text: "Сейф" },
      { icon: "tv.svg", text: "ТВ" },
    ],
  },
  {
    name: "Стандарт",
    image: "/assets/images/room-1.png",
    area: "52 м<sup>2</sup>",
    price: "19 250",
    facility1: [
      { icon: "bed.svg", text: "1 большая кровать" },
      { icon: "balcony.svg", text: "Балкон" },
      { icon: "bathrobe.svg", text: "Халат" },
    ],
    facility2: [
      { icon: "wifi.svg", text: "Бесплатный Wi-Fi" },
      { icon: "wine.svg", text: "Бар" },
      { icon: "telephone.svg", text: "Телефон" },
    ],
  },
  {
    name: "Стандарт",
    image: "/assets/images/room-2.png",
    area: "48 м<sup>2</sup>",
    price: "18 300",
    facility1: [
      { icon: "bed.svg", text: "1 большая кровать" },
      { icon: "shower.svg", text: "Душ" },
      { icon: "hairdryer.svg", text: "Фен" },
    ],
    facility2: [
      { icon: "wifi.svg", text: "Бесплатный Wi-Fi" },
      { icon: "safe.svg", text: "Сейф" },
      { icon: "mirror.svg", text: "Зеркало" },
    ],
  },
];

const roomsSlideMainImg = document.getElementById("rooms-slide-main-img");
const roomsSlideMainName = document.getElementById("rooms-slide-main-name");
const roomsSlideNextImg = document.getElementById("rooms-slide-next-img");
const roomsSlideNextName = document.getElementById("rooms-slide-next-name");
const roomsSlideArea = document.getElementById("rooms-slide-area");
const roomsSlidePrice = document.getElementById("rooms-slide-price");
const roomsSlideFacility1 = document.getElementById("rooms-slide-facility-1");
const roomsSlideFacility2 = document.getElementById("rooms-slide-facility-2");
const roomsPrevBtn = document.querySelector(".rooms-slider-btn.prev");
const roomsNextBtn = document.querySelector(".rooms-slider-btn.next");
const roomsMainFigure = roomsSlideMainImg.closest(".rooms-card-image");
const roomsNextFigure = roomsSlideNextImg.closest(".rooms-card-image");
const roomsDesc = document.querySelector(".rooms-item-desc");

const ROOMS_FADE_MS = 300;
const ROOMS_SLIDE_OFFSET = 24;
const ROOMS_FLIP_DEG = 22;
// "fade" - простое затухание, "slide" - сдвиг в сторону, "flip" - 3D-поворот
const ROOMS_TRANSITION_VARIANT = "flip";

let roomsSlideIndex = 0;
let roomsIsAnimating = false;

function renderFacility(listEl, items) {
  listEl.innerHTML = items
    .map(function (item) {
      return (
        '<li><img src="/assets/icons/' +
        item.icon +
        '" alt="" />' +
        item.text +
        "</li>"
      );
    })
    .join("");
}

function applyRoomsSlideContent() {
  const current = roomsSlides[roomsSlideIndex];
  const next = roomsSlides[roomsSlideIndex + 1];

  roomsSlideMainImg.src = current.image;
  roomsSlideMainImg.alt = current.name;
  roomsSlideMainName.textContent = current.name;
  roomsSlideArea.innerHTML = current.area;
  roomsSlidePrice.textContent = current.price;
  renderFacility(roomsSlideFacility1, current.facility1);
  renderFacility(roomsSlideFacility2, current.facility2);

  roomsSlideNextImg.src = next.image;
  roomsSlideNextImg.alt = next.name;
  roomsSlideNextName.textContent = next.name;
}

function updateRoomsNavState() {
  roomsPrevBtn.disabled = roomsSlideIndex === 0;
  roomsNextBtn.disabled = roomsSlideIndex >= roomsSlides.length - 2;
}

function goToRoomsSlideFade(newIndex) {
  roomsMainFigure.classList.add("is-fading");
  roomsNextFigure.classList.add("is-fading");

  setTimeout(function () {
    roomsSlideIndex = newIndex;
    applyRoomsSlideContent();
    roomsMainFigure.classList.remove("is-fading");
    roomsNextFigure.classList.remove("is-fading");

    updateRoomsNavState();
    roomsIsAnimating = false;
  }, ROOMS_FADE_MS);
}

function goToRoomsSlideSlide(newIndex) {
  const direction = newIndex > roomsSlideIndex ? 1 : -1;
  const figures = [roomsMainFigure, roomsNextFigure];

  figures.forEach(function (figure) {
    figure.style.setProperty(
      "--rooms-slide-x",
      String(-direction * ROOMS_SLIDE_OFFSET),
    );
    figure.classList.add("is-slide-out");
  });

  setTimeout(function () {
    roomsSlideIndex = newIndex;
    applyRoomsSlideContent();

    figures.forEach(function (figure) {
      figure.classList.add("is-slide-instant");
      figure.classList.remove("is-slide-out");
      figure.style.setProperty(
        "--rooms-slide-x",
        String(direction * ROOMS_SLIDE_OFFSET),
      );
    });

    requestAnimationFrame(function () {
      figures.forEach(function (figure) {
        figure.classList.remove("is-slide-instant");
        figure.style.setProperty("--rooms-slide-x", "0");
      });

      setTimeout(function () {
        updateRoomsNavState();
        roomsIsAnimating = false;
      }, ROOMS_FADE_MS);
    });
  }, ROOMS_FADE_MS);
}

function goToRoomsSlideFlip(newIndex) {
  const direction = newIndex > roomsSlideIndex ? 1 : -1;
  const figures = [roomsMainFigure, roomsNextFigure];

  figures.forEach(function (figure) {
    figure.style.setProperty(
      "--rooms-flip-deg",
      String(-direction * ROOMS_FLIP_DEG),
    );
    figure.classList.add("is-flip-out");
  });

  setTimeout(function () {
    roomsSlideIndex = newIndex;
    applyRoomsSlideContent();

    figures.forEach(function (figure) {
      figure.classList.add("is-flip-instant");
      figure.classList.remove("is-flip-out");
      figure.style.setProperty(
        "--rooms-flip-deg",
        String(direction * ROOMS_FLIP_DEG),
      );
    });

    requestAnimationFrame(function () {
      figures.forEach(function (figure) {
        figure.classList.remove("is-flip-instant");
        figure.style.setProperty("--rooms-flip-deg", "0");
      });

      setTimeout(function () {
        updateRoomsNavState();
        roomsIsAnimating = false;
      }, ROOMS_FADE_MS);
    });
  }, ROOMS_FADE_MS);
}

function goToRoomsSlide(newIndex) {
  if (roomsIsAnimating || newIndex === roomsSlideIndex) return;

  roomsIsAnimating = true;
  roomsPrevBtn.disabled = true;
  roomsNextBtn.disabled = true;

  if (ROOMS_TRANSITION_VARIANT === "slide") {
    goToRoomsSlideSlide(newIndex);
  } else if (ROOMS_TRANSITION_VARIANT === "flip") {
    goToRoomsSlideFlip(newIndex);
  } else {
    goToRoomsSlideFade(newIndex);
  }
}

roomsPrevBtn.addEventListener("click", function () {
  goToRoomsSlide(roomsSlideIndex - 1);
});

roomsNextBtn.addEventListener("click", function () {
  goToRoomsSlide(roomsSlideIndex + 1);
});

applyRoomsSlideContent();
updateRoomsNavState();

// --- Секция «Планируете поездку»: закреплённый заголовок, который
// перекрашивается по линии стыка светлого и тёмного блоков, а затем
// «отлипает» (top: 90px от блока формы) и уезжает вместе с ним ---
(function () {
  const titleWrapper = document.querySelector(".plan-title-wrapper");
  const titleBase = document.querySelector(
    ".plan-title-container .plan-title:not(.plan-title--over)",
  );
  const titleOver = document.querySelector(".plan-title--over");
  const formContainer = document.querySelector(".plan-form-container");

  if (!titleWrapper || !titleBase || !titleOver || !formContainer) return;

  // 120px — sticky-смещение слоя, 90px — top контейнера заголовка внутри него
  const PINNED_TOP = 120 + 90;
  // отступ заголовка от верха блока формы в момент «отлипания»
  const GAP = 90;

  let ticking = false;

  function update() {
    ticking = false;
    const formTop = formContainer.getBoundingClientRect().top;

    // 1. Открепление: пока верх блока формы ниже точки (PINNED_TOP - GAP),
    // заголовок закреплён (delta = 0); как только блок поднимается выше —
    // тянем заголовок вверх вместе с ним, сохраняя зазор GAP.
    const delta = Math.min(0, formTop + GAP - PINNED_TOP);
    titleWrapper.style.transform = delta ? "translateY(" + delta + "px)" : "";

    // 2. Перекраска: обрезаем светлую копию сверху по реальной линии стыка
    // (верх блока формы) относительно текущего положения заголовка.
    const rect = titleBase.getBoundingClientRect();
    const seam = Math.max(0, Math.min(rect.height, formTop - rect.top));
    titleOver.style.clipPath = "inset(" + seam + "px 0 0 0)";
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();

// --- Слайдер «Отель»: горизонтальная прокрутка списка кнопками prev/next.
// Шаг прокрутки = ширина одного слайда + отступ между слайдами. ---
(function () {
  const list = document.querySelector(".hotel-slider-list");
  const prevBtn = document.querySelector(".hotel-slider-btn.prev");
  const nextBtn = document.querySelector(".hotel-slider-btn.next");

  if (!list || !prevBtn || !nextBtn) return;

  function getStep() {
    const item = list.querySelector(".hotel-slider-item");
    if (!item) return list.clientWidth;
    const style = getComputedStyle(item);
    const gap = parseFloat(style.marginRight) || 0;
    return item.getBoundingClientRect().width + gap;
  }

  function updateNavState() {
    // 1px запас на дробные значения scrollLeft при разных масштабах
    const maxScroll = list.scrollWidth - list.clientWidth;
    prevBtn.disabled = list.scrollLeft <= 1;
    nextBtn.disabled = list.scrollLeft >= maxScroll - 1;
  }

  prevBtn.addEventListener("click", function () {
    list.scrollBy({ left: -getStep(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", function () {
    list.scrollBy({ left: getStep(), behavior: "smooth" });
  });

  let ticking = false;
  list.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          updateNavState();
        });
      }
    },
    { passive: true },
  );

  window.addEventListener("resize", updateNavState);
  updateNavState();
})();
