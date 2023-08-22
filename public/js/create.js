document.addEventListener("DOMContentLoaded", () => {
  const signinForm = document.getElementById("form");
  const scriptElement = document.querySelector('script[src="/js/create.js"]');
  const apiKey = scriptElement.getAttribute("sct");
  const alertSuccess = document.getElementById("alert-success");
  const alertEror = document.getElementById("alert-error");
  const messageSuccess = document.getElementById("message");
  const messageError = document.getElementById("error");

  alertSuccess.hidden = true;
  alertEror.hidden = true;

  signinForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const originalUrl = document.getElementById("url").value;
    const customShortUrl = document.getElementById("custum").value;

    const response = await fetch("/api/v1/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": apiKey,
      },
      body: JSON.stringify({ originalUrl, customShortUrl }),
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
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
    }
  });
});
