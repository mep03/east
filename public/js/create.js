document.addEventListener("DOMContentLoaded", () => {
  let e = document.getElementById("form"),
    t = document.querySelector('script[src="/js/create.js"]'),
    n = t.getAttribute("sct"),
    r = document.getElementById("alert-success"),
    d = document.getElementById("alert-error"),
    a = document.getElementById("message"),
    s = document.getElementById("error");
  (r.hidden = !0),
    (d.hidden = !0),
    e.addEventListener("submit", async (e) => {
      e.preventDefault();
      let t = document.getElementById("url").value,
        o = document.getElementById("custum").value,
        l = await fetch("/api/v1/shorten", {
          method: "POST",
          headers: { "Content-Type": "application/json", "API-Key": n },
          body: JSON.stringify({ originalUrl: t, customShortUrl: o }),
        }),
        i = await l.json();
      l.ok
        ? ((a.textContent = i.message),
          (r.hidden = !1),
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2500))
        : ((s.textContent = i.error),
          (d.hidden = !1),
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2500));
    });
});
