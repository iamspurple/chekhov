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
  const tabs = document.querySelectorAll(".rooms-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });
};

const initRoomsSlider = () => {
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
  if (!roomsSlideMainImg) return;

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

  const ROOMS_FADE_MS = 300;
  const ROOMS_SLIDE_OFFSET = 24;
  const ROOMS_FLIP_DEG = 22;
  const ROOMS_TRANSITION_VARIANT = "flip";

  let roomsSlideIndex = 0;
  let roomsIsAnimating = false;

  const renderFacility = (listEl, items) => {
    listEl.innerHTML = items
      .map(
        (item) =>
          '<li><img src="/assets/icons/' +
          item.icon +
          '" alt="" />' +
          item.text +
          "</li>",
      )
      .join("");
  };

  const applyRoomsSlideContent = () => {
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
  };

  const updateRoomsNavState = () => {
    roomsPrevBtn.disabled = roomsSlideIndex === 0;
    roomsNextBtn.disabled = roomsSlideIndex >= roomsSlides.length - 2;
  };

  const goToRoomsSlideFade = (newIndex) => {
    roomsMainFigure.classList.add("is-fading");
    roomsNextFigure.classList.add("is-fading");

    setTimeout(() => {
      roomsSlideIndex = newIndex;
      applyRoomsSlideContent();
      roomsMainFigure.classList.remove("is-fading");
      roomsNextFigure.classList.remove("is-fading");

      updateRoomsNavState();
      roomsIsAnimating = false;
    }, ROOMS_FADE_MS);
  };

  const goToRoomsSlideSlide = (newIndex) => {
    const direction = newIndex > roomsSlideIndex ? 1 : -1;
    const figures = [roomsMainFigure, roomsNextFigure];

    figures.forEach((figure) => {
      figure.style.setProperty(
        "--rooms-slide-x",
        String(-direction * ROOMS_SLIDE_OFFSET),
      );
      figure.classList.add("is-slide-out");
    });

    setTimeout(() => {
      roomsSlideIndex = newIndex;
      applyRoomsSlideContent();

      figures.forEach((figure) => {
        figure.classList.add("is-slide-instant");
        figure.classList.remove("is-slide-out");
        figure.style.setProperty(
          "--rooms-slide-x",
          String(direction * ROOMS_SLIDE_OFFSET),
        );
      });

      requestAnimationFrame(() => {
        figures.forEach((figure) => {
          figure.classList.remove("is-slide-instant");
          figure.style.setProperty("--rooms-slide-x", "0");
        });

        setTimeout(() => {
          updateRoomsNavState();
          roomsIsAnimating = false;
        }, ROOMS_FADE_MS);
      });
    }, ROOMS_FADE_MS);
  };

  const goToRoomsSlideFlip = (newIndex) => {
    const direction = newIndex > roomsSlideIndex ? 1 : -1;
    const figures = [roomsMainFigure, roomsNextFigure];

    figures.forEach((figure) => {
      figure.style.setProperty(
        "--rooms-flip-deg",
        String(-direction * ROOMS_FLIP_DEG),
      );
      figure.classList.add("is-flip-out");
    });

    setTimeout(() => {
      roomsSlideIndex = newIndex;
      applyRoomsSlideContent();

      figures.forEach((figure) => {
        figure.classList.add("is-flip-instant");
        figure.classList.remove("is-flip-out");
        figure.style.setProperty(
          "--rooms-flip-deg",
          String(direction * ROOMS_FLIP_DEG),
        );
      });

      requestAnimationFrame(() => {
        figures.forEach((figure) => {
          figure.classList.remove("is-flip-instant");
          figure.style.setProperty("--rooms-flip-deg", "0");
        });

        setTimeout(() => {
          updateRoomsNavState();
          roomsIsAnimating = false;
        }, ROOMS_FADE_MS);
      });
    }, ROOMS_FADE_MS);
  };

  const goToRoomsSlide = (newIndex) => {
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
  };

  roomsPrevBtn.addEventListener("click", () => {
    goToRoomsSlide(roomsSlideIndex - 1);
  });

  roomsNextBtn.addEventListener("click", () => {
    goToRoomsSlide(roomsSlideIndex + 1);
  });

  applyRoomsSlideContent();
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
    ".header-book-btn, .faq-btn, .callback-open",
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

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScrollState();
  initFloatingHeader();
  initNavDrawer();
  initBookingDates();
  initPhoneMasks();
  initRoomsTabs();
  initRoomsSlider();
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
