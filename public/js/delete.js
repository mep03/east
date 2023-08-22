document.addEventListener("DOMContentLoaded", async () => {
  const scriptElement = document.querySelector('script[src="/js/delete.js"]');
  const apiKey = scriptElement.getAttribute("sct");
  const urlParts = window.location.pathname.split("/");
  const id = urlParts[urlParts.length - 1];
  const form = document.getElementById("form");
  const urlInput = document.getElementById("url");
  const custumInput = document.getElementById("custum");
  const alertSuccess = document.getElementById("alert-success");
  const alertEror = document.getElementById("alert-error");
  const messageSuccess = document.getElementById("message");
  const messageError = document.getElementById("error");

  alertSuccess.hidden = true;
  alertEror.hidden = true;

  try {
    const response = await fetch(`/api/v1/shorten/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "API-Key": apiKey,
      },
    });

    if (!response.ok) {
      messageError.textContent = "Short URL not found";
      alertEror.hidden = false;
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 3000);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const response = await fetch(`/api/v1/shorten/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "API-Key": apiKey,
      },
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
