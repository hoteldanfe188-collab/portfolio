/* =========================================================================
   SCRIPT.JS
   Loads all content from the JSON files in /content/ and renders it into
   the page. Handles navigation, dark mode, portfolio filtering, and the
   contact form.

   You should not normally need to edit this file. To change what's on
   the site, either:
   - use the admin panel at /admin/ (recommended), or
   - edit the JSON files in /content/ directly.

   NOTE: fetch() requires the page to be served over http(s), not opened
   directly as a file:// URL. Use a local server (see README.md) when
   previewing on your own computer.
   ========================================================================= */

let siteData, statsData, skillsData, toolsData, portfolioItems, websitesData, experienceData;
let portfolioCta = {};

const CONTENT_FILES = {
  site: "content/settings.json",
  stats: "content/stats.json",
  skills: "content/skills.json",
  tools: "content/tools.json",
  portfolio: "content/portfolio.json",
  websites: "content/websites.json",
  experience: "content/experience.json"
};

async function loadContent() {
  const entries = Object.entries(CONTENT_FILES);
  const results = await Promise.all(
    entries.map(([, path]) =>
      fetch(path, { cache: "no-store" }).then(r => {
        if (!r.ok) throw new Error(`Failed to load ${path}`);
        return r.json();
      })
    )
  );
  const data = {};
  entries.forEach(([key], i) => (data[key] = results[i]));

  siteData = data.site;
  statsData = data.stats.stats;
  skillsData = data.skills.skills;
  toolsData = data.tools.tools;
  portfolioItems = data.portfolio.items;
  portfolioCta = { text: data.portfolio.driveCtaText || "", url: data.portfolio.driveCtaUrl || "" };
  websitesData = data.websites.items;
  experienceData = data.experience.items;
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadContent();
  } catch (err) {
    console.error(err);
    document.getElementById("main").innerHTML =
      '<p style="padding:4rem 1.5rem;max-width:640px;">Could not load site content. If you are previewing this file locally, make sure you are using a local server (see README.md) rather than opening index.html directly, since content is loaded from JSON files.</p>';
    return;
  }

  renderSite();
  renderAbout();
  renderStats();
  renderSkills();
  renderTools();
  renderFeatured();
  renderPortfolio();
  renderWebsites();
  renderExperience();
  renderContactInfo();

  setupNav();
  setupThemeToggle();
  setupContactForm();
  setupScrollAnimations();

  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- small helpers ---------- */
function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

/* ---------- hero / brand / social ---------- */
function renderSite() {
  document.title = `${siteData.name} | ${siteData.title}`;
  document.getElementById("heroName").textContent = siteData.name;
  document.getElementById("heroTagline").textContent = siteData.tagline;
  document.getElementById("footerName").textContent = siteData.name;

  const img = document.getElementById("heroImage");
  img.src = siteData.profileImage;
  img.alt = `Portrait of ${siteData.name}`;

  if (siteData.favicon) {
    document.getElementById("faviconLink").href = siteData.favicon;
  }

  const social = document.getElementById("heroSocial");
  const links = [
    { url: `mailto:${siteData.email}`, label: "Email", icon: iconEmail() },
    { url: siteData.linkedin, label: "LinkedIn", icon: iconLinkedIn() },
    { url: siteData.github, label: "GitHub", icon: iconGitHub() }
  ];
  links.forEach(l => {
    if (!l.url) return;
    const a = el("a", "", l.icon);
    a.href = l.url;
    a.setAttribute("aria-label", l.label);
    a.target = l.url.startsWith("mailto:") ? "_self" : "_blank";
    a.rel = "noopener";
    social.appendChild(a);
  });
}

function iconEmail() {
  return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>`;
}
function iconLinkedIn() {
  return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.5 10.5v6M7.5 7.75v.01M12 16.5v-3.75a2.25 2.25 0 0 1 4.5 0v3.75M12 12.75v3.75"/></svg>`;
}
function iconGitHub() {
  return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2a10 10 0 0 0-3.16 19.5c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>`;
}

/* ---------- about ---------- */
function renderAbout() {
  const copy = document.getElementById("aboutCopy");
  siteData.aboutParagraphs.forEach(p => copy.appendChild(el("p", "", p)));

  document.getElementById("yearsNumber").textContent = siteData.yearsExperience + "+";

  const list = document.getElementById("aboutFocusList");
  siteData.aboutFocusAreas.forEach(item => list.appendChild(el("li", "", item)));
}

/* ---------- stats ---------- */
function renderStats() {
  const grid = document.getElementById("statsGrid");
  statsData.forEach(s => {
    const item = el("div", "stat");
    item.appendChild(el("span", "stat__number", s.number));
    item.appendChild(el("span", "stat__label", s.label));
    grid.appendChild(item);
  });
}

/* ---------- skills ---------- */
function renderSkills() {
  const grid = document.getElementById("skillsGrid");
  skillsData.forEach(s => {
    const wrap = el("div", "skill-item");
    const top = el("div", "skill-item__top", `<span>${s.name}</span><span>${s.level}/5</span>`);
    const bar = el("div", "skill-bar");
    const fill = el("div", "skill-bar__fill");
    fill.style.width = (s.level / 5) * 100 + "%";
    bar.appendChild(fill);
    wrap.appendChild(top);
    wrap.appendChild(bar);
    grid.appendChild(wrap);
  });
}

/* ---------- tools ---------- */
function renderTools() {
  const list = document.getElementById("toolsList");
  toolsData.forEach(t => list.appendChild(el("li", "", t)));
}

/* ---------- portfolio card builder (shared by featured + portfolio) ---------- */
function buildPortfolioCard(item) {
  const card = el("article", "card");

  const imgWrap = el("div", "card__image");
  const img = el("img");
  img.src = item.image;
  img.alt = item.title;
  img.loading = "lazy";
  imgWrap.appendChild(img);
  card.appendChild(imgWrap);

  const body = el("div", "card__body");
  body.appendChild(el("span", "tag", CATEGORY_LABELS[item.category] || item.category));
  body.appendChild(el("h3", "card__title", item.title));
  body.appendChild(el("p", "card__desc", item.description));

  const meta = el("div", "card__meta");
  meta.innerHTML = `
    <span><strong>Client:</strong> ${item.client}</span>
    <span><strong>Date:</strong> ${formatDate(item.date)}</span>
    <span><strong>Keyword:</strong> ${item.keyword}</span>
    <span><strong>Type:</strong> ${item.articleType}</span>
  `;
  body.appendChild(meta);

  const actions = el("div", "card__actions");
  if (item.liveUrl) {
    const a = el("a", "btn btn--primary btn--small", "Read Article");
    a.href = item.liveUrl;
    a.target = "_blank";
    a.rel = "noopener";
    actions.appendChild(a);
  }
  if (item.docUrl) {
    const a = el("a", "btn btn--outline btn--small", "View Google Doc");
    a.href = item.docUrl;
    a.target = "_blank";
    a.rel = "noopener";
    actions.appendChild(a);
  }
  body.appendChild(actions);
  card.appendChild(body);

  // CreativeWork schema per article
  const schema = el("script");
  schema.type = "application/ld+json";
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "headline": item.title,
    "author": { "@type": "Person", "name": siteData.name },
    "datePublished": item.date,
    "about": item.keyword
  });
  card.appendChild(schema);

  return card;
}

/* ---------- featured ---------- */
function renderFeatured() {
  const grid = document.getElementById("featuredGrid");
  const featured = portfolioItems.filter(p => p.featured);
  featured.forEach(item => grid.appendChild(buildPortfolioCard(item)));
}

/* ---------- portfolio + filters ---------- */
const CATEGORY_LABELS = {
  "all": "All",
  "seo-blogs": "SEO Blogs",
  "website-content": "Website Content",
  "travel": "Travel",
  "education": "Education",
  "technology": "Technology",
  "finance": "Finance",
  "health": "Health",
  "other": "Other"
};

const PORTFOLIO_PAGE_SIZE = 3;

function renderPortfolio() {
  const filtersWrap = document.getElementById("portfolioFilters");
  const grid = document.getElementById("portfolioGrid");
  const emptyMsg = document.getElementById("portfolioEmpty");
  const viewMoreBtn = document.getElementById("portfolioViewMore");

  // render cards once, tag with data-category
  const cardsByCategory = [];
  portfolioItems.forEach(item => {
    const card = buildPortfolioCard(item);
    card.dataset.category = item.category;
    grid.appendChild(card);
    cardsByCategory.push(card);
  });

  let currentFilter = "all";
  let expanded = false;

  function applyFilter() {
    const matches = cardsByCategory.filter(
      card => currentFilter === "all" || card.dataset.category === currentFilter
    );
    const limit = expanded ? matches.length : PORTFOLIO_PAGE_SIZE;

    cardsByCategory.forEach(card => card.classList.add("is-hidden"));
    matches.forEach((card, i) => {
      card.classList.toggle("is-hidden", i >= limit);
    });

    emptyMsg.hidden = matches.length !== 0;
    viewMoreBtn.hidden = matches.length <= PORTFOLIO_PAGE_SIZE || expanded;
  }

  viewMoreBtn.addEventListener("click", () => {
    expanded = true;
    applyFilter();
  });

  // render filter buttons
  Object.keys(CATEGORY_LABELS).forEach((key, i) => {
    const btn = el("button", "filter-btn", CATEGORY_LABELS[key]);
    btn.type = "button";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
    btn.dataset.filter = key;
    btn.addEventListener("click", () => {
      filtersWrap.querySelectorAll(".filter-btn").forEach(b => b.setAttribute("aria-selected", "false"));
      btn.setAttribute("aria-selected", "true");
      currentFilter = key;
      expanded = false;
      applyFilter();
    });
    filtersWrap.appendChild(btn);
  });

  applyFilter();

  // Drive CTA row — only show if both a message and a URL are set
  const ctaWrap = document.getElementById("portfolioCta");
  if (portfolioCta.text && portfolioCta.url) {
    document.getElementById("portfolioCtaText").textContent = portfolioCta.text;
    const ctaBtn = document.getElementById("portfolioCtaBtn");
    ctaBtn.href = portfolioCta.url;
    ctaWrap.hidden = false;
  }
}

/* ---------- websites ---------- */
function renderWebsites() {
  const grid = document.getElementById("websitesGrid");
  websitesData.forEach(w => {
    const card = el("a", "website-card");
    card.href = w.url;
    card.target = "_blank";
    card.rel = "noopener";

    const logo = el("div", "website-card__logo");
    const img = el("img");
    img.src = w.logo;
    img.alt = `${w.name} logo`;
    img.loading = "lazy";
    logo.appendChild(img);
    card.appendChild(logo);

    const info = el("div");
    info.appendChild(el("h3", "website-card__name", w.name));
    info.appendChild(el("p", "website-card__desc", w.description));
    info.appendChild(el("span", "website-card__type", w.contentType));
    card.appendChild(info);

    grid.appendChild(card);
  });
}

/* ---------- experience ---------- */
function renderExperience() {
  const timeline = document.getElementById("timeline");
  experienceData.forEach(exp => {
    const item = el("li", "timeline__item");
    item.appendChild(el("p", "timeline__dates", `${exp.start} — ${exp.end}`));
    item.appendChild(el("h3", "timeline__role", exp.role));
    item.appendChild(el("p", "timeline__company", exp.company));
    item.appendChild(el("p", "timeline__desc", exp.description));

    if (exp.responsibilities && exp.responsibilities.length) {
      const list = el("ul", "timeline__list");
      exp.responsibilities.forEach(r => list.appendChild(el("li", "", r)));
      item.appendChild(list);
    }

    if (exp.achievements && exp.achievements.length) {
      const wrap = el("div", "timeline__achievements");
      wrap.appendChild(el("p", "timeline__achievements-title", "Key achievements"));
      const list = el("ul", "timeline__list");
      exp.achievements.forEach(a => list.appendChild(el("li", "", a)));
      wrap.appendChild(list);
      item.appendChild(wrap);
    }

    timeline.appendChild(item);
  });
}

/* ---------- contact info list ---------- */
function renderContactInfo() {
  const list = document.getElementById("contactList");
  const items = [
    { label: "Email", value: siteData.email, href: `mailto:${siteData.email}` },
    { label: "LinkedIn", value: "View profile", href: siteData.linkedin },
    { label: "GitHub", value: "View profile", href: siteData.github }
  ];
  if (siteData.phone) items.push({ label: "Phone", value: siteData.phone, href: `tel:${siteData.phone}` });

  items.forEach(i => {
    if (!i.href) return;
    const li = el("li");
    const a = el("a", "", `${i.label}: ${i.value}`);
    a.href = i.href;
    if (!i.href.startsWith("mailto:") && !i.href.startsWith("tel:")) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    li.appendChild(a);
    list.appendChild(li);
  });
}

/* ---------- nav (mobile menu + smooth close on link click) ---------- */
function setupNav() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });
}

/* ---------- dark mode (persisted with localStorage) ---------- */
function setupThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = stored || (prefersDark ? "dark" : "light");
  applyTheme(initial);

  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      toggle.setAttribute("aria-pressed", "true");
      toggle.setAttribute("aria-label", "Switch to light mode");
    } else {
      root.removeAttribute("data-theme");
      toggle.setAttribute("aria-pressed", "false");
      toggle.setAttribute("aria-label", "Switch to dark mode");
    }
  }
}

/* ---------- contact form (Netlify AJAX submit) ---------- */
/* ---------- scroll-reveal animations ---------- */
function setupScrollAnimations() {
  const selectors = [
    ".section__head",
    ".card",
    ".stat",
    ".website-card",
    ".skill-item",
    ".timeline__item",
    ".resume__card",
    ".contact__card",
    ".about__side"
  ];
  const targets = document.querySelectorAll(selectors.join(","));
  if (!("IntersectionObserver" in window) || targets.length === 0) {
    targets.forEach(t => t.classList.add("is-visible"));
    return;
  }

  targets.forEach(t => t.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach(t => observer.observe(t));
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");

  form.addEventListener("submit", (e) => {
    // If deployed on Netlify, let AJAX submission happen so the page doesn't
    // reload; Netlify still records the submission from the POST below.
    e.preventDefault();

    const data = new FormData(form);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data).toString()
    })
      .then(() => {
        note.hidden = false;
        form.reset();
      })
      .catch(() => {
        // Fallback: submit the form normally if the AJAX request fails
        // (e.g. when testing locally without Netlify).
        form.submit();
      });
  });
}
