const header = document.querySelector(".header");
const hero = document.querySelector(".hero");

new IntersectionObserver(
  function (entries) {
    header.classList.toggle("dark", !entries[0].isIntersecting);
  },
  { threshold: 0.15 },
).observe(hero);

// --- Плавающая мобильная шапка: включается после прокрутки 30% hero ---
(function () {
  if (!header || !hero) return;

  let ticking = false;

  function update() {
    ticking = false;
    const threshold = hero.offsetHeight * 0.1;
    header.classList.toggle("is-float", window.scrollY > threshold);
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );

  window.addEventListener("resize", update);
  update();
})();

// Nav drawer (burger menu)
const navDrawer = document.getElementById("nav-drawer");
const burgerBtn = document.querySelector(".header-burger");

function openDrawer() {
  navDrawer.classList.add("is-open");
  navDrawer.setAttribute("aria-hidden", "false");
  burgerBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  navDrawer.classList.remove("is-open");
  navDrawer.setAttribute("aria-hidden", "true");
  burgerBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

burgerBtn.addEventListener("click", openDrawer);

navDrawer.querySelectorAll("[data-drawer-close]").forEach(function (el) {
  el.addEventListener("click", closeDrawer);
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && navDrawer.classList.contains("is-open")) {
    closeDrawer();
  }
});

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
const phoneInput3 = document.getElementById("phone-3");
const phoneInput4 = document.getElementById("phone-4");

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

if (phoneInput3) {
  IMask(phoneInput3, {
    mask: "+{7}(000)000-00-00",
    lazy: false,
  });
}

if (phoneInput4) {
  IMask(phoneInput4, {
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

  const titleContainer = titleBase.parentElement;

  // Расстояния берём из CSS (sticky-top слоя + top контейнера заголовка),
  // поэтому адаптив задаётся в media-запросах, а не в скрипте: напр. в мобилке
  // .plan-title-container { top: 30px } — заголовок крепится в 30px от верха.
  let pinnedTop = 0;
  let gap = 0;

  function readMetrics() {
    const stickyTop = parseFloat(getComputedStyle(titleWrapper).top) || 0;
    const containerTop = parseFloat(getComputedStyle(titleContainer).top) || 0;
    pinnedTop = stickyTop + containerTop;
    // зазор при «отлипании» = отступ заголовка от верха контейнера
    gap = containerTop;
  }

  let ticking = false;

  function update() {
    ticking = false;
    const formTop = formContainer.getBoundingClientRect().top;

    // 1. Открепление: пока верх блока формы ниже точки (pinnedTop - gap),
    // заголовок закреплён (delta = 0); как только блок поднимается выше —
    // тянем заголовок вверх вместе с ним, сохраняя зазор gap.
    const delta = Math.min(0, formTop + gap - pinnedTop);
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
  window.addEventListener("resize", function () {
    readMetrics();
    onScroll();
  });
  readMetrics();
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

// --- Слайдер «Чибо» (моб.): горизонтальная прокрутка списка кнопками
// prev/next. Шаг прокрутки = ширина одного слайда + отступ между слайдами. ---
(function () {
  const list = document.querySelector(".chibo-slider-list");
  const prevBtn = document.querySelector(".chibo-slider-btn.prev");
  const nextBtn = document.querySelector(".chibo-slider-btn.next");

  if (!list || !prevBtn || !nextBtn) return;

  function getStep() {
    const items = list.querySelectorAll(".chibo-slider-item");
    if (!items.length) return list.clientWidth;
    // Шаг = расстояние между началами двух соседних слайдов: так учитываются
    // и ширина слайда, и gap контейнера, и margin слайда одновременно.
    if (items.length > 1) {
      return items[1].offsetLeft - items[0].offsetLeft;
    }
    const style = getComputedStyle(items[0]);
    const gap = parseFloat(style.marginRight) || 0;
    return items[0].getBoundingClientRect().width + gap;
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

// --- Универсальный слайдер с прокруткой кнопками prev/next.
// Шаг = расстояние между началами двух соседних слайдов (учитывает ширину,
// gap и margin). Нативный свайп отключён через overflow: hidden у списка. ---
function initButtonSlider(listSelector, prevSelector, nextSelector) {
  const list = document.querySelector(listSelector);
  const prevBtn = document.querySelector(prevSelector);
  const nextBtn = document.querySelector(nextSelector);

  if (!list || !prevBtn || !nextBtn) return;

  function getStep() {
    const items = list.children;
    if (!items.length) return list.clientWidth;
    if (items.length > 1) {
      return items[1].offsetLeft - items[0].offsetLeft;
    }
    const style = getComputedStyle(items[0]);
    const gap = parseFloat(style.marginRight) || 0;
    return items[0].getBoundingClientRect().width + gap;
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
}

initButtonSlider(
  ".reviews-photo-list",
  ".reviews-photo-slider-btn.prev",
  ".reviews-photo-slider-btn.next",
);

initButtonSlider(
  ".reviews-rate-list",
  ".reviews-rate-slider-btn.prev",
  ".reviews-rate-slider-btn.next",
);

initButtonSlider(
  ".privileges-rest-list",
  ".privileges-slider-btn.prev",
  ".privileges-slider-btn.next",
);

// --- Слайдер преимуществ (моб.): свайп со scroll-snap + точки-навигация.
// Клик по точке прокручивает к слайду, при прокрутке активная точка
// определяется по ближайшему к началу списка слайду. ---
(function () {
  const list = document.querySelector(".hero-advantages-mob-list");
  const dots = document.querySelectorAll(".hero-advantages-mob-dot");

  if (!list || !dots.length) return;

  const items = list.querySelectorAll(".hero-advantages-mob-item");

  function activeIndex() {
    let index = 0;
    let minDiff = Infinity;
    items.forEach(function (item, i) {
      const diff = Math.abs(item.offsetLeft - list.scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        index = i;
      }
    });
    return index;
  }

  function updateDots() {
    const index = activeIndex();
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === index);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      const item = items[i];
      if (item) {
        list.scrollTo({ left: item.offsetLeft, behavior: "smooth" });
      }
    });
  });

  let ticking = false;
  list.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          updateDots();
        });
      }
    },
    { passive: true },
  );

  // Листание перетаскиванием (мышь / перо). Тач-свайп работает нативно. ---
  let isDragging = false;
  let startX = 0;
  let startScroll = 0;

  list.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "touch") return;
    isDragging = true;
    startX = e.clientX;
    startScroll = list.scrollLeft;
    list.style.scrollSnapType = "none";
    list.setPointerCapture(e.pointerId);
  });

  list.addEventListener("pointermove", function (e) {
    if (!isDragging) return;
    list.scrollLeft = startScroll - (e.clientX - startX);
  });

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    list.style.scrollSnapType = "";
    if (list.hasPointerCapture(e.pointerId)) {
      list.releasePointerCapture(e.pointerId);
    }
    const item = items[activeIndex()];
    if (item) {
      list.scrollTo({ left: item.offsetLeft, behavior: "smooth" });
    }
  }

  list.addEventListener("pointerup", endDrag);
  list.addEventListener("pointercancel", endDrag);

  window.addEventListener("resize", updateDots);
  updateDots();
})();

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(function (item) {
  const question = item.querySelector(".faq-item-question");

  question.addEventListener("click", function () {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach(function (otherItem) {
      otherItem.classList.remove("is-open");
    });

    if (!isOpen) {
      item.classList.add("is-open");
    }
  });
});

// --- Кнопка «Ещё вопросы» (моб.): раскрывает скрытые вопросы. ---
const faqMore = document.querySelector(".faq-more");
const faqList = document.querySelector(".faq-list");

if (faqMore && faqList) {
  faqMore.addEventListener("click", function () {
    faqList.classList.add("is-expanded");
  });
}

// --- Поп-ап с подробной информацией о номере: открытие по кнопке «Подробнее»,
// закрытие по крестику / оверлею / Esc, галерея с миниатюрами и стрелками. ---
(function () {
  const modal = document.getElementById("room-modal");
  if (!modal) return;

  const openBtns = document.querySelectorAll(".rooms-card-btn");
  const mainImg = modal.querySelector(".room-modal-main-img");
  const thumbs = Array.from(modal.querySelectorAll(".room-modal-thumb"));
  const prevBtn = modal.querySelector(".room-modal-arrow.prev");
  const nextBtn = modal.querySelector(".room-modal-arrow.next");
  const scrollEl = modal.querySelector(".room-modal-scroll");
  const bar = modal.querySelector(".room-modal-bar");
  const thumb = modal.querySelector(".room-modal-bar-thumb");

  let galleryIndex = 0;

  // --- Кастомный скроллбар: синхронизация ползунка с прокруткой + перетаскивание.
  function updateScrollbar() {
    if (!scrollEl || !bar || !thumb) return;
    const trackH = bar.clientHeight;
    const ratio = scrollEl.clientHeight / scrollEl.scrollHeight;
    // прячем скроллбар, если прокручивать нечего
    if (ratio >= 1) {
      bar.classList.remove("is-visible");
      return;
    }
    bar.classList.add("is-visible");
    const thumbH = Math.max(24, trackH * ratio);
    const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
    const maxThumbTop = trackH - thumbH;
    const top = maxScroll ? (scrollEl.scrollTop / maxScroll) * maxThumbTop : 0;
    thumb.style.height = thumbH + "px";
    thumb.style.transform = "translateY(" + top + "px)";
  }

  if (scrollEl) {
    scrollEl.addEventListener("scroll", updateScrollbar, { passive: true });
    window.addEventListener("resize", updateScrollbar);
  }

  if (thumb) {
    let dragStartY = 0;
    let dragStartScroll = 0;

    thumb.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      dragStartY = e.clientY;
      dragStartScroll = scrollEl.scrollTop;
      thumb.setPointerCapture(e.pointerId);
    });

    thumb.addEventListener("pointermove", function (e) {
      if (!thumb.hasPointerCapture(e.pointerId)) return;
      const trackH = bar.clientHeight;
      const thumbH = thumb.clientHeight;
      const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
      const maxThumbTop = trackH - thumbH;
      const deltaPx = e.clientY - dragStartY;
      const deltaScroll = maxThumbTop ? (deltaPx / maxThumbTop) * maxScroll : 0;
      scrollEl.scrollTop = dragStartScroll + deltaScroll;
    });

    thumb.addEventListener("pointerup", function (e) {
      if (thumb.hasPointerCapture(e.pointerId)) {
        thumb.releasePointerCapture(e.pointerId);
      }
    });
  }

  function showImage(index) {
    galleryIndex = Math.max(0, Math.min(index, thumbs.length - 1));
    const thumbImg = thumbs[galleryIndex].querySelector("img");
    if (thumbImg && mainImg) {
      mainImg.src = thumbImg.src;
      mainImg.alt = thumbImg.alt;
    }
    thumbs.forEach(function (thumb, i) {
      thumb.classList.toggle("is-active", i === galleryIndex);
    });
    if (prevBtn) prevBtn.disabled = galleryIndex === 0;
    if (nextBtn) nextBtn.disabled = galleryIndex === thumbs.length - 1;
  }

  function openModal() {
    showImage(0);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (scrollEl) scrollEl.scrollTop = 0;
    // пересчёт после отрисовки, когда размеры уже доступны
    requestAnimationFrame(updateScrollbar);
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openBtns.forEach(function (btn) {
    btn.addEventListener("click", openModal);
  });

  modal.querySelectorAll("[data-room-close]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      showImage(galleryIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      showImage(galleryIndex + 1);
    });
  }

  thumbs.forEach(function (thumb, i) {
    thumb.addEventListener("click", function () {
      showImage(i);
    });
  });
})();

// --- Поп-ап формы обратной связи: открытие по кнопкам «Забронировать» /
// «задать свой вопрос», закрытие по крестику / оверлею / Esc. ---
(function () {
  const modal = document.getElementById("callback-modal");
  if (!modal) return;

  const openBtns = document.querySelectorAll(
    ".header-book-btn, .faq-btn, .callback-open",
  );

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openBtns.forEach(function (btn) {
    btn.addEventListener("click", openModal);
  });

  modal.querySelectorAll("[data-callback-close]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  const phoneCallback = document.getElementById("phone-callback");
  if (phoneCallback && window.IMask) {
    IMask(phoneCallback, {
      mask: "+{7}(000)000-00-00",
      lazy: false,
    });
  }
})();

// --- Поп-ап с контактами: открытие по иконке телефона в мобильной шапке,
// закрытие по крестику / оверлею / Esc. ---
(function () {
  const modal = document.getElementById("contacts-modal");
  if (!modal) return;

  const openBtns = document.querySelectorAll(".header-phone-btn");

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openBtns.forEach(function (btn) {
    btn.addEventListener("click", openModal);
  });

  modal.querySelectorAll("[data-contacts-close]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
})();
