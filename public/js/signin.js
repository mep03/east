document.addEventListener("DOMContentLoaded", () => {
  let e = document.getElementById("form"),
    t = document.querySelector('script[src="/js/signin.js"]'),
    n = t.getAttribute("sct"),
    d = document.getElementById("alert-success"),
    r = document.getElementById("alert-error"),
    s = document.getElementById("message"),
    a = document.getElementById("error");
  (d.hidden = !0),
    (r.hidden = !0),
    e.addEventListener("submit", async (e) => {
      e.preventDefault();
      let t = document.getElementById("email").value,
        i = document.getElementById("password").value,
        o = await fetch("/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json", "API-Key": n },
          body: JSON.stringify({ email: t, password: i }),
        }),
        l = await o.json();
      if (o.ok)
        (s.textContent = l.message),
          (d.hidden = !1),
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2500);
      else {
        (a.textContent = l.error),
          (r.hidden = !1),
          setTimeout(() => {
            r.hidden = !0;
          }, 2500);
        return;
      }
    });
});
