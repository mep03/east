document.addEventListener("DOMContentLoaded", async () => {
  let e = document.querySelector('script[src="/js/delete.js"]'),
    t = e.getAttribute("sct"),
    n = window.location.pathname.split("/"),
    r = n[n.length - 1],
    a = document.getElementById("form"),
    o = document.getElementById("alert-success"),
    d = document.getElementById("alert-error"),
    s = document.getElementById("message"),
    i = document.getElementById("error");
  (o.hidden = !0), (d.hidden = !0);
  try {
    let h = await fetch(`/api/v1/shorten/${r}`, {
      headers: { "Content-Type": "application/json", "API-Key": t },
    });
    h.ok ||
      ((i.textContent = "Short URL not found"),
      (d.hidden = !1),
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2500));
  } catch (l) {
    console.error("Error fetching data:", l),
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2500);
  }
  a.addEventListener("submit", async (e) => {
    e.preventDefault();
    let n = await fetch(`/api/v1/shorten/${r}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "API-Key": t },
      }),
      a = await n.json();
    if (n.ok)
      (s.textContent = a.message),
        (o.hidden = !1),
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2500);
    else {
      (i.textContent = a.error),
        (d.hidden = !1),
        setTimeout(() => {
          d.hidden = !0;
        }, 2500);
      return;
    }
  });
});
