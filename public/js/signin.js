document.addEventListener("DOMContentLoaded", () => {
  const signinForm = document.getElementById("form");
  const scriptElement = document.querySelector('script[src="/js/signin.js"]');
  const apiKey = scriptElement.getAttribute("sct");
  const alertSuccess = document.getElementById("alert-success");
  const alertEror = document.getElementById("alert-error");
  const messageSuccess = document.getElementById("message");
  const messageError = document.getElementById("error");

  alertSuccess.hidden = true;
  alertEror.hidden = true;

  signinForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": apiKey,
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      messageSuccess.textContent = result.message;
      alertSuccess.hidden = false;
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
    } else {
      messageError.textContent = result.error;
      alertEror.hidden = false;
      return;
    }
  });
});
