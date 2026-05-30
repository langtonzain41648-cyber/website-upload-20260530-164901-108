(function () {
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      const isOpen = mobileNav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const hero = document.querySelector("[data-hero]");

  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    const prev = hero.querySelector("[data-hero-prev]");
    const next = hero.querySelector("[data-hero-next]");
    let current = 0;
    let timer = null;

    const show = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle("active", idx === current);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle("active", idx === current);
      });
    };

    const start = function () {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    };

    const restart = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    };

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        restart();
      });
    }

    if (slides.length > 1) {
      start();
    }
  }

  const params = new URLSearchParams(window.location.search);
  const urlKeyword = params.get("q") || "";

  document.querySelectorAll("[data-filter-form]").forEach(function (form) {
    const keyword = form.querySelector("[name='keyword']");
    const type = form.querySelector("[name='type']");
    const year = form.querySelector("[name='year']");
    const grid = document.querySelector("[data-filter-grid]");
    const empty = document.querySelector("[data-empty-state]");

    if (!grid) {
      return;
    }

    const cards = Array.from(grid.children);

    const filter = function () {
      const keywordValue = normalize(keyword ? keyword.value : "");
      const typeValue = normalize(type ? type.value : "");
      const yearValue = normalize(year ? year.value : "");
      let visible = 0;

      cards.forEach(function (card) {
        const haystack = normalize(card.getAttribute("data-search") || "");
        const cardType = normalize(card.getAttribute("data-type") || "");
        const cardYear = normalize(card.getAttribute("data-year") || "");
        const matched = (!keywordValue || haystack.indexOf(keywordValue) !== -1) &&
          (!typeValue || cardType === typeValue) &&
          (!yearValue || cardYear.indexOf(yearValue) !== -1);

        card.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    };

    if (keyword && urlKeyword) {
      keyword.value = urlKeyword;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      filter();
    });

    [keyword, type, year].forEach(function (field) {
      if (field) {
        field.addEventListener("input", filter);
        field.addEventListener("change", filter);
      }
    });

    filter();
  });

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }
})();
