/**
 * 郑嘉涛个人主页交互脚本 (js/main.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const navbar = document.getElementById("navbar");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-link");
  const toast = document.getElementById("toast");

  // 1. 深浅色主题切换与持久化
  const savedTheme = localStorage.getItem("zjt-theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    html.setAttribute("data-theme", savedTheme);
    themeIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";
  }

  themeToggle.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("zjt-theme", next);
    themeIcon.textContent = next === "dark" ? "☀️" : "🌙";
  });

  // 2. 移动端导航栏折叠
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });

  // 3. 滚动阴影与导航高亮
  const sections = document.querySelectorAll("main section[id]");
  const handleScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 12);

    let currentId = "home";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        currentId = sec.getAttribute("id");
      }
    });

    navItems.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // 4. 滚动渐显动画
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // 5. 一键复制微信号 / 视频号
  let toastTimer = null;
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  };

  document.querySelectorAll(".copy-wechat-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-wechat");
      try {
        await navigator.clipboard.writeText(text);
        showToast(`已复制：${text}`);
      } catch {
        const input = document.createElement("input");
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        showToast(`已复制：${text}`);
      }
    });
  });

  // 6. 图片灯箱预览（支持左右切换与 Esc 关闭）
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  const triggers = Array.from(document.querySelectorAll("[data-lightbox]"));
  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = (index + triggers.length) % triggers.length;
    const item = triggers[currentIndex];
    lightboxImg.src = item.getAttribute("data-lightbox");
    lightboxCaption.textContent = item.getAttribute("data-caption") || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  triggers.forEach((el, idx) => {
    el.addEventListener("click", () => openLightbox(idx));
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => openLightbox(currentIndex - 1));
  lightboxNext.addEventListener("click", () => openLightbox(currentIndex + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(currentIndex - 1);
    if (e.key === "ArrowRight") openLightbox(currentIndex + 1);
  });

  // 7. 自动更新页脚年份
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
