const initIntro = () => {
  const intro = document.getElementById("intro");
  if (!intro || !document.documentElement.classList.contains("intro-active")) {
    return;
  }

  const finish = () => {
    if (!document.documentElement.classList.contains("intro-active")) return;
    document.documentElement.classList.remove("intro-active");
  };

  intro.addEventListener("animationend", (e) => {
    if (e.animationName === "intro-fade") finish();
  });

  setTimeout(finish, 4200);
};

const initHeaderScrollState = () => {
  const header = document.querySelector(".header");
  const hero = document.querySelector(".hero");
  if (!header || !hero) return;

  new IntersectionObserver(
    (entries) => {
      header.classList.toggle("dark", !entries[0].isIntersecting);
    },
    { threshold: 0.15 },
  ).observe(hero);
};

const initFloatingHeader = () => {
  const header = document.querySelector(".header");
  const hero = document.querySelector(".hero");
  if (!header || !hero) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const threshold = hero.offsetHeight * 0.1;
    header.classList.toggle("is-float", window.scrollY > threshold);
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );

  window.addEventListener("resize", update);
  update();
};

const initNavDrawer = () => {
  const navDrawer = document.getElementById("nav-drawer");
  const burgerBtn = document.querySelector(".header-burger");
  if (!navDrawer || !burgerBtn) return;

  const openDrawer = () => {
    navDrawer.classList.add("is-open");
    navDrawer.setAttribute("aria-hidden", "false");
    burgerBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    navDrawer.classList.remove("is-open");
    navDrawer.setAttribute("aria-hidden", "true");
    burgerBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  burgerBtn.addEventListener("click", openDrawer);

  navDrawer.querySelectorAll("[data-drawer-close]").forEach((el) => {
    el.addEventListener("click", closeDrawer);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navDrawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });
};

const initBookingDates = () => {
  const formatDate = (value) => {
    if (!value) return "";
    const [y, m, d] = value.split("-");
    return d + "." + m + "." + y;
  };

  const checkin = document.getElementById("checkin");
  const checkout = document.getElementById("checkout");

  if (checkin) {
    checkin.addEventListener("change", (e) => {
      document.getElementById("checkin-display").textContent = formatDate(
        e.target.value,
      );
    });
  }

  if (checkout) {
    checkout.addEventListener("change", (e) => {
      document.getElementById("checkout-display").textContent = formatDate(
        e.target.value,
      );
    });
  }
};

const initPhoneMasks = () => {
  if (typeof IMask === "undefined") return;

  ["phone-1", "phone-2", "phone-3", "phone-4"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      IMask(el, { mask: "+{7}(000)000-00-00", lazy: false });
    }
  });
};

const initRoomsTabs = () => {
  const tabs = Array.from(document.querySelectorAll(".rooms-tab"));
  const wraps = Array.from(document.querySelectorAll(".rooms-slider-wrap"));
  if (!tabs.length || !wraps.length) return;

  // Каждый wrap — самостоятельный слайдер со своими слайдами и кнопками.
  // Первым трём категориям назначаем разные варианты анимации для теста,
  // остальным — flip по умолчанию.
  const roomsVariants = ["flip", "slide", "fade"];
  wraps.forEach((wrap, i) => initRoomsSlider(wrap, roomsVariants[i] ?? "flip"));

  const activate = (index) => {
    tabs.forEach((tab, i) => tab.classList.toggle("active", i === index));
    wraps.forEach((wrap, i) => wrap.classList.toggle("is-hidden", i !== index));
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => activate(i));
  });

  activate(0);
};

// Заготовленные варианты перехода между слайдами.
// fade  — простое затухание;
// slide — сдвиг по X с затуханием;
// flip  — переворот (rotateY) с затуханием.
const ROOMS_FADE_MS = 300;
const ROOMS_FLIP_DEG = 22;
const ROOMS_SLIDE_OFFSET = 24;

const ROOMS_TRANSFORMS = {
  fade: null,
  slide: { prop: "--rooms-slide-x", amount: ROOMS_SLIDE_OFFSET },
  flip: { prop: "--rooms-flip-deg", amount: ROOMS_FLIP_DEG },
};

const initRoomsSlider = (root, variant = "flip") => {
  if (!root) return;

  const items = Array.from(root.querySelectorAll(".rooms-item"));
  if (!items.length) return;

  const roomsPrevBtn = root.querySelector(".rooms-slider-btn.prev");
  const roomsNextBtn = root.querySelector(".rooms-slider-btn.next");

  // fade намеренно даёт null, поэтому проверяем именно наличие ключа,
  // а не «истинность» значения (иначе fade откатился бы к flip).
  const cfg =
    variant in ROOMS_TRANSFORMS
      ? ROOMS_TRANSFORMS[variant]
      : ROOMS_TRANSFORMS.flip;

  let roomsSlideIndex = 0;
  let roomsIsAnimating = false;

  // Изображения активного и предактивного слайдов (те, что сейчас видны).
  const visibleFigures = () =>
    items
      .filter((item) => item.matches(".is-active, .is-preactive"))
      .map((item) => item.querySelector(".rooms-card-image"));

  const setActive = (index) => {
    items.forEach((item, i) => {
      item.classList.toggle("is-active", i === index);
      item.classList.toggle("is-preactive", i === index + 1);
    });
  };

  const updateRoomsNavState = () => {
    roomsPrevBtn.disabled = roomsSlideIndex === 0;
    roomsNextBtn.disabled = roomsSlideIndex === items.length - 1;
  };

  const goToRoomsSlide = (newIndex) => {
    if (roomsIsAnimating || newIndex === roomsSlideIndex) return;
    if (newIndex < 0 || newIndex > items.length - 1) return;

    roomsIsAnimating = true;
    roomsPrevBtn.disabled = true;
    roomsNextBtn.disabled = true;

    const direction = newIndex > roomsSlideIndex ? 1 : -1;

    // 1. Уводим текущие видимые изображения (затухание + сдвиг/переворот).
    visibleFigures().forEach((figure) => {
      if (cfg) {
        figure.style.setProperty(cfg.prop, String(-direction * cfg.amount));
      }
      figure.classList.add("is-fading");
    });

    setTimeout(() => {
      // 2. Переставляем активный/предактивный на новые слайды.
      roomsSlideIndex = newIndex;
      setActive(roomsSlideIndex);

      // 3. Новые изображения ставим в стартовое положение без анимации.
      const figures = visibleFigures();
      figures.forEach((figure) => {
        figure.classList.add("is-instant");
        if (cfg) {
          // slide/flip: появляются на противоположном сдвиге/угле, но видимые.
          figure.style.setProperty(cfg.prop, String(direction * cfg.amount));
          figure.classList.remove("is-fading");
        } else {
          // fade: появляются прозрачными и проявляются.
          figure.classList.add("is-fading");
        }
      });

      // 4. Возвращаем в исходное положение с анимацией.
      requestAnimationFrame(() => {
        figures.forEach((figure) => {
          figure.classList.remove("is-instant");
          if (cfg) {
            figure.style.setProperty(cfg.prop, "0");
          } else {
            figure.classList.remove("is-fading");
          }
        });

        setTimeout(() => {
          updateRoomsNavState();
          roomsIsAnimating = false;
        }, ROOMS_FADE_MS);
      });
    }, ROOMS_FADE_MS);
  };

  roomsPrevBtn.addEventListener("click", () => {
    goToRoomsSlide(roomsSlideIndex - 1);
  });

  roomsNextBtn.addEventListener("click", () => {
    goToRoomsSlide(roomsSlideIndex + 1);
  });

  setActive(roomsSlideIndex);
  updateRoomsNavState();
};

const initPlanTitle = () => {
  const titleWrapper = document.querySelector(".plan-title-wrapper");
  const titleBase = document.querySelector(
    ".plan-title-container .plan-title:not(.plan-title--over)",
  );
  const titleOver = document.querySelector(".plan-title--over");
  const formContainer = document.querySelector(".plan-form-container");

  if (!titleWrapper || !titleBase || !titleOver || !formContainer) return;

  const titleContainer = titleBase.parentElement;

  let pinnedTop = 0;
  let gap = 0;

  const readMetrics = () => {
    const stickyTop = parseFloat(getComputedStyle(titleWrapper).top) || 0;
    const containerTop = parseFloat(getComputedStyle(titleContainer).top) || 0;
    pinnedTop = stickyTop + containerTop;
    gap = containerTop;
  };

  let ticking = false;

  const update = () => {
    ticking = false;
    const formTop = formContainer.getBoundingClientRect().top;

    const delta = Math.min(0, formTop + gap - pinnedTop);
    titleWrapper.style.transform = delta ? "translateY(" + delta + "px)" : "";

    const rect = titleBase.getBoundingClientRect();
    const seam = Math.max(0, Math.min(rect.height, formTop - rect.top));
    titleOver.style.clipPath = "inset(" + seam + "px 0 0 0)";
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    readMetrics();
    onScroll();
  });
  readMetrics();
  update();
};

const initHotelSlider = () => {
  const list = document.querySelector(".hotel-slider-list");
  const prevBtn = document.querySelector(".hotel-slider-btn.prev");
  const nextBtn = document.querySelector(".hotel-slider-btn.next");

  if (!list || !prevBtn || !nextBtn) return;

  const getStep = () => {
    const item = list.querySelector(".hotel-slider-item");
    if (!item) return list.clientWidth;
    const style = getComputedStyle(item);
    const gap = parseFloat(style.marginRight) || 0;
    return item.getBoundingClientRect().width + gap;
  };

  const updateNavState = () => {
    const maxScroll = list.scrollWidth - list.clientWidth;
    prevBtn.disabled = list.scrollLeft <= 1;
    nextBtn.disabled = list.scrollLeft >= maxScroll - 1;
  };

  prevBtn.addEventListener("click", () => {
    list.scrollBy({ left: -getStep(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    list.scrollBy({ left: getStep(), behavior: "smooth" });
  });

  let ticking = false;
  list.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          updateNavState();
        });
      }
    },
    { passive: true },
  );

  window.addEventListener("resize", updateNavState);
  updateNavState();
};

const initChiboSlider = () => {
  const list = document.querySelector(".chibo-slider-list");
  const prevBtn = document.querySelector(".chibo-slider-btn.prev");
  const nextBtn = document.querySelector(".chibo-slider-btn.next");

  if (!list || !prevBtn || !nextBtn) return;

  const getStep = () => {
    const items = list.querySelectorAll(".chibo-slider-item");
    if (!items.length) return list.clientWidth;
    if (items.length > 1) {
      return items[1].offsetLeft - items[0].offsetLeft;
    }
    const style = getComputedStyle(items[0]);
    const gap = parseFloat(style.marginRight) || 0;
    return items[0].getBoundingClientRect().width + gap;
  };

  const updateNavState = () => {
    const maxScroll = list.scrollWidth - list.clientWidth;
    prevBtn.disabled = list.scrollLeft <= 1;
    nextBtn.disabled = list.scrollLeft >= maxScroll - 1;
  };

  prevBtn.addEventListener("click", () => {
    list.scrollBy({ left: -getStep(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    list.scrollBy({ left: getStep(), behavior: "smooth" });
  });

  let ticking = false;
  list.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          updateNavState();
        });
      }
    },
    { passive: true },
  );

  window.addEventListener("resize", updateNavState);
  updateNavState();
};

const initButtonSlider = (listSelector, prevSelector, nextSelector) => {
  const list = document.querySelector(listSelector);
  const prevBtn = document.querySelector(prevSelector);
  const nextBtn = document.querySelector(nextSelector);

  if (!list || !prevBtn || !nextBtn) return;

  const getStep = () => {
    const items = list.children;
    if (!items.length) return list.clientWidth;
    if (items.length > 1) {
      return items[1].offsetLeft - items[0].offsetLeft;
    }
    const style = getComputedStyle(items[0]);
    const gap = parseFloat(style.marginRight) || 0;
    return items[0].getBoundingClientRect().width + gap;
  };

  const updateNavState = () => {
    const maxScroll = list.scrollWidth - list.clientWidth;
    prevBtn.disabled = list.scrollLeft <= 1;
    nextBtn.disabled = list.scrollLeft >= maxScroll - 1;
  };

  prevBtn.addEventListener("click", () => {
    list.scrollBy({ left: -getStep(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    list.scrollBy({ left: getStep(), behavior: "smooth" });
  });

  let ticking = false;
  list.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          updateNavState();
        });
      }
    },
    { passive: true },
  );

  window.addEventListener("resize", updateNavState);
  updateNavState();
};

const initAdvantagesMobSlider = () => {
  const list = document.querySelector(".hero-advantages-mob-list");
  const dots = document.querySelectorAll(".hero-advantages-mob-dot");

  if (!list || !dots.length) return;

  const items = list.querySelectorAll(".hero-advantages-mob-item");

  const activeIndex = () => {
    let index = 0;
    let minDiff = Infinity;
    items.forEach((item, i) => {
      const diff = Math.abs(item.offsetLeft - list.scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        index = i;
      }
    });
    return index;
  };

  const updateDots = () => {
    const index = activeIndex();
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  };

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      const item = items[i];
      if (item) {
        list.scrollTo({ left: item.offsetLeft, behavior: "smooth" });
      }
    });
  });

  let ticking = false;
  list.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          updateDots();
        });
      }
    },
    { passive: true },
  );

  let isDragging = false;
  let startX = 0;
  let startScroll = 0;

  list.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch") return;
    isDragging = true;
    startX = e.clientX;
    startScroll = list.scrollLeft;
    list.style.scrollSnapType = "none";
    list.setPointerCapture(e.pointerId);
  });

  list.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    list.scrollLeft = startScroll - (e.clientX - startX);
  });

  const endDrag = (e) => {
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
  };

  list.addEventListener("pointerup", endDrag);
  list.addEventListener("pointercancel", endDrag);

  window.addEventListener("resize", updateDots);
  updateDots();
};

const initAdvantagesArcSlider = () => {
  const root = document.querySelector(".hero-advantages");
  const heroEl = document.querySelector(".hero");
  if (!root || !heroEl) return;

  const arc = root.querySelector(".hero-advantages-arc");
  const items = Array.from(root.querySelectorAll(".hero-advantages-item"));
  const N = items.length;
  if (!N) return;

  const STEP = (20 * Math.PI) / 180;
  const RING = N * STEP;
  const ACTIVE = STEP * 0.5;
  const VISIBLE = STEP * 1.4;
  const INTERVAL = 4000;
  const TWEEN = 1000;

  let geom = { px: 0, py: 0, R: 1 };
  let rot = 0;

  const computeGeom = () => {
    const w = heroEl.clientWidth;
    const h = heroEl.clientHeight;
    const px = w * 0.66;
    const py = h * 0.5;
    const R = Math.max(h * 0.85, 460);
    geom = { px: px, py: py, R: R };

    const cx = px + R;
    const cy = py;
    const d = 2 * R + "px";
    arc.style.width = d;
    arc.style.height = d;
    arc.style.left = cx - R + "px";
    arc.style.top = cy - R + "px";
  };

  const norm = (a) => {
    const half = RING / 2;
    return ((((a + half) % RING) + RING) % RING) - half;
  };

  const render = () => {
    const px = geom.px;
    const py = geom.py;
    const R = geom.R;
    items.forEach((item, i) => {
      const off = norm(i * STEP - rot);
      const x = px + R * (1 - Math.cos(off));
      const y = py + R * Math.sin(off);
      item.style.setProperty("--x", x + "px");
      item.style.setProperty("--y", y + "px");

      const dist = Math.abs(off);
      let op;
      if (dist <= ACTIVE) op = 1;
      else if (dist >= VISIBLE) op = 0;
      else op = 1 - (0.6 * (dist - ACTIVE)) / (VISIBLE - ACTIVE);
      item.style.opacity = op.toFixed(3);
      item.classList.toggle("is-active", dist <= ACTIVE);
    });
  };

  let from = 0;
  let target = 0;
  let tStart = 0;
  let raf = null;

  const animate = (ts) => {
    if (!tStart) tStart = ts;
    const p = Math.min(1, (ts - tStart) / TWEEN);
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    rot = from + (target - from) * e;
    render();
    if (p < 1) raf = requestAnimationFrame(animate);
  };

  const advance = () => {
    from = rot;
    target = rot + STEP;
    tStart = 0;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(animate);
  };

  let timer = null;

  const start = () => {
    if (timer) return;
    timer = setInterval(advance, INTERVAL);
  };

  const stop = () => {
    clearInterval(timer);
    timer = null;
    cancelAnimationFrame(raf);
  };

  computeGeom();
  render();

  window.addEventListener("resize", () => {
    computeGeom();
    render();
  });

  const mq = window.matchMedia("(min-width: 1025px)");
  let onScreen = true;

  const sync = () => {
    if (mq.matches && onScreen) start();
    else stop();
  };

  if (typeof IntersectionObserver !== "undefined") {
    new IntersectionObserver(
      (entries) => {
        onScreen = entries[0].isIntersecting;
        sync();
      },
      { threshold: 0.15 },
    ).observe(heroEl);
  }
  (mq.addEventListener || mq.addListener).call(mq, "change", sync);
  sync();
};

const initFaq = () => {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-item-question");
    if (!question) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("is-open");
      });

      if (!isOpen) {
        item.classList.add("is-open");
      }
    });
  });
};

const initFaqMore = () => {
  const faqMore = document.querySelector(".faq-more");
  const faqList = document.querySelector(".faq-list");

  if (faqMore && faqList) {
    faqMore.addEventListener("click", () => {
      faqList.classList.add("is-expanded");
    });
  }
};

const initRoomModal = () => {
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

  const updateScrollbar = () => {
    if (!scrollEl || !bar || !thumb) return;
    const trackH = bar.clientHeight;
    const ratio = scrollEl.clientHeight / scrollEl.scrollHeight;
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
  };

  if (scrollEl) {
    scrollEl.addEventListener("scroll", updateScrollbar, { passive: true });
    window.addEventListener("resize", updateScrollbar);
  }

  if (thumb) {
    let dragStartY = 0;
    let dragStartScroll = 0;

    thumb.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      dragStartY = e.clientY;
      dragStartScroll = scrollEl.scrollTop;
      thumb.setPointerCapture(e.pointerId);
    });

    thumb.addEventListener("pointermove", (e) => {
      if (!thumb.hasPointerCapture(e.pointerId)) return;
      const trackH = bar.clientHeight;
      const thumbH = thumb.clientHeight;
      const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
      const maxThumbTop = trackH - thumbH;
      const deltaPx = e.clientY - dragStartY;
      const deltaScroll = maxThumbTop ? (deltaPx / maxThumbTop) * maxScroll : 0;
      scrollEl.scrollTop = dragStartScroll + deltaScroll;
    });

    thumb.addEventListener("pointerup", (e) => {
      if (thumb.hasPointerCapture(e.pointerId)) {
        thumb.releasePointerCapture(e.pointerId);
      }
    });
  }

  const showImage = (index) => {
    galleryIndex = Math.max(0, Math.min(index, thumbs.length - 1));
    const thumbImg = thumbs[galleryIndex].querySelector("img");
    if (thumbImg && mainImg) {
      mainImg.src = thumbImg.src;
      mainImg.alt = thumbImg.alt;
    }
    thumbs.forEach((thumbEl, i) => {
      thumbEl.classList.toggle("is-active", i === galleryIndex);
    });
    if (prevBtn) prevBtn.disabled = galleryIndex === 0;
    if (nextBtn) nextBtn.disabled = galleryIndex === thumbs.length - 1;
  };

  const openModal = () => {
    showImage(0);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (scrollEl) scrollEl.scrollTop = 0;
    requestAnimationFrame(updateScrollbar);
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openBtns.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  modal.querySelectorAll("[data-room-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      showImage(galleryIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      showImage(galleryIndex + 1);
    });
  }

  thumbs.forEach((thumbEl, i) => {
    thumbEl.addEventListener("click", () => {
      showImage(i);
    });
  });
};

const initCallbackModal = () => {
  const modal = document.getElementById("callback-modal");
  if (!modal) return;

  const openBtns = document.querySelectorAll(
    ".header-book-btn, .faq-btn, .callback-open, .rooms-item-book-btn",
  );

  const openModal = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openBtns.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  modal.querySelectorAll("[data-callback-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  const phoneCallback = document.getElementById("phone-callback");
  if (phoneCallback && window.IMask) {
    IMask(phoneCallback, { mask: "+{7}(000)000-00-00", lazy: false });
  }
};

const initContactsModal = () => {
  const modal = document.getElementById("contacts-modal");
  if (!modal) return;

  const openBtns = document.querySelectorAll(".header-phone-btn");

  const openModal = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openBtns.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  modal.querySelectorAll("[data-contacts-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
};

const initMap = () => {
  const mapEl = document.getElementById("map");
  if (!mapEl || typeof ymaps3 === "undefined") return;

  const COORDS = [38.933613, 47.21283];
  const CENTER = [38.935383, 47.209512];

  ymaps3.ready
    .then(() =>
      fetch("/assets/map-style.json").then((r) => (r.ok ? r.json() : null)),
    )
    .then((customization) => {
      const {
        YMap,
        YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer,
        YMapMarker,
      } = ymaps3;

      const map = new YMap(mapEl, {
        location: { center: CENTER, zoom: 14.4 },
        behaviors: ["drag", "pinchZoom", "dblClick"],
      });

      map.addChild(
        new YMapDefaultSchemeLayer(customization ? { customization } : {}),
      );
      map.addChild(new YMapDefaultFeaturesLayer());

      const markerEl = document.createElement("div");
      markerEl.className = "map-marker";
      markerEl.innerHTML =
        '<div class="map-marker__pin">' +
        '<img src="/assets/icons/ch.svg" alt="Гостиница Чехов" />' +
        '<span class="map-marker__label">Гостиница “Чехов”</span>' +
        "</div>" +
        '<span class="map-marker__dot"></span>';

      markerEl.addEventListener("click", () => {
        map.setLocation({ center: COORDS, zoom: 17, duration: 500 });
      });

      map.addChild(new YMapMarker({ coordinates: COORDS }, markerEl));
    })
    .catch((e) => {
      console.error("Ошибка инициализации Яндекс.Карты:", e);
    });
};

const initFormReveal = () => {
  // Только десктоп: формы (кроме plan-form) прилетают снизу при скролле.
  if (!window.matchMedia("(min-width: 1025px)").matches) return;
  if (typeof IntersectionObserver === "undefined") return;

  const wrappers = document.querySelectorAll(
    ".hotel-form-wrapper, .location-form-wrapper, .offer-form-wrapper",
  );
  if (!wrappers.length) return;

  // Включаем скрытое стартовое состояние только когда наблюдатель готов.
  document.documentElement.classList.add("forms-reveal-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-inview");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 },
  );

  wrappers.forEach((wrapper) => observer.observe(wrapper));
};

const initLogosReveal = () => {
  // Только десктоп: логотипы партнёров прилетают справа при скролле.
  if (!window.matchMedia("(min-width: 1025px)").matches) return;
  if (typeof IntersectionObserver === "undefined") return;

  const list = document.querySelector(".privileges-rest-list");
  if (!list) return;

  // Включаем скрытое стартовое состояние только когда наблюдатель готов.
  document.documentElement.classList.add("logos-reveal-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-inview");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 },
  );

  observer.observe(list);
};

document.addEventListener("DOMContentLoaded", () => {
  initIntro();
  initFormReveal();
  initLogosReveal();
  initHeaderScrollState();
  initFloatingHeader();
  initNavDrawer();
  initBookingDates();
  initPhoneMasks();
  initRoomsTabs();
  initPlanTitle();
  initHotelSlider();
  initChiboSlider();
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
  initAdvantagesMobSlider();
  initAdvantagesArcSlider();
  initFaq();
  initFaqMore();
  initRoomModal();
  initCallbackModal();
  initContactsModal();
  initMap();
});
