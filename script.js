document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const header = document.getElementById("site-header");
    const themeButton = document.getElementById("theme-toggle");
    const menuButton = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    const progress = document.querySelector(".scroll-progress span");
    const sections = document.querySelectorAll("main section[id]");
    const navAnchors = document.querySelectorAll(".nav-links a");

    document.getElementById("year").textContent = new Date().getFullYear();

    const savedTheme = localStorage.getItem("rumana-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) root.dataset.theme = "dark";

    const syncThemeButton = () => {
        const dark = root.dataset.theme === "dark";
        themeButton.innerHTML = `<i class="fa-regular ${dark ? "fa-sun" : "fa-moon"}" aria-hidden="true"></i>`;
        themeButton.setAttribute("aria-label", dark ? "Enable light mode" : "Enable dark mode");
    };
    syncThemeButton();

    themeButton.addEventListener("click", () => {
        root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem("rumana-theme", root.dataset.theme);
        syncThemeButton();
    });

    const closeMenu = () => {
        navLinks.classList.remove("open");
        menuButton.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open menu");
    };

    menuButton.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuButton.classList.toggle("open", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    navAnchors.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

    const updatePageState = () => {
        header.classList.toggle("scrolled", window.scrollY > 30);
        const height = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = `${height > 0 ? (window.scrollY / height) * 100 : 0}%`;
    };
    updatePageState();
    window.addEventListener("scroll", updatePageState, { passive: true });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px" });
    document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navAnchors.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
        });
    }, { rootMargin: "-35% 0px -55%", threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
});
