const SUPABASE_URL = "https://amvgmfvjidukphbbblms.supabase.co";
const SUPABASE_KEY = "sb_publishable_GmzJPNZa8Ut8njNuJr7s6A_oYlEk-q_";
const DEFAULT_IMAGE = "product-placeholder.svg";

const clientLoginCard = document.querySelector("#clientLoginCard");
const clientLoginForm = document.querySelector("#clientLoginForm");
const clientProductsCard = document.querySelector("#clientProductsCard");
const clientProductsList = document.querySelector("#clientProductsList");
const clientSearch = document.querySelector("#clientSearch");
const clientStatus = document.querySelector("#clientStatus");
const clientLogoutButton = document.querySelector("#clientLogoutButton");
const clientRefreshButton = document.querySelector("#clientRefreshButton");
const clientToast = document.querySelector("#clientToast");
const clientOrderCard = document.querySelector("#clientOrderCard");
const clientOrderList = document.querySelector("#clientOrderList");
const clientOrderSummary = document.querySelector("#clientOrderSummary");
const clientExportOrderButton = document.querySelector("#clientExportOrderButton");
const clientClearOrderButton = document.querySelector("#clientClearOrderButton");

let clientSupabase = null;
let clientProducts = [];
let clientAccessCode = "";
let clientOrderItems = [];

function showClientToast(message) {
  clientToast.textContent = message;
  clientToast.classList.add("show");
  clearTimeout(showClientToast.timeout);
  showClientToast.timeout = setTimeout(() => clientToast.classList.remove("show"), 3000);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getClientProductImage(product) {
  if (Array.isArray(product.images) && product.images.length) return product.images[0];
  return product.image || DEFAULT_IMAGE;
}

function numberFromClientInput(value) {
  const parsed = Number(String(value ?? "").replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function formatClientPrice(value) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function safeClientFileName(value) {
  return String(value || "zamowienie-klienta")
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

function getClientProductById(productId) {
  return clientProducts.find((product) => String(product.id) === String(productId));
}

function getClientOrderTotal() {
  return clientOrderItems.reduce(
    (sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.price) || 0)),
    0,
  );
}

function renderClientOrder() {
  clientOrderCard.hidden = !clientAccessCode;
  const totalQuantity = clientOrderItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const totalValue = getClientOrderTotal();
  clientOrderSummary.textContent = clientOrderItems.length
    ? `${clientOrderItems.length} pozycji · ${totalQuantity} szt. · ${formatClientPrice(totalValue)}`
    : "Brak produktów w zamówieniu.";
  clientExportOrderButton.disabled = !clientOrderItems.length;
  clientClearOrderButton.disabled = !clientOrderItems.length;

  clientOrderList.innerHTML = clientOrderItems.length
    ? clientOrderItems.map((item) => {
      const value = (Number(item.quantity) || 0) * (Number(item.price) || 0);
      return `
        <div class="client-order-row">
          <span>${escapeHtml(item.name)}</span>
          <strong>${Number(item.quantity)} szt.</strong>
          <span>${formatClientPrice(item.price)}</span>
          <b>${formatClientPrice(value)}</b>
          <button type="button" data-client-remove-order="${escapeHtml(item.id)}" aria-label="Usuń z zamówienia">Usuń</button>
        </div>
      `;
    }).join("")
    : '<div class="client-empty">Kliknij „Dodaj do zamówienia” przy produkcie.</div>';
}

function addProductToClientOrder(productId) {
  const product = getClientProductById(productId);
  if (!product) return;
  const quantityInput = document.querySelector(`[data-client-quantity="${CSS.escape(String(productId))}"]`);
  const priceInput = document.querySelector(`[data-client-price="${CSS.escape(String(productId))}"]`);
  const quantity = Math.floor(numberFromClientInput(quantityInput?.value));
  const price = numberFromClientInput(priceInput?.value);

  if (quantity <= 0) {
    showClientToast("Wpisz ilość większą od zera.");
    quantityInput?.focus();
    return;
  }
  if (price <= 0) {
    showClientToast("Wpisz cenę większą od zera.");
    priceInput?.focus();
    return;
  }

  const existing = clientOrderItems.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity = quantity;
    existing.price = price;
  } else {
    clientOrderItems.push({
      id: product.id,
      name: product.name,
      category: product.category || "",
      machineType: product.machine_type || "",
      manufacturer: product.manufacturer || "",
      quantity,
      price,
    });
  }
  renderClientOrder();
  showClientToast(`Dodano do zamówienia: ${product.name}`);
}

function exportClientOrderToExcel() {
  if (!clientOrderItems.length) {
    showClientToast("Zamówienie jest puste.");
    return;
  }
  if (!window.XLSX) {
    showClientToast("Nie udało się załadować eksportu Excel.");
    return;
  }

  const orderDate = new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
  const orderTitle = `Zamówienie klienta ${clientAccessCode || "bez kodu"} dnia ${orderDate}`;
  const rows = clientOrderItems.map((item, index) => {
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    return [
      index + 1,
      item.name,
      item.machineType,
      item.manufacturer,
      quantity,
      price,
      Number((quantity * price).toFixed(2)),
    ];
  });

  const worksheet = window.XLSX.utils.aoa_to_sheet([
    [orderTitle],
    ["Kod klienta", clientAccessCode],
    [],
    ["Lp.", "Nazwa produktu", "Rodzaj maszyny", "Producent części", "Ilość", "Cena jednostkowa (PLN)", "Wartość (PLN)"],
    ...rows,
    [],
    ["", "", "", "Razem", "", "", Number(getClientOrderTotal().toFixed(2))],
  ]);
  worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];
  worksheet["!cols"] = [
    { wch: 6 },
    { wch: 34 },
    { wch: 24 },
    { wch: 24 },
    { wch: 12 },
    { wch: 22 },
    { wch: 18 },
  ];
  worksheet["!autofilter"] = { ref: `A4:G${rows.length + 4}` };
  if (worksheet.A1) {
    worksheet.A1.s = {
      font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "17243F" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }
  ["A4", "B4", "C4", "D4", "E4", "F4", "G4"].forEach((address) => {
    if (!worksheet[address]) return;
    worksheet[address].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "1F8E5F" } },
    };
  });
  rows.forEach((_row, index) => {
    const excelRow = index + 5;
    if (worksheet[`F${excelRow}`]) worksheet[`F${excelRow}`].z = '#,##0.00 "zł"';
    if (worksheet[`G${excelRow}`]) worksheet[`G${excelRow}`].z = '#,##0.00 "zł"';
  });
  const totalRow = rows.length + 6;
  if (worksheet[`G${totalRow}`]) worksheet[`G${totalRow}`].z = '#,##0.00 "zł"';

  const workbook = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(workbook, worksheet, "Zamówienie klienta");
  window.XLSX.writeFile(workbook, `${safeClientFileName(orderTitle)}.xlsx`);
  showClientToast("Pobrano zamówienie do Excela.");
}

function renderClientProducts() {
  const query = clientSearch.value.trim().toLocaleLowerCase("pl");
  const visibleProducts = clientProducts.filter((product) => {
    const searchable = [
      product.name,
      product.description,
      product.category,
      product.machine_type,
      product.manufacturer,
      product.availability,
    ].join(" ").toLocaleLowerCase("pl");
    return !query || searchable.includes(query);
  });

  clientStatus.textContent = visibleProducts.length
    ? `Widocznych produktów: ${visibleProducts.length}`
    : "Brak produktów przypisanych do tego kodu.";

  clientProductsList.innerHTML = visibleProducts.length
    ? visibleProducts.map((product) => `
      <article class="client-product-card">
        <div class="client-product-image">
          <img src="${escapeHtml(getClientProductImage(product))}" alt="Zdjęcie produktu: ${escapeHtml(product.name)}" />
        </div>
        <div class="client-product-info">
          <span>${escapeHtml(product.category || "Produkt")}</span>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.description || "Brak opisu.")}</p>
          <dl>
            <div>
              <dt>Rodzaj maszyny</dt>
              <dd>${escapeHtml(product.machine_type || "Nie podano")}</dd>
            </div>
            <div>
              <dt>Producent części</dt>
              <dd>${escapeHtml(product.manufacturer || "Nie podano")}</dd>
            </div>
          </dl>
        </div>
        <strong class="client-availability ${product.availability === "Dostępny" ? "available" : ""}">
          ${escapeHtml(product.availability || "Na zapytanie")}
        </strong>
        <div class="client-order-controls">
          <label>Ilość
            <input data-client-quantity="${escapeHtml(product.id)}" type="number" min="1" step="1" value="1" inputmode="numeric" />
          </label>
          <label>Cena
            <input data-client-price="${escapeHtml(product.id)}" type="number" min="0" step="0.01" placeholder="0,00" inputmode="decimal" />
          </label>
          <button type="button" class="primary-button" data-client-add-order="${escapeHtml(product.id)}">Dodaj do zamówienia</button>
        </div>
      </article>
    `).join("")
    : '<div class="client-empty">Nie znaleziono produktów dla tego kodu.</div>';
}

async function loadClientProducts() {
  if (!clientAccessCode) return;
  clientStatus.textContent = "Ładowanie produktów…";
  const { data, error } = await clientSupabase.rpc("get_client_products_by_code", {
    access_code: clientAccessCode,
  });
  if (error) {
    clientStatus.textContent = "Nie udało się pobrać produktów.";
    showClientToast("Sprawdź, czy uruchomiono najnowszy supabase-setup.sql.");
    return;
  }
  clientProducts = Array.isArray(data) ? data : [];
  renderClientProducts();
  renderClientOrder();
}

function setClientAccessCode(code, shouldLoad = true) {
  clientAccessCode = String(code || "").trim();
  localStorage.setItem("innoaim-client-access-code", clientAccessCode);
  clientLoginCard.hidden = Boolean(clientAccessCode);
  clientProductsCard.hidden = !clientAccessCode;
  clientOrderCard.hidden = !clientAccessCode;
  if (clientAccessCode && shouldLoad) loadClientProducts();
}

async function initializeClientApp() {
  if (!window.supabase?.createClient) {
    showClientToast("Nie udało się załadować połączenia z bazą.");
    return;
  }
  clientSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const savedCode = localStorage.getItem("innoaim-client-access-code") || "";
  if (savedCode) {
    clientLoginForm.elements.accessCode.value = savedCode;
    setClientAccessCode(savedCode);
  }
}

clientLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const accessCode = clientLoginForm.elements.accessCode.value.trim();
  const button = clientLoginForm.querySelector("button[type='submit']");
  button.disabled = true;
  button.textContent = "Sprawdzanie…";
  clientAccessCode = accessCode;
  const { data, error } = await clientSupabase.rpc("get_client_products_by_code", {
    access_code: accessCode,
  });
  button.disabled = false;
  button.textContent = "Pokaż produkty";
  if (error) {
    clientAccessCode = "";
    showClientToast(`Nie udało się sprawdzić kodu: ${error.message}`);
    return;
  }
  clientProducts = Array.isArray(data) ? data : [];
  setClientAccessCode(accessCode, false);
  renderClientProducts();
  renderClientOrder();
  showClientToast(clientProducts.length
    ? "Kod przyjęty. Produkty są widoczne."
    : "Kod przyjęty, ale nie ma jeszcze przypisanych produktów."
  );
});

clientLogoutButton.addEventListener("click", () => {
  clientAccessCode = "";
  localStorage.removeItem("innoaim-client-access-code");
  clientProducts = [];
  clientOrderItems = [];
  clientLoginCard.hidden = false;
  clientProductsCard.hidden = true;
  clientOrderCard.hidden = true;
  renderClientProducts();
  renderClientOrder();
  showClientToast("Możesz wpisać inny kod.");
});

clientRefreshButton.addEventListener("click", loadClientProducts);
clientSearch.addEventListener("input", renderClientProducts);
clientProductsList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-client-add-order]");
  if (!button) return;
  addProductToClientOrder(button.dataset.clientAddOrder);
});
clientOrderList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-client-remove-order]");
  if (!button) return;
  clientOrderItems = clientOrderItems.filter((item) => item.id !== button.dataset.clientRemoveOrder);
  renderClientOrder();
});
clientExportOrderButton.addEventListener("click", exportClientOrderToExcel);
clientClearOrderButton.addEventListener("click", () => {
  clientOrderItems = [];
  renderClientOrder();
  showClientToast("Zamówienie zostało wyczyszczone.");
});

initializeClientApp();
