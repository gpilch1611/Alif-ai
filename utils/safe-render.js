export function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      })[char]
  );
}

export function safePdfUrl(value = "", baseUrl = globalThis.location?.href || "http://127.0.0.1/") {
  const text = String(value || "").trim();
  if (/^data:application\/pdf[;,]/i.test(text)) return text;
  try {
    const url = new URL(text, baseUrl);
    if (url.protocol === "https:" || url.protocol === "http:") return url.href;
  } catch {}
  return "";
}

export function setTrustedHtml(target, html, selector = (value) => document.querySelector(value)) {
  const el = typeof target === "string" ? selector(target) : target;
  if (!el) return;
  el.innerHTML = html;
}

export function appendTextBlock(target, tagName, className, text) {
  const el = document.createElement(tagName);
  if (className) el.className = className;
  el.textContent = text;
  target.appendChild(el);
  return el;
}
