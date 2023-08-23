document.addEventListener("DOMContentLoaded", () => {
  let e = document.getElementById("form"),
    t = document.querySelector('script[src="/js/signup.js"]'),
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
        o = document.getElementById("confirmation").value;
      if (i !== o) {
        (a.textContent = "Password and confirm password do not match."),
          (r.hidden = !1),
          setTimeout(() => {
            r.hidden = !0;
          }, 2500);
        return;
      }
      let l = await fetch("/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json", "API-Key": n },
          body: JSON.stringify({ email: t, password: i }),
        }),
        m = await l.json();
      if (l.ok) {
        (s.textContent = m.message),
          (d.hidden = !1),
          setTimeout(() => {
            d.hidden = !0;
          }, 2500);
        return;
      }
      (a.textContent = m.error),
        (r.hidden = !1),
        setTimeout(() => {
          r.hidden = !0;
        }, 2500);
    });
});
