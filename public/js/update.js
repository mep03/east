document.addEventListener("DOMContentLoaded", async () => {
  let e = document.querySelector('script[src="/js/update.js"]'),
    t = e.getAttribute("sct"),
    n = window.location.pathname.split("/"),
    r = n[n.length - 1],
    a = document.getElementById("form"),
    o = document.getElementById("url"),
    d = document.getElementById("custum"),
    i = document.getElementById("alert-success"),
    l = document.getElementById("alert-error"),
    s = document.getElementById("message"),
    h = document.getElementById("error");
  (i.hidden = !0), (l.hidden = !0);
  try {
    let c = await fetch(`/api/v1/shorten/${r}`, {
      headers: { "Content-Type": "application/json", "API-Key": t },
    });
    c.ok ||
      ((h.textContent = "Short URL not found"),
      (l.hidden = !1),
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2500));
    let u = await c.json();
    (d.value = u.uniqueUrl), (o.value = u.originalUrl);
  } catch (y) {
    console.error("Error fetching data:", y),
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2500);
  }
  a.addEventListener("submit", async (e) => {
    e.preventDefault();
    let n = { shortUrl: d.value, originalUrl: o.value },
      a = await fetch(`/api/v1/shorten/${r}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "API-Key": t },
        body: JSON.stringify(n),
      }),
      c = await a.json();
    if (a.ok)
      (s.textContent = c.message),
        (i.hidden = !1),
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2500);
    else {
      (h.textContent = c.error),
        (l.hidden = !1),
        setTimeout(() => {
          l.hidden = !0;
        }, 2500);
      return;
    }
  });
});
