// --- Navigation config ---
// Add new guides here. Supports flat items and grouped categories.
//   { title: "Page Title", path: "aptoide" }
//   { title: "Category", children: [ { title: "...", path: "..." }, ... ] }
const pages = [
  { title: "Aptoide Guide", path: "aptoide" },
];

const defaultPage = "aptoide";

// --- Resolve current page from URL path ---
// Picks the last non-empty path segment: /raid-guides/aptoide → "aptoide"
function currentPage() {
  var segments = location.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1] : defaultPage;
}

// Base path: everything before the current page segment
function basePath() {
  var path = location.pathname.replace(/\/+$/, "");
  var i = path.lastIndexOf("/");
  return i > 0 ? path.slice(0, i) : "";
}

// --- Build sidebar ---
function buildNav(items, container, base) {
  items.forEach(function(item) {
    if (item.children) {
      var groupTitle = document.createElement("li");
      groupTitle.className = "nav-group-title";
      groupTitle.textContent = item.title;
      container.appendChild(groupTitle);
      buildNav(item.children, container, base);
    } else {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = base + "/" + item.path;
      a.textContent = item.title;
      a.dataset.page = item.path;
      li.appendChild(a);
      container.appendChild(li);
    }
  });
}

function highlightActive(pagePath) {
  document.querySelectorAll(".nav-list a").forEach(function(a) {
    a.classList.toggle("active", a.dataset.page === pagePath);
  });
}

// --- Load markdown ---
async function loadPage(pagePath) {
  var contentEl = document.getElementById("content");
  highlightActive(pagePath);

  try {
    var resp = await fetch(basePath() + "/" + pagePath + ".md");
    if (!resp.ok) throw new Error("Not found");
    var md = await resp.text();
    contentEl.innerHTML = marked.parse(md);
  } catch(e) {
    contentEl.innerHTML = '<div class="error"><h2>Page not found</h2><p>Could not load <code>' +
      pagePath.replace(/</g, "&lt;") + '</code></p></div>';
  }
}

// --- Mobile sidebar ---
var sidebar = document.getElementById("sidebar");
var menuToggle = document.getElementById("menuToggle");

menuToggle.addEventListener("click", function() { sidebar.classList.toggle("open"); });

function closeSidebar() { sidebar.classList.remove("open"); }

document.getElementById("content").addEventListener("click", closeSidebar);

// --- Init ---
buildNav(pages, document.getElementById("navList"), basePath());
loadPage(currentPage());
