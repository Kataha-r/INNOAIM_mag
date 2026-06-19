const STORAGE_KEY = "stockly-products-v2";
const DEFAULT_IMAGE = "product-placeholder.svg";
const SUPABASE_URL = "https://amvgmfvjidukphbbblms.supabase.co";
const SUPABASE_KEY = "sb_publishable_GmzJPNZa8Ut8njNuJr7s6A_oYlEk-q_";

const defaultProduct = {
  id: crypto.randomUUID(),
  name: "Płytka testowa 1",
  category: "Inne",
  machineType: "Płytka testowa",
  location: "A/1/1",
  description: "Płytka z dużą liczbą elementów montowanych powierzchniowo.",
  stock: 0,
  required: 50,
  ordered: 16,
  sent: 0,
  purchasePrice: 0,
  manufacturer: "",
  image: "product-placeholder.svg",
  images: [],
};

const modal = document.querySelector("#editModal");
const form = document.querySelector("#productForm");
const toast = document.querySelector("#toast");
const editButton = document.querySelector("#editButton");
const newProductButton = document.querySelector("#newProductButton");
const stockButton = document.querySelector("#stockButton");
const productSelect = document.querySelector("#productSelect");
const modalTitle = document.querySelector("#modalTitle");
const submitButton = document.querySelector("#submitButton");
const imageInput = document.querySelector("#imageInput");
const imagePreviews = document.querySelector("#imagePreviews");
const productGalleryThumbs = document.querySelector("#productGalleryThumbs");
const detailView = document.querySelector("#detailView");
const productsView = document.querySelector("#productsView");
const productsList = document.querySelector("#productsList");
const productsCount = document.querySelector("#productsCount");
const allProductsButton = document.querySelector("#allProductsButton");
const viewButtonLabel = document.querySelector("#viewButtonLabel");
const pageTitle = document.querySelector("#pageTitle");
const deleteProductButton = document.querySelector("#deleteProductButton");
const syncStatus = document.querySelector("#syncStatus");
const loginButton = document.querySelector("#loginButton");
const authModal = document.querySelector("#authModal");
const authForm = document.querySelector("#authForm");
const closeAuthModal = document.querySelector("#closeAuthModal");
const productSearch = document.querySelector("#productSearch");
const shelfFilter = document.querySelector("#shelfFilter");
const categoryFilter = document.querySelector("#categoryFilter");
const machineTypeFilter = document.querySelector("#machineTypeFilter");
const manufacturerFilter = document.querySelector("#manufacturerFilter");
const clearFiltersButton = document.querySelector("#clearFiltersButton");
const exportExcelButton = document.querySelector("#exportExcelButton");
const locationShelf = document.querySelector("#locationShelf");
const importExcelInput = document.querySelector("#importExcelInput");
const backupButton = document.querySelector("#backupButton");
const restoreBackupInput = document.querySelector("#restoreBackupInput");
const locationSuggestion = document.querySelector("#locationSuggestion");

let products = loadProducts();
let currentProductId = products[0].id;
let formMode = "edit";
let pendingImages = getProductImages(products[0]);
let activeImageIndex = 0;
let currentView = "list";
let supabaseClient = null;
let currentUser = null;
let realtimeChannel = null;
let cloudBusy = false;

function loadProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const loaded = Array.isArray(saved) && saved.length ? saved : [defaultProduct];
    return loaded.slice(0, 100).map((product) => {
      const hasMachineType = typeof product.machineType === "string";
      const images = Array.isArray(product.images) && product.images.length
        ? product.images.slice(0, 3)
        : (product.image && product.image !== DEFAULT_IMAGE ? [product.image] : []);
      return {
        ...product,
        category: ["Fujiseiki", "ACE System", "Inne"].includes(product.category) && hasMachineType
          ? product.category
          : "Inne",
        machineType: hasMachineType ? product.machineType : (product.category || ""),
        location: normalizeLocation(product.location),
        purchasePrice: Number(product.purchasePrice) || 0,
        sent: Number(product.sent) || 0,
        manufacturer: product.manufacturer || "",
        images,
        image: images[0] || DEFAULT_IMAGE,
      };
    });
  } catch {
    return [defaultProduct];
  }
}

function normalizeLocation(location) {
  const parts = String(location || "").split("/").filter(Boolean);
  while (parts.length < 3) parts.push("1");
  return parts.slice(0, 3).join("/").toUpperCase();
}

function getProductImages(product) {
  if (Array.isArray(product?.images) && product.images.length) return product.images.slice(0, 3);
  if (product?.image && product.image !== DEFAULT_IMAGE) return [product.image];
  return [DEFAULT_IMAGE];
}

function getStoredImages(product) {
  return getProductImages(product).filter((image) => image && image !== DEFAULT_IMAGE).slice(0, 3);
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function setSyncStatus(state, text) {
  syncStatus.className = `sync-status ${state}`;
  syncStatus.querySelector("span").textContent = text;
}

function toDatabaseProduct(product) {
  return {
    id: product.id,
    owner_id: currentUser.id,
    name: product.name,
    category: product.category,
    machine_type: product.machineType || "",
    location: normalizeLocation(product.location),
    description: product.description || "",
    stock: Number(product.stock) || 0,
    required: Number(product.required) || 0,
    ordered: Number(product.ordered) || 0,
    sent: Number(product.sent) || 0,
    purchase_price: Number(product.purchasePrice) || 0,
    manufacturer: product.manufacturer || "",
    image: getStoredImages(product)[0] || "",
    images: getStoredImages(product),
  };
}

function fromDatabaseProduct(product) {
  const hasValidCategory = ["Fujiseiki", "ACE System", "Inne"].includes(product.category);
  return {
    id: product.id,
    name: product.name,
    category: hasValidCategory ? product.category : "Inne",
    machineType: product.machine_type || (hasValidCategory ? "" : product.category) || "",
    location: normalizeLocation(product.location),
    description: product.description || "",
    stock: Number(product.stock) || 0,
    required: Number(product.required) || 0,
    ordered: Number(product.ordered) || 0,
    sent: Number(product.sent) || 0,
    purchasePrice: Number(product.purchase_price) || 0,
    manufacturer: product.manufacturer || "",
    images: Array.isArray(product.images) && product.images.length
      ? product.images.slice(0, 3)
      : (product.image ? [product.image] : []),
    image: (Array.isArray(product.images) && product.images[0]) || product.image || DEFAULT_IMAGE,
  };
}

async function loadCloudProducts({ importLocalIfEmpty = false, quiet = false } = {}) {
  if (!supabaseClient || !currentUser || cloudBusy) return;
  cloudBusy = true;
  setSyncStatus("", "Synchronizacja…");

  try {
    const { data, error } = await supabaseClient
      .from("products")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(100);
    if (error) throw error;

    if (!data.length && importLocalIfEmpty && products.length) {
      const { error: insertError } = await supabaseClient
        .from("products")
        .insert(products.map(toDatabaseProduct));
      if (insertError) throw insertError;
    } else if (data.length) {
      const selectedId = currentProductId;
      products = data.map(fromDatabaseProduct);
      currentProductId = products.some((product) => product.id === selectedId)
        ? selectedId
        : products[0].id;
      saveProducts();
      renderProduct();
      renderProductsList();
    }

    setSyncStatus("online", "Zsynchronizowano");
  } catch (error) {
    setSyncStatus("error", "Błąd synchronizacji");
    if (!quiet) {
      showToast(error.message.includes("products")
        ? "Uruchom plik supabase-setup.sql w Supabase."
        : "Nie udało się połączyć z Supabase.");
    }
  } finally {
    cloudBusy = false;
  }
}

function subscribeToCloudChanges() {
  if (!supabaseClient || !currentUser) return;
  if (realtimeChannel) supabaseClient.removeChannel(realtimeChannel);
  realtimeChannel = supabaseClient
    .channel("shared-warehouse-products")
    .on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "products",
    }, () => loadCloudProducts({ quiet: true }))
    .subscribe();
}

async function handleSession(session, firstLoad) {
  currentUser = session?.user || null;
  if (!currentUser) {
    loginButton.textContent = "Zaloguj";
    loginButton.classList.remove("logged-in");
    setSyncStatus("", "Tryb lokalny");
    return;
  }

  loginButton.textContent = "Wyloguj";
  loginButton.classList.add("logged-in");
  subscribeToCloudChanges();
  await loadCloudProducts({ importLocalIfEmpty: firstLoad });
}

async function initializeSupabase() {
  if (!window.supabase?.createClient) {
    setSyncStatus("error", "Tryb lokalny");
    return;
  }

  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data } = await supabaseClient.auth.getSession();
  await handleSession(data.session, true);
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    setTimeout(() => handleSession(session, false), 0);
  });
}

async function saveProductToCloud(product, isNew) {
  if (!currentUser) return;
  setSyncStatus("", "Zapisywanie…");
  const query = isNew
    ? supabaseClient.from("products").insert(toDatabaseProduct(product))
    : supabaseClient.from("products").update(toDatabaseProduct(product)).eq("id", product.id);
  const { error } = await query;
  if (error) throw error;
  setSyncStatus("online", "Zsynchronizowano");
}

async function removeProductFromCloud(productId) {
  if (!currentUser) return;
  setSyncStatus("", "Usuwanie…");
  const { error } = await supabaseClient.from("products").delete().eq("id", productId);
  if (error) throw error;
  setSyncStatus("online", "Zsynchronizowano");
}

async function replaceCloudProducts(nextProducts) {
  if (!currentUser) return;
  setSyncStatus("", "Przywracanie…");
  const { error: deleteError } = await supabaseClient
    .from("products")
    .delete()
    .eq("owner_id", currentUser.id);
  if (deleteError) throw deleteError;
  if (nextProducts.length) {
    const { error: insertError } = await supabaseClient
      .from("products")
      .insert(nextProducts.map(toDatabaseProduct));
    if (insertError) throw insertError;
  }
  setSyncStatus("online", "Zsynchronizowano");
}

function getCurrentProduct() {
  return products.find((product) => product.id === currentProductId) || products[0];
}

function refreshProductSelect() {
  productSelect.innerHTML = products
    .map((product) => `<option value="${product.id}">${escapeHtml(product.name)}</option>`)
    .join("");
  productSelect.value = currentProductId;
}

function renderProduct() {
  const product = getCurrentProduct();
  if (!product) return;
  const images = getProductImages(product);
  if (activeImageIndex >= images.length) activeImageIndex = 0;

  document.querySelectorAll("[data-field]").forEach((element) => {
    const key = element.dataset.field;
    if (key in product) element.textContent = product[key];
  });
  document.querySelectorAll("[data-product-image]").forEach((image) => {
    image.src = images[activeImageIndex] || DEFAULT_IMAGE;
    image.alt = `Zdjęcie produktu: ${product.name}`;
  });
  productGalleryThumbs.innerHTML = images.map((source, index) => `
    <button class="gallery-thumb ${index === activeImageIndex ? "active" : ""}" type="button" data-gallery-index="${index}" aria-label="Pokaż zdjęcie ${index + 1}">
      <img src="${escapeHtml(source)}" alt="" />
    </button>
  `).join("");
  document.querySelectorAll("[data-price-field]").forEach((element) => {
    element.textContent = formatPrice(product.purchasePrice);
  });

  const stockStatus = document.querySelector(".stock-status");
  stockStatus.innerHTML = product.stock > 0
    ? `<i></i> Dostępny: ${product.stock}`
    : "<i></i> Brak na stanie";
  stockStatus.classList.toggle("status-danger", Number(product.stock) === 0);
  stockStatus.classList.toggle("status-available", Number(product.stock) > 0);
  document.title = `Panel produktu — ${product.name}`;
  refreshProductSelect();
}

function renderProductsList() {
  refreshFilters();
  const visibleProducts = getFilteredProducts();
  productsCount.textContent = visibleProducts.length;
  productsList.innerHTML = visibleProducts.length
    ? visibleProducts.map((product) => {
      const index = products.findIndex((item) => item.id === product.id);
      return `
      <div class="product-list-row" data-product-id="${product.id}" role="button" tabindex="0" aria-label="Otwórz produkt ${escapeHtml(product.name)}">
        <span class="row-number">${index + 1}</span>
        <span class="row-image"><img src="${escapeHtml(getProductImages(product)[0] || DEFAULT_IMAGE)}" alt="" /></span>
        <span class="row-name">
          <strong>${escapeHtml(product.name)}</strong>
          <span>${escapeHtml(product.description || "Brak opisu")}</span>
        </span>
        <span class="row-category">${escapeHtml(product.category || "Inne")}</span>
        <span class="row-machine" title="${escapeHtml(product.machineType || "Nie podano")}">${escapeHtml(product.machineType || "Nie podano")}</span>
        <span class="row-manufacturer" title="${escapeHtml(product.manufacturer || "Nie podano")}">${escapeHtml(product.manufacturer || "Nie podano")}</span>
        <span class="row-location">${escapeHtml(normalizeLocation(product.location))}</span>
        <span class="row-balance">${Number(product.stock)}/<span class="demand">${Number(product.required)}</span> <small>szt.</small></span>
        <span class="row-price">${formatPrice(product.purchasePrice)}</span>
        <button class="row-sent-button" type="button" data-send-product="${product.id}" title="Kliknij, aby zarejestrować wysyłkę">${Number(product.sent) || 0} szt.</button>
        <button class="row-delete-button" type="button" data-delete-product="${product.id}" aria-label="Usuń produkt ${escapeHtml(product.name)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4V2h8v2h5v2H3V4h5Zm-2 4h12l-1 14H7L6 8Zm4 2v9h2v-9h-2Zm4 0v9h2v-9h-2Z"/></svg>
        </button>
      </div>
    `;
    }).join("")
    : '<div class="empty-products">Nie znaleziono produktów pasujących do filtrów.</div>';
}

function getShelf(location) {
  return normalizeLocation(location).split("/")[0];
}

function uniqueSortedValues(values) {
  return [...new Set(values.map((value) => String(value || "Nie podano").trim() || "Nie podano"))]
    .sort((a, b) => a.localeCompare(b, "pl", { numeric: true }));
}

function updateFilterOptions(select, values, emptyLabel) {
  const selected = select.value;
  select.innerHTML = `<option value="">${emptyLabel}</option>`
    + values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");
  select.value = values.includes(selected) ? selected : "";
}

function refreshFilters() {
  const selectedShelf = shelfFilter.value;
  const shelves = [...new Set(["A", "B", "C", "D", "INNE", ...products.map((product) => getShelf(product.location))])]
    .sort((a, b) => a.localeCompare(b, "pl", { numeric: true }));
  shelfFilter.innerHTML = '<option value="">Wszystkie regały</option>'
    + shelves.map((shelf) => `<option value="${escapeHtml(shelf)}">${escapeHtml(shelf)}</option>`).join("");
  shelfFilter.value = shelves.includes(selectedShelf) ? selectedShelf : "";
  updateFilterOptions(
    categoryFilter,
    ["Fujiseiki", "ACE System", "Inne"],
    "Wszystkie kategorie",
  );
  updateFilterOptions(
    machineTypeFilter,
    uniqueSortedValues(products.map((product) => product.machineType)),
    "Wszystkie rodzaje",
  );
  updateFilterOptions(
    manufacturerFilter,
    uniqueSortedValues(products.map((product) => product.manufacturer)),
    "Wszyscy producenci",
  );
}

function getFilteredProducts() {
  const query = productSearch.value.trim().toLocaleLowerCase("pl");
  const shelf = shelfFilter.value;
  const category = categoryFilter.value;
  const machineType = machineTypeFilter.value;
  const manufacturer = manufacturerFilter.value;
  return products.filter((product) => {
    const matchesShelf = !shelf || getShelf(product.location) === shelf;
    const matchesCategory = !category || (product.category || "Inne") === category;
    const matchesMachine = !machineType || (product.machineType || "Nie podano") === machineType;
    const matchesManufacturer = !manufacturer || (product.manufacturer || "Nie podano") === manufacturer;
    const searchable = [
      product.name,
      product.location,
      product.category,
      product.machineType,
    ].join(" ").toLocaleLowerCase("pl");
    return matchesShelf
      && matchesCategory
      && matchesMachine
      && matchesManufacturer
      && (!query || searchable.includes(query));
  });
}

function setView(view) {
  currentView = view;
  const showList = view === "list";
  detailView.hidden = showList;
  productsView.hidden = !showList;
  pageTitle.textContent = showList ? "Wszystkie produkty" : "Szczegóły produktu";
  allProductsButton.classList.toggle("active", showList);
  viewButtonLabel.textContent = showList ? "Szczegóły produktu" : "Wszystkie produkty";
  editButton.hidden = showList;
  deleteProductButton.hidden = showList;
  productSelect.closest(".product-switcher").hidden = showList;
  if (showList) renderProductsList();
}

function fillForm(product) {
  form.elements.name.value = product.name || "";
  form.elements.category.value = ["Fujiseiki", "ACE System", "Inne"].includes(product.category)
    ? product.category
    : "Inne";
  form.elements.machineType.value = product.machineType || "";
  form.elements.location.value = product.location || "";
  locationShelf.value = ["A", "B", "C", "D"].includes(getShelf(product.location))
    ? getShelf(product.location)
    : "INNE";
  form.elements.description.value = product.description || "";
  form.elements.stock.value = product.stock ?? 0;
  form.elements.required.value = product.required ?? 0;
  form.elements.ordered.value = product.ordered ?? 0;
  form.elements.purchasePrice.value = product.purchasePrice ?? 0;
  form.elements.manufacturer.value = product.manufacturer || "";
  pendingImages = getStoredImages(product);
  updateImagePreviews();
  updateLocationSuggestion();
  imageInput.value = "";
}

function openModal(mode = "edit", focusStock = false) {
  formMode = mode;
  const product = mode === "new"
    ? { name: "", category: "Inne", machineType: "", location: "A/1/1", description: "", stock: 0, required: 0, ordered: 0, sent: 0, purchasePrice: 0, manufacturer: "", images: [] }
    : getCurrentProduct();
  fillForm(product);
  modalTitle.textContent = mode === "new" ? "Dodaj nowy produkt" : "Edytuj produkt";
  submitButton.textContent = mode === "new" ? "Dodaj produkt" : "Zapisz zmiany";
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  const target = focusStock ? form.elements.stock : form.elements.name;
  setTimeout(() => target.focus(), 30);
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

function updateImagePreviews() {
  imagePreviews.innerHTML = pendingImages.length
    ? pendingImages.map((source, index) => `
      <div class="image-preview-item">
        <img src="${escapeHtml(source)}" alt="Zdjęcie ${index + 1}" />
        <button class="image-preview-remove" type="button" data-remove-image="${index}" aria-label="Usuń zdjęcie ${index + 1}">×</button>
      </div>
    `).join("")
    : '<div class="image-preview-empty">Nie dodano zdjęć.</div>';
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatPrice(value) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function normalizedWords(value) {
  return String(value || "")
    .toLocaleLowerCase("pl")
    .split(/[^a-ząćęłńóśźż0-9]+/i)
    .filter((word) => word.length >= 3);
}

function findLocationSuggestion() {
  const name = form.elements.name.value;
  const category = form.elements.category.value;
  const machineType = form.elements.machineType.value;
  const words = normalizedWords(name);
  const candidates = products
    .filter((product) => formMode === "new" || product.id !== currentProductId)
    .map((product) => {
      let score = 0;
      if (category && product.category === category) score += 3;
      if (machineType && product.machineType?.toLocaleLowerCase("pl") === machineType.toLocaleLowerCase("pl")) score += 5;
      const productWords = normalizedWords(product.name);
      score += words.filter((word) => productWords.includes(word)).length * 2;
      return { product, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
  return candidates[0]?.product || null;
}

function updateLocationSuggestion() {
  const suggestion = findLocationSuggestion();
  if (!suggestion) {
    locationSuggestion.hidden = true;
    return;
  }
  const shelf = getShelf(suggestion.location);
  locationSuggestion.dataset.location = suggestion.location;
  locationSuggestion.textContent = `Podpowiedź: regał ${shelf} (${suggestion.name}) — kliknij, aby użyć ${suggestion.location}`;
  locationSuggestion.hidden = false;
}

function exportProductsToExcel() {
  const visibleProducts = getFilteredProducts();
  if (!visibleProducts.length) {
    showToast("Brak produktów do wyeksportowania.");
    return;
  }
  if (!window.XLSX) {
    showToast("Nie udało się załadować modułu eksportu Excel.");
    return;
  }

  const rows = visibleProducts.map((product, index) => ({
    "Nr": index + 1,
    "Nazwa produktu": product.name,
    "Opis": product.description || "",
    "Kategoria": product.category,
    "Rodzaj maszyny": product.machineType || "",
    "Producent części": product.manufacturer || "",
    "Lokalizacja": normalizeLocation(product.location),
    "Stan magazynowy": Number(product.stock),
    "Max": Number(product.required),
    "Stan / max": `${Number(product.stock)}/${Number(product.required)} szt.`,
    "Cena zakupu (PLN)": Number(product.purchasePrice) || 0,
    "Wysłano": Number(product.sent) || 0,
    "Zamówione": Number(product.ordered),
    "ID produktu": product.id,
  }));

  const worksheet = window.XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 6 }, { wch: 28 }, { wch: 42 }, { wch: 16 },
    { wch: 22 }, { wch: 22 }, { wch: 16 }, { wch: 17 },
    { wch: 12 }, { wch: 16 }, { wch: 12 }, { wch: 20 }, { hidden: true },
  ];
  worksheet["!autofilter"] = { ref: worksheet["!ref"] };
  visibleProducts.forEach((product, index) => {
    if (Number(product.stock) < Number(product.required)) {
      ["B", "H", "I"].forEach((column) => {
        const cell = worksheet[`${column}${index + 2}`];
        if (!cell) return;
        cell.s = {
          fill: { patternType: "solid", fgColor: { rgb: "FDE2E1" } },
          font: { color: { rgb: "B42318" }, bold: true },
          border: {
            top: { style: "thin", color: { rgb: "F3B8B3" } },
            bottom: { style: "thin", color: { rgb: "F3B8B3" } },
            left: { style: "thin", color: { rgb: "F3B8B3" } },
            right: { style: "thin", color: { rgb: "F3B8B3" } },
          },
        };
      });
    }
  });

  const workbook = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(workbook, worksheet, "Produkty");
  const date = new Date().toISOString().slice(0, 10);
  window.XLSX.writeFile(workbook, `produkty-magazyn-${date}.xlsx`);
  showToast(`Wyeksportowano ${visibleProducts.length} produktów.`);
}

function numberFromExcel(value) {
  if (typeof value === "number") return Math.max(0, value);
  const normalized = String(value ?? "").replace(/\s/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function productFromExcelRow(row, existingProduct) {
  const location = normalizeLocation(row["Lokalizacja"] || existingProduct?.location || "A/1/1");
  const importedCategory = String(row["Kategoria"] || existingProduct?.category || "Inne").trim();
  return {
    id: existingProduct?.id || String(row["ID produktu"] || "").trim() || crypto.randomUUID(),
    name: String(row["Nazwa produktu"] || existingProduct?.name || "").trim(),
    category: ["Fujiseiki", "ACE System", "Inne"].includes(importedCategory)
      ? importedCategory
      : "Inne",
    machineType: String(row["Rodzaj maszyny"] || existingProduct?.machineType || "").trim(),
    manufacturer: String(row["Producent części"] || existingProduct?.manufacturer || "").trim(),
    location,
    stock: numberFromExcel(row["Stan magazynowy"]),
    required: numberFromExcel(row["Max"] !== "" && row["Max"] != null ? row["Max"] : row["Zapotrzebowanie"]),
    ordered: numberFromExcel(row["Zamówione"]),
    sent: numberFromExcel(row["Wysłano"]),
    purchasePrice: numberFromExcel(row["Cena zakupu (PLN)"]),
    description: String(row["Opis"] || existingProduct?.description || "").trim(),
    images: existingProduct ? getStoredImages(existingProduct) : [],
    image: existingProduct ? (getStoredImages(existingProduct)[0] || DEFAULT_IMAGE) : DEFAULT_IMAGE,
  };
}

async function importProductsFromExcel(file) {
  if (!window.XLSX) throw new Error("Biblioteka Excel nie została załadowana.");
  const buffer = await file.arrayBuffer();
  const workbook = window.XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = window.XLSX.utils.sheet_to_json(sheet, { defval: "" });
  if (!rows.length) throw new Error("Plik Excel nie zawiera produktów.");

  const nextProducts = products.map((product) => ({ ...product }));
  let added = 0;
  let updated = 0;

  rows.forEach((row) => {
    const name = String(row["Nazwa produktu"] || "").trim();
    if (!name) return;
    const id = String(row["ID produktu"] || "").trim();
    let index = id ? nextProducts.findIndex((product) => product.id === id) : -1;
    if (index < 0) {
      const location = normalizeLocation(row["Lokalizacja"] || "A/1/1");
      index = nextProducts.findIndex((product) =>
        product.name.toLocaleLowerCase("pl") === name.toLocaleLowerCase("pl")
        && normalizeLocation(product.location) === location
      );
    }
    if (index >= 0) {
      nextProducts[index] = productFromExcelRow(row, nextProducts[index]);
      updated += 1;
    } else if (nextProducts.length < 100) {
      nextProducts.push(productFromExcelRow(row, null));
      added += 1;
    }
  });

  if (!added && !updated) throw new Error("Nie znaleziono prawidłowych wierszy do importu.");
  products = nextProducts;
  currentProductId = products.some((product) => product.id === currentProductId)
    ? currentProductId
    : products[0].id;
  await replaceCloudProducts(products);
  saveProducts();
  renderProduct();
  renderProductsList();
  showToast(`Import zakończony: zmieniono ${updated}, dodano ${added}.`);
}

function exportBackup() {
  const backup = {
    format: "stockly-backup",
    version: 1,
    createdAt: new Date().toISOString(),
    products,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `kopia-magazynu-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Kopia zapasowa została pobrana.");
}

async function restoreBackup(file) {
  const backup = JSON.parse(await file.text());
  if (backup?.format !== "stockly-backup" || !Array.isArray(backup.products) || !backup.products.length) {
    throw new Error("To nie jest prawidłowa kopia zapasowa aplikacji.");
  }
  if (!window.confirm(`Wczytać kopię zawierającą ${backup.products.length} produktów? Obecna lista zostanie zastąpiona.`)) return;

  const restored = backup.products.slice(0, 100).map((product) => ({
    id: product.id || crypto.randomUUID(),
    name: String(product.name || "Produkt"),
    category: ["Fujiseiki", "ACE System", "Inne"].includes(product.category) && typeof product.machineType === "string"
      ? product.category
      : "Inne",
    machineType: typeof product.machineType === "string" ? product.machineType : String(product.category || ""),
    manufacturer: String(product.manufacturer || ""),
    location: normalizeLocation(product.location),
    description: String(product.description || ""),
    stock: numberFromExcel(product.stock),
    required: numberFromExcel(product.required),
    ordered: numberFromExcel(product.ordered),
    sent: numberFromExcel(product.sent),
    purchasePrice: numberFromExcel(product.purchasePrice),
    images: Array.isArray(product.images) && product.images.length
      ? product.images.slice(0, 3)
      : [product.image || DEFAULT_IMAGE],
    image: (Array.isArray(product.images) && product.images[0]) || product.image || DEFAULT_IMAGE,
  }));
  await replaceCloudProducts(restored);
  products = restored;
  currentProductId = products[0].id;
  saveProducts();
  renderProduct();
  renderProductsList();
  showToast("Kopia zapasowa została przywrócona.");
}

async function deleteProduct(productId) {
  if (products.length === 1) {
    showToast("Nie można usunąć ostatniego produktu.");
    return;
  }
  const product = products.find((item) => item.id === productId);
  if (!product || !window.confirm(`Czy na pewno usunąć produkt „${product.name}”?`)) return;

  const productsBeforeDelete = products;
  const productIdBeforeDelete = currentProductId;
  products = products.filter((item) => item.id !== productId);
  if (currentProductId === productId) currentProductId = products[0].id;
  try {
    await removeProductFromCloud(productId);
    saveProducts();
  } catch {
    products = productsBeforeDelete;
    currentProductId = productIdBeforeDelete;
    showToast("Nie udało się usunąć produktu.");
    return;
  }
  renderProduct();
  renderProductsList();
  showToast("Produkt został usunięty.");
}

async function registerShipment(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  const value = window.prompt(
    `Ile sztuk produktu „${product.name}” wysłano?\n\nWpisz 0, aby wyczyścić licznik „Wysłano” bez zmiany stanu magazynowego.`,
    "1",
  );
  if (value === null) return;
  const quantity = Math.floor(numberFromExcel(value));
  if (quantity < 0) {
    showToast("Wpisz liczbę równą lub większą od zera.");
    return;
  }
  if (quantity === 0) {
    if (!Number(product.sent)) {
      showToast("Licznik „Wysłano” jest już pusty.");
      return;
    }
    if (!window.confirm(`Wyczyścić licznik „Wysłano” dla produktu „${product.name}”?`)) return;
    const previous = { ...product };
    product.sent = 0;
    try {
      await saveProductToCloud(product, false);
      saveProducts();
      renderProduct();
      renderProductsList();
      showToast("Licznik „Wysłano” został wyczyszczony.");
    } catch {
      Object.assign(product, previous);
      showToast("Nie udało się wyczyścić licznika.");
    }
    return;
  }
  if (quantity > Number(product.stock)) {
    showToast(`Na magazynie jest tylko ${product.stock} szt.`);
    return;
  }

  const previous = { ...product };
  product.stock = Number(product.stock) - quantity;
  product.sent = Number(product.sent || 0) + quantity;
  try {
    await saveProductToCloud(product, false);
    saveProducts();
    renderProduct();
    renderProductsList();
    showToast(`Zarejestrowano wysyłkę ${quantity} szt.`);
  } catch {
    Object.assign(product, previous);
    showToast("Nie udało się zapisać wysyłki.");
  }
}

editButton.addEventListener("click", () => openModal("edit"));
deleteProductButton.addEventListener("click", () => deleteProduct(currentProductId));
newProductButton.addEventListener("click", () => {
  if (products.length >= 100) {
    showToast("Osiągnięto limit 100 produktów.");
    return;
  }
  openModal("new");
});
stockButton.addEventListener("click", () => openModal("edit", true));
allProductsButton.addEventListener("click", () => setView(currentView === "list" ? "detail" : "list"));
productSearch.addEventListener("input", renderProductsList);
shelfFilter.addEventListener("change", renderProductsList);
categoryFilter.addEventListener("change", renderProductsList);
machineTypeFilter.addEventListener("change", renderProductsList);
manufacturerFilter.addEventListener("change", renderProductsList);
clearFiltersButton.addEventListener("click", () => {
  productSearch.value = "";
  shelfFilter.value = "";
  categoryFilter.value = "";
  machineTypeFilter.value = "";
  manufacturerFilter.value = "";
  renderProductsList();
});
exportExcelButton.addEventListener("click", exportProductsToExcel);
backupButton.addEventListener("click", exportBackup);
importExcelInput.addEventListener("change", async () => {
  const file = importExcelInput.files[0];
  if (!file) return;
  try {
    await importProductsFromExcel(file);
  } catch (error) {
    showToast(error.message);
  } finally {
    importExcelInput.value = "";
  }
});
restoreBackupInput.addEventListener("change", async () => {
  const file = restoreBackupInput.files[0];
  if (!file) return;
  try {
    await restoreBackup(file);
  } catch (error) {
    showToast(error.message);
  } finally {
    restoreBackupInput.value = "";
  }
});
locationShelf.addEventListener("change", () => {
  const parts = normalizeLocation(form.elements.location.value).split("/");
  if (locationShelf.value === "INNE") {
    const customShelf = window.prompt("Wpisz własne oznaczenie regału:", parts[0] === "INNE" ? "" : parts[0]);
    if (customShelf?.trim()) {
      form.elements.location.value = `${customShelf.trim().toUpperCase()}/${parts[1]}/${parts[2]}`;
    } else {
      form.elements.location.value = `INNE/${parts[1]}/${parts[2]}`;
    }
  } else {
    form.elements.location.value = `${locationShelf.value}/${parts[1]}/${parts[2]}`;
  }
  updateLocationSuggestion();
});
form.elements.location.addEventListener("input", () => {
  const shelf = form.elements.location.value.split("/")[0].toUpperCase();
  locationShelf.value = ["A", "B", "C", "D"].includes(shelf) ? shelf : "INNE";
});
form.elements.name.addEventListener("input", updateLocationSuggestion);
form.elements.machineType.addEventListener("input", updateLocationSuggestion);
form.elements.category.addEventListener("change", updateLocationSuggestion);
locationSuggestion.addEventListener("click", () => {
  form.elements.location.value = locationSuggestion.dataset.location;
  const shelf = getShelf(locationSuggestion.dataset.location);
  locationShelf.value = ["A", "B", "C", "D"].includes(shelf) ? shelf : "INNE";
  locationSuggestion.hidden = true;
});

loginButton.addEventListener("click", async () => {
  if (currentUser) {
    await supabaseClient.auth.signOut();
    showToast("Wylogowano. Aplikacja działa teraz lokalnie.");
    return;
  }
  authModal.hidden = false;
  document.body.style.overflow = "hidden";
  setTimeout(() => authForm.elements.email.focus(), 30);
});

closeAuthModal.addEventListener("click", () => {
  authModal.hidden = true;
  document.body.style.overflow = "";
});

authModal.addEventListener("click", (event) => {
  if (event.target === authModal) {
    authModal.hidden = true;
    document.body.style.overflow = "";
  }
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = authForm.elements.email.value.trim();
  const button = authForm.querySelector("button[type='submit']");
  button.disabled = true;
  button.textContent = "Wysyłanie…";
  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  button.disabled = false;
  button.textContent = "Wyślij link do logowania";
  if (error) {
    showToast(`Nie udało się wysłać linku: ${error.message}`);
    return;
  }
  authModal.hidden = true;
  document.body.style.overflow = "";
  showToast("Link do logowania został wysłany na e-mail.");
});

productsList.addEventListener("click", (event) => {
  const sendButton = event.target.closest("[data-send-product]");
  if (sendButton) {
    event.stopPropagation();
    registerShipment(sendButton.dataset.sendProduct);
    return;
  }
  const deleteButton = event.target.closest("[data-delete-product]");
  if (deleteButton) {
    event.stopPropagation();
    deleteProduct(deleteButton.dataset.deleteProduct);
    return;
  }
  const row = event.target.closest("[data-product-id]");
  if (!row) return;
  currentProductId = row.dataset.productId;
  activeImageIndex = 0;
  renderProduct();
  setView("detail");
});

productsList.addEventListener("keydown", (event) => {
  if (event.target.matches("[data-product-id]") && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    currentProductId = event.target.dataset.productId;
    activeImageIndex = 0;
    renderProduct();
    setView("detail");
  }
});

productSelect.addEventListener("change", () => {
  currentProductId = productSelect.value;
  activeImageIndex = 0;
  renderProduct();
});

productGalleryThumbs.addEventListener("click", (event) => {
  const thumb = event.target.closest("[data-gallery-index]");
  if (!thumb) return;
  activeImageIndex = Number(thumb.dataset.galleryIndex);
  renderProduct();
});

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.addEventListener("load", () => {
      const sourceImage = new Image();
      sourceImage.onerror = reject;
      sourceImage.addEventListener("load", () => {
        const maxSide = 1000;
        const scale = Math.min(1, maxSide / Math.max(sourceImage.width, sourceImage.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(sourceImage.width * scale);
        canvas.height = Math.round(sourceImage.height * scale);
        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      });
      sourceImage.src = reader.result;
    });
    reader.readAsDataURL(file);
  });
}

imageInput.addEventListener("change", async () => {
  const availableSlots = 3 - pendingImages.length;
  const files = [...imageInput.files].slice(0, availableSlots);
  if (!files.length) {
    showToast("Produkt może mieć maksymalnie 3 zdjęcia.");
    imageInput.value = "";
    return;
  }
  if (files.some((file) => file.size > 3 * 1024 * 1024)) {
    showToast("Każde zdjęcie może mieć maksymalnie 3 MB.");
    imageInput.value = "";
    return;
  }
  try {
    const compressed = await Promise.all(files.map(compressImage));
    pendingImages = [...pendingImages, ...compressed].slice(0, 3);
    updateImagePreviews();
  } catch {
    showToast("Nie udało się odczytać jednego ze zdjęć.");
  } finally {
    imageInput.value = "";
  }
});

imagePreviews.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-image]");
  if (!button) return;
  pendingImages.splice(Number(button.dataset.removeImage), 1);
  updateImagePreviews();
});

document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModal));
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!modal.hidden) closeModal();
    if (!authModal.hidden) {
      authModal.hidden = true;
      document.body.style.overflow = "";
    }
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const productsBeforeSave = products.map((product) => ({ ...product }));
  const productIdBeforeSave = currentProductId;
  const productData = {
    name: data.get("name").trim(),
    category: data.get("category").trim(),
    machineType: data.get("machineType").trim(),
    location: normalizeLocation(data.get("location")),
    description: data.get("description").trim(),
    stock: Number(data.get("stock")),
    required: Number(data.get("required")),
    ordered: Number(data.get("ordered")),
    sent: formMode === "new" ? 0 : Number(getCurrentProduct().sent || 0),
    purchasePrice: Number(data.get("purchasePrice")),
    manufacturer: data.get("manufacturer").trim(),
    images: pendingImages.slice(0, 3),
    image: pendingImages[0] || DEFAULT_IMAGE,
  };

  let savedProduct;
  if (formMode === "new") {
    savedProduct = { id: crypto.randomUUID(), ...productData };
    products.push(savedProduct);
    currentProductId = savedProduct.id;
  } else {
    const index = products.findIndex((product) => product.id === currentProductId);
    products[index] = { ...products[index], ...productData };
    savedProduct = products[index];
  }

  try {
    await saveProductToCloud(savedProduct, formMode === "new");
    saveProducts();
  } catch {
    products = productsBeforeSave;
    currentProductId = productIdBeforeSave;
    showToast("Nie udało się zapisać produktu w chmurze.");
    return;
  }
  renderProduct();
  renderProductsList();
  closeModal();
  showToast(formMode === "new" ? "Nowy produkt został dodany." : "Zmiany zostały zapisane.");
});

renderProduct();
renderProductsList();
setView("list");
initializeSupabase();
setInterval(() => {
  if (currentUser && document.visibilityState === "visible") {
    loadCloudProducts({ quiet: true });
  }
}, 10000);
