document.addEventListener("DOMContentLoaded", () => {
  const startedForm = document.getElementById("form");
  const scriptElement = document.querySelector('script[src="/js/signup.js"]');
  const apiKey = scriptElement.getAttribute("sct");
  const alertSuccess = document.getElementById("alert-success");
  const alertEror = document.getElementById("alert-error");
  const messageSuccess = document.getElementById("message");
  const messageError = document.getElementById("error");

  alertSuccess.hidden = true;
  alertEror.hidden = true;

  startedForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmation").value;

    if (password !== confirmPassword) {
      messageError.textContent = "Password and confirm password do not match.";
      alertEror.hidden = false;
      return;
    }

    const response = await fetch("/auth/signup", {
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
      return;
    } else {
      messageError.textContent = result.error;
      alertEror.hidden = false;
      return;
    }
  });
});
