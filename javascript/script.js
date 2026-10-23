
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // 1. Mobile navigation
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("main-nav");
  const navItems = document.querySelectorAll(".nav-link");

  function closeMenu() {
    if (!navLinks || !menuToggle) return;

    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    navItems.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // 2. Light/dark theme — only one implementation
  const themeToggle = document.getElementById("theme-toggle");
  const themeColorMeta = document.querySelector(
    'meta[name="theme-color"]'
  );

  function applyTheme(theme) {
    const isLight = theme === "light";

    body.classList.toggle("light-theme", isLight);

    if (themeToggle) {
      themeToggle.textContent = isLight ? "☾" : "☼";
      themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
      );
      themeToggle.title = isLight
        ? "Switch to dark theme"
        : "Switch to light theme";
    }

    if (themeColorMeta) {
      themeColorMeta.content = isLight ? "#f5f7fc" : "#080b14";
    }
  }

  let savedTheme = "dark";

  try {
    savedTheme = localStorage.getItem("portfolio-theme") || "dark";
  } catch (error) {
    // Continue without saved preferences.
  }

  applyTheme(savedTheme === "light" ? "light" : "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = body.classList.contains("light-theme")
        ? "dark"
        : "light";

      applyTheme(nextTheme);

      try {
        localStorage.setItem("portfolio-theme", nextTheme);
      } catch (error) {
        // Theme switching still works for this session.
      }
    });
  }

  // 3. Reveal elements on scroll
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) =>
      element.classList.add("visible")
    );
  }

  // 4. Active navigation link
  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.id;

          navItems.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${currentId}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // 5. Copyright year
  const yearElement = document.getElementById("copyright-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 6. Contact form feedback
  const contactForm = document.getElementById("contact-form");
  const formNote = document.getElementById("form-note");

  if (contactForm && formNote) {
    contactForm.addEventListener("submit", (event) => {
      if (!contactForm.checkValidity()) {
        event.preventDefault();
        contactForm.reportValidity();
        return;
      }

      formNote.textContent =
        "Opening your default email application, if configured...";
    });
  }

  // 7. Profile image fallback
  const profileImage = document.querySelector(".profile-image");

  if (profileImage) {
    profileImage.addEventListener("error", () => {
      profileImage.style.display = "none";

      if (profileImage.parentElement) {
        profileImage.parentElement.style.background =
          "linear-gradient(135deg, #172554, #312e81)";
      }
    });
  }
});
