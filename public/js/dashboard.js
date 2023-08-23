function copyToClipboard(e) {
  let t = document.createElement("input");
  (t.value = e),
    document.body.appendChild(t),
    t.select(),
    document.execCommand("copy"),
    document.body.removeChild(t);
}
function navigateToUpdatePage(e) {
  let t = `/dashboard/update/${e}`;
  window.location.href = t;
}
function navigateToDeletePage(e) {
  let t = `/dashboard/delete/${e}`;
  window.location.href = t;
}
document.addEventListener("DOMContentLoaded", async () => {
  let e = document.querySelector('script[src="/js/dashboard.js"]'),
    t = e.getAttribute("sct"),
    n = {
      copy: document.getElementById("copy"),
      update: document.getElementById("update"),
      analytics: document.getElementById("analytics"),
    };
  async function a() {
    let e = await fetch("/api/v1/shorten", {
        headers: { "Content-Type": "application/json", "API-Key": t },
      }),
      n = await e.json();
    return n;
  }
  async function l(e, t, l, d) {
    let o = await a(),
      i = 1;
    o.forEach((a) => {
      let o = document.createElement("tr"),
        c = document.createElement("td");
      (c.textContent = i++), o.appendChild(c);
      let p = document.createElement("td");
      (p.textContent = a.uniqueUrl), o.appendChild(p);
      let r = document.createElement("td");
      if (
        ((r.textContent = a.originalUrl), o.appendChild(r), e === n.analytics)
      ) {
        let s = document.createElement("td"),
          y = document.createElement("span");
        (y.className = "badge"),
          (y.textContent = a.clickCount),
          s.appendChild(y),
          o.appendChild(s);
      }
      let C = document.createElement("td"),
        m = document.createElement("button");
      (m.className = t),
        (m.textContent = l),
        m.addEventListener("click", () => {
          e === n.copy ? d(a.shortUrl) : d(a.id);
        }),
        C.appendChild(m),
        o.appendChild(C),
        e.appendChild(o);
    });
  }
  l(n.copy, "btn btn-sm btn-primary", "Copy", (e) => {
    copyToClipboard(e);
  }),
    l(n.update, "btn btn-sm btn-info", "Update", (e) => {
      navigateToUpdatePage(e);
    }),
    l(n.analytics, "btn btn-sm btn-warning", "Delete", (e) => {
      navigateToDeletePage(e);
    });
});
