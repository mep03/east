document.addEventListener("DOMContentLoaded", async () => {
  const scriptElement = document.querySelector(
    'script[src="/js/dashboard.js"]',
  );
  const apiKey = scriptElement.getAttribute("sct");
  const table1 = document.getElementById("copy");
  const table2 = document.getElementById("update");
  const table3 = document.getElementById("analytics");

  fetch("/api/v1/shorten", {
    headers: {
      "Content-Type": "application/json",
      "API-Key": apiKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((rowData) => {
        const row = document.createElement("tr");

        let idCounter = 1;

        const idCell = document.createElement("td");
        idCell.textContent = idCounter++;
        row.appendChild(idCell);

        const shortLinkCell = document.createElement("td");
        shortLinkCell.textContent = rowData.uniqueUrl;
        row.appendChild(shortLinkCell);

        const originalLinkCell = document.createElement("td");
        originalLinkCell.textContent = rowData.originalUrl;
        row.appendChild(originalLinkCell);

        const actionCell = document.createElement("td");
        const copyButton = document.createElement("button");
        copyButton.className = "btn btn-sm btn-primary";
        copyButton.textContent = "Copy";
        copyButton.addEventListener("click", () => {
          copyToClipboard(rowData.shortUrl);
        });
        actionCell.appendChild(copyButton);
        row.appendChild(actionCell);

        table1.appendChild(row);
      });
    });

  fetch("/api/v1/shorten", {
    headers: {
      "Content-Type": "application/json",
      "API-Key": apiKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((rowData) => {
        const row = document.createElement("tr");

        let idCounter = 1;

        const idCell = document.createElement("td");
        idCell.textContent = idCounter++;
        row.appendChild(idCell);

        const shortLinkCell = document.createElement("td");
        shortLinkCell.textContent = rowData.uniqueUrl;
        row.appendChild(shortLinkCell);

        const originalLinkCell = document.createElement("td");
        originalLinkCell.textContent = rowData.originalUrl;
        row.appendChild(originalLinkCell);

        const actionCell = document.createElement("td");
        const updateButton = document.createElement("button");
        updateButton.className = "btn btn-sm btn-info";
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", () => {
          navigateToUpdatePage(rowData.id);
        });
        actionCell.appendChild(updateButton);
        row.appendChild(actionCell);

        table2.appendChild(row);
      });
    });

  fetch("/api/v1/shorten", {
    headers: {
      "Content-Type": "application/json",
      "API-Key": apiKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((rowData) => {
        const row = document.createElement("tr");

        let idCounter = 1;

        const idCell = document.createElement("td");
        idCell.textContent = idCounter++;
        row.appendChild(idCell);

        const shortLinkCell = document.createElement("td");
        shortLinkCell.textContent = rowData.uniqueUrl;
        row.appendChild(shortLinkCell);

        const originalLinkCell = document.createElement("td");
        originalLinkCell.textContent = rowData.originalUrl;
        row.appendChild(originalLinkCell);

        const clickCountLinkCell = document.createElement("td");
        const clickCountBadge = document.createElement("span");
        clickCountBadge.className = "badge";
        clickCountBadge.textContent = "Clicks " + rowData.clickCount;
        clickCountLinkCell.appendChild(clickCountBadge);
        row.appendChild(clickCountLinkCell);

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-sm btn-warning";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
          navigateToDeletePage(rowData.id);
        });
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        table3.appendChild(row);
      });
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
