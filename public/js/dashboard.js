document.addEventListener("DOMContentLoaded", async () => {
  const scriptElement = document.querySelector(
    'script[src="/js/dashboard.js"]',
  );
  const apiKey = scriptElement.getAttribute("sct");

  const tables = {
    copy: document.getElementById("copy"),
    update: document.getElementById("update"),
    analytics: document.getElementById("analytics"),
  };

  async function fetchData() {
    const response = await fetch("/api/v1/shorten", {
      headers: {
        "Content-Type": "application/json",
        "API-Key": apiKey,
      },
    });
    const data = await response.json();
    return data;
  }

  async function populateTable(table, buttonClass, buttonText, actionCallback) {
    const data = await fetchData();
    let idCounter = 1;

    data.forEach((rowData) => {
      const row = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = idCounter++;
      row.appendChild(idCell);

      const shortLinkCell = document.createElement("td");
      shortLinkCell.textContent = rowData.uniqueUrl;
      row.appendChild(shortLinkCell);

      const originalLinkCell = document.createElement("td");
      originalLinkCell.textContent = rowData.originalUrl;
      row.appendChild(originalLinkCell);

      if (table === tables.analytics) {
        const clickCountLinkCell = document.createElement("td");
        const clickCountBadge = document.createElement("span");
        clickCountBadge.className = "badge";
        clickCountBadge.textContent = "Clicks " + rowData.clickCount;
        clickCountLinkCell.appendChild(clickCountBadge);
        row.appendChild(clickCountLinkCell);
      }

      const actionCell = document.createElement("td");
      const actionButton = document.createElement("button");
      actionButton.className = buttonClass;
      actionButton.textContent = buttonText;
      actionButton.addEventListener("click", () => {
        if (table === tables.copy) {
          actionCallback(rowData.shortUrl);
        } else {
          actionCallback(rowData.id);
        }
      });
      actionCell.appendChild(actionButton);
      row.appendChild(actionCell);

      table.appendChild(row);
    });
  }

  populateTable(tables.copy, "btn btn-sm btn-primary", "Copy", (shortUrl) => {
    copyToClipboard(shortUrl);
  });

  populateTable(tables.update, "btn btn-sm btn-info", "Update", (id) => {
    navigateToUpdatePage(id);
  });

  populateTable(tables.analytics, "btn btn-sm btn-warning", "Delete", (id) => {
    navigateToDeletePage(id);
  });
});

function copyToClipboard(text) {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}

function navigateToUpdatePage(id) {
  const updateUrl = `/dashboard/update/${id}`;
  window.location.href = updateUrl;
}

function navigateToDeletePage(id) {
  const deleteUrl = `/dashboard/delete/${id}`;
  window.location.href = deleteUrl;
}
