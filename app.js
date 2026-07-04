const STORAGE_KEY = "stockly-products-v2";
const LAST_DELETED_KEY = "stockly-last-deleted-product";
const ORDER_NUMBER_KEY = "stockly-order-number";
const DEFAULT_IMAGE = "product-placeholder.svg";
const SUPABASE_URL = "https://amvgmfvjidukphbbblms.supabase.co";
const SUPABASE_KEY = "sb_publishable_GmzJPNZa8Ut8njNuJr7s6A_oYlEk-q_";
const PRODUCT_LIMIT = 300;
const IMAGE_MAX_SIDE = 720;
const IMAGE_QUALITY = 0.72;
const IMAGE_DB_NAME = "stockly-local-images";
const IMAGE_DB_VERSION = 1;
const IMAGE_STORE_NAME = "productImages";
const DEFAULT_SHELVES = ["A", "B", "C", "D", "G", "H", "I", "J", "K", "L", "INNE"];

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
  shipments: [],
};

const modal = document.querySelector("#editModal");
const form = document.querySelector("#productForm");
const toast = document.querySelector("#toast");
const editButton = document.querySelector("#editButton");
const newProductButton = document.querySelector("#newProductButton");
const stockButton = document.querySelector("#stockButton");
const quickAddStockButton = document.querySelector("#quickAddStockButton");
const quickChangeRequiredButton = document.querySelector("#quickChangeRequiredButton");
const productSelect = document.querySelector("#productSelect");
const modalTitle = document.querySelector("#modalTitle");
const submitButton = document.querySelector("#submitButton");
const imageInput = document.querySelector("#imageInput");
const imagePreviews = document.querySelector("#imagePreviews");
const productGalleryThumbs = document.querySelector("#productGalleryThumbs");
const detailView = document.querySelector("#detailView");
const productsView = document.querySelector("#productsView");
const statisticsView = document.querySelector("#statisticsView");
const ordersView = document.querySelector("#ordersView");
const productsList = document.querySelector("#productsList");
const ordersList = document.querySelector("#ordersList");
const productsCount = document.querySelector("#productsCount");
const ordersCount = document.querySelector("#ordersCount");
const allProductsButton = document.querySelector("#allProductsButton");
const viewButtonLabel = document.querySelector("#viewButtonLabel");
const pageTitle = document.querySelector("#pageTitle");
const breadcrumbs = document.querySelector("#breadcrumbs");
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
const undoDeleteButton = document.querySelector("#undoDeleteButton");
const orderHeading = document.querySelector("#orderHeading");
const orderItemsCount = document.querySelector("#orderItemsCount");
const exportOrderButton = document.querySelector("#exportOrderButton");
const clearOrderButton = document.querySelector("#clearOrderButton");
const createShortageOrderButton = document.querySelector("#createShortageOrderButton");
const locationSuggestion = document.querySelector("#locationSuggestion");
const categorySuggestions = document.querySelector("#categorySuggestions");
const statisticsNavButton = document.querySelector("#statisticsNavButton");
const productsNavButton = document.querySelector("#productsNavButton");
const ordersNavButton = document.querySelector("#ordersNavButton");
const ordersCreateShortageOrderButton = document.querySelector("#ordersCreateShortageOrderButton");
const statisticsRangeOne = document.querySelector("#statisticsRangeOne");
const statisticsRangeTwo = document.querySelector("#statisticsRangeTwo");
const statisticsValueOne = document.querySelector("#statisticsValueOne");
const statisticsValueTwo = document.querySelector("#statisticsValueTwo");
const statisticsHeaderOne = document.querySelector("#statisticsHeaderOne");
const statisticsHeaderTwo = document.querySelector("#statisticsHeaderTwo");
const statisticsProductsList = document.querySelector("#statisticsProductsList");
const topManufacturerName = document.querySelector("#topManufacturerName");
const topManufacturerQuantity = document.querySelector("#topManufacturerQuantity");
const topProductsList = document.querySelector("#topProductsList");
const topProductsCount = document.querySelector("#topProductsCount");
const statisticsList = document.querySelector("#statisticsList");
const statisticsSearch = document.querySelector("#statisticsSearch");
const clearAllSentButton = document.querySelector("#clearAllSentButton");
const clearStatisticsButton = document.querySelector("#clearStatisticsButton");
const shortageFilterButton = document.querySelector("#shortageFilterButton");
const shortageFilterCount = document.querySelector("#shortageFilterCount");
const statisticsTotalProducts = document.querySelector("#statisticsTotalProducts");
const statisticsLowStockProducts = document.querySelector("#statisticsLowStockProducts");
const statisticsInventoryValue = document.querySelector("#statisticsInventoryValue");
const imageLightbox = document.querySelector("#imageLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxTitle = document.querySelector("#lightboxTitle");
const closeLightbox = document.querySelector("#closeLightbox");

let products = loadProducts();
let currentProductId = products[0].id;
let formMode = "edit";
let pendingImages = getProductImages(products[0]);
let activeImageIndex = 0;
let currentView = "list";
let showShortagesOnly = false;
let supabaseClient = null;
let currentUser = null;
let realtimeChannel = null;
let cloudBusy = false;
let lastDeletedProduct = loadLastDeletedProduct();
let currentOrderNumber = Math.max(1, Number(localStorage.getItem(ORDER_NUMBER_KEY)) || 1);
let localStorageWarningShown = false;
let imageDatabasePromise = null;

function loadLastDeletedProduct() {
  try {
    const saved = JSON.parse(localStorage.getItem(LAST_DELETED_KEY));
    return saved?.product ? saved : null;
  } catch {
    return null;
  }
}

function setLastDeletedProduct(value) {
  lastDeletedProduct = value;
  try {
    if (value) {
      localStorage.setItem(LAST_DELETED_KEY, JSON.stringify({
        ...value,
        product: {
          ...value.product,
          images: [],
          image: DEFAULT_IMAGE,
        },
      }));
    }
    else localStorage.removeItem(LAST_DELETED_KEY);
  } catch {
    // Produkt nadal można przywrócić do czasu zamknięcia tej karty.
  }
  undoDeleteButton.disabled = !value;
}

function loadProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const loaded = Array.isArray(saved) && saved.length ? saved : [defaultProduct];
    return loaded.slice(0, PRODUCT_LIMIT).map((product) => {
      const images = Array.isArray(product.images) && product.images.length
        ? product.images.slice(0, 3)
        : (product.image && product.image !== DEFAULT_IMAGE ? [product.image] : []);
      return {
        ...product,
        category: String(product.category || "Inne").trim() || "Inne",
        machineType: String(product.machineType || ""),
        location: normalizeLocation(product.location),
        purchasePrice: Number(product.purchasePrice) || 0,
        sent: Number(product.sent) || 0,
        shipments: Array.isArray(product.shipments) ? product.shipments : [],
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

function openImageDatabase() {
  if (!("indexedDB" in window)) return Promise.resolve(null);
  if (imageDatabasePromise) return imageDatabasePromise;
  imageDatabasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(IMAGE_DB_NAME, IMAGE_DB_VERSION);
    request.addEventListener("upgradeneeded", () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(IMAGE_STORE_NAME)) {
        database.createObjectStore(IMAGE_STORE_NAME);
      }
    });
    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error));
  });
  return imageDatabasePromise;
}

async function loadProductImages(productId) {
  const database = await openImageDatabase();
  if (!database) return [];
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(IMAGE_STORE_NAME, "readonly");
    const store = transaction.objectStore(IMAGE_STORE_NAME);
    const request = store.get(productId);
    request.addEventListener("success", () => resolve(Array.isArray(request.result) ? request.result.slice(0, 3) : []));
    request.addEventListener("error", () => reject(request.error));
  });
}

async function saveProductImages(productId, images) {
  const database = await openImageDatabase();
  if (!database) return;
  const storedImages = images.filter((image) => image && image !== DEFAULT_IMAGE).slice(0, 3);
  await new Promise((resolve, reject) => {
    const transaction = database.transaction(IMAGE_STORE_NAME, "readwrite");
    const store = transaction.objectStore(IMAGE_STORE_NAME);
    if (storedImages.length) store.put(storedImages, productId);
    else store.delete(productId);
    transaction.addEventListener("complete", resolve);
    transaction.addEventListener("error", () => reject(transaction.error));
    transaction.addEventListener("abort", () => reject(transaction.error));
  });
}

async function saveAllProductImages(nextProducts) {
  await Promise.all(nextProducts.map((product) => saveProductImages(product.id, getStoredImages(product))));
}

async function hydrateImagesFromLocalDatabase() {
  try {
    let changed = false;
    for (const product of products) {
      const productImages = getStoredImages(product);
      const databaseImages = await loadProductImages(product.id);
      const images = productImages.length ? productImages : databaseImages;
      if (images.length) {
        product.images = images.slice(0, 3);
        product.image = product.images[0];
        changed = true;
      } else {
        product.images = [];
        product.image = DEFAULT_IMAGE;
      }
      if (productImages.length) await saveProductImages(product.id, productImages);
    }
    if (changed) {
      pendingImages = getStoredImages(getCurrentProduct());
      saveProducts();
      renderProduct();
      renderProductsList();
      if (currentView === "statistics") renderStatistics();
    }
  } catch (error) {
    console.warn("Nie udało się odczytać lokalnej bazy zdjęć.", error);
  }
}

async function productWithBackupImages(product) {
  const productImages = getStoredImages(product);
  const databaseImages = productImages.length ? productImages : await loadProductImages(product.id);
  const images = databaseImages.slice(0, 3);
  return {
    ...product,
    images,
    image: images[0] || DEFAULT_IMAGE,
  };
}

async function requestPersistentLocalStorage() {
  try {
    if (navigator.storage?.persist) await navigator.storage.persist();
  } catch {
    // Przeglądarka może odmówić — aplikacja nadal działa lokalnie.
  }
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (!["https:", "http:"].includes(window.location.protocol)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // Aplikacja nadal działa normalnie, tylko bez trybu instalacji/offline PWA.
    });
  });
}

function getProductsForLightLocalStorage() {
  return products.map((product) => ({
    ...product,
    images: [],
    image: DEFAULT_IMAGE,
  }));
}

function saveProducts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getProductsForLightLocalStorage()));
  } catch (error) {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(getProductsForLightLocalStorage()));
      if (!localStorageWarningShown) {
        localStorageWarningShown = true;
        showToast("Przeglądarka ma za mało miejsca na małą kopię tekstową. Zdjęcia są trzymane osobno w lokalnej bazie przeglądarki.");
      }
    } catch (fallbackError) {
      console.warn("Nie udało się zapisać lokalnej kopii produktów.", fallbackError);
      if (!localStorageWarningShown) {
        localStorageWarningShown = true;
        showToast("Nie udało się zapisać lokalnej kopii w przeglądarce.");
      }
    }
  }
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
    shipments: Array.isArray(product.shipments) ? product.shipments : [],
  };
}

function fromDatabaseProduct(product) {
  return {
    id: product.id,
    name: product.name,
    category: String(product.category || "Inne").trim() || "Inne",
    machineType: product.machine_type || "",
    location: normalizeLocation(product.location),
    description: product.description || "",
    stock: Number(product.stock) || 0,
    required: Number(product.required) || 0,
    ordered: Number(product.ordered) || 0,
    sent: Number(product.sent) || 0,
    shipments: Array.isArray(product.shipments) ? product.shipments : [],
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
      .limit(PRODUCT_LIMIT);
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
      await saveAllProductImages(products);
      saveProducts();
      renderProduct();
      renderProductsList();
      if (currentView === "statistics") renderStatistics();
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
  document.querySelectorAll('[data-field="name"]').forEach((element) => {
    element.classList.toggle("low-stock-text", Number(product.stock) < Number(product.required));
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
  if (currentView === "detail") renderBreadcrumbs();
}

function renderProductsList() {
  refreshFilters();
  renderOrderSummary();
  const shortageCount = products.filter(isLowStock).length;
  shortageFilterCount.textContent = shortageCount;
  shortageFilterButton.classList.toggle("active", showShortagesOnly);
  shortageFilterButton.disabled = shortageCount === 0 && !showShortagesOnly;
  const visibleProducts = getFilteredProducts();
  productsCount.textContent = visibleProducts.length;
  productsList.innerHTML = visibleProducts.length
    ? visibleProducts.map((product) => {
      const index = getWarehouseNumber(product) - 1;
      return `
      <div class="product-list-row" data-product-id="${product.id}" role="button" tabindex="0" aria-label="Otwórz produkt ${escapeHtml(product.name)}">
        <span class="row-number">${index + 1}</span>
        <span class="row-image"><img src="${escapeHtml(getProductImages(product)[0] || DEFAULT_IMAGE)}" alt="" /></span>
        <span class="row-name ${isLowStock(product) ? "low-stock-name" : ""}">
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
        <span class="row-actions">
          <button class="row-delete-button" type="button" data-delete-product="${product.id}" aria-label="Usuń produkt ${escapeHtml(product.name)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4V2h8v2h5v2H3V4h5Zm-2 4h12l-1 14H7L6 8Zm4 2v9h2v-9h-2Zm4 0v9h2v-9h-2Z"/></svg>
          </button>
        </span>
      </div>
    `;
    }).join("")
    : '<div class="empty-products">Nie znaleziono produktów pasujących do filtrów.</div>';
  if (currentView === "orders") renderOrdersView();
}

function renderOrdersView() {
  renderOrderSummary();
  const shortageProducts = products.filter(isLowStock);
  ordersCount.textContent = shortageProducts.length;
  ordersList.innerHTML = shortageProducts.length
    ? shortageProducts.map((product) => {
      const index = getWarehouseNumber(product) - 1;
      const shortage = shortageQuantity(product);
      return `
      <div class="orders-product-row" data-order-product="${product.id}" role="button" tabindex="0" aria-label="Otwórz produkt ${escapeHtml(product.name)}">
        <span class="row-number">${index + 1}</span>
        <span class="row-image"><img src="${escapeHtml(getProductImages(product)[0] || DEFAULT_IMAGE)}" alt="" /></span>
        <button class="orders-product-name low-stock-name" type="button" data-open-order-product="${product.id}">
          ${escapeHtml(product.name)}
        </button>
        <span class="row-location">${escapeHtml(normalizeLocation(product.location))}</span>
        <span class="row-balance">${Number(product.stock)}/<span class="demand">${Number(product.required)}</span> <small>szt.</small></span>
        <span class="row-manufacturer">${escapeHtml(product.manufacturer || "Nie podano")}</span>
        <strong class="orders-shortage">${shortage} szt.</strong>
      </div>
    `;
    }).join("")
    : '<div class="orders-empty">Brak produktów poniżej minimum. Wszystko wygląda dobrze.</div>';
}

function getShelf(location) {
  return normalizeLocation(location).split("/")[0];
}

function uniqueSortedValues(values) {
  return [...new Set(values.map((value) => String(value || "Nie podano").trim() || "Nie podano"))]
    .sort((a, b) => a.localeCompare(b, "pl", { numeric: true }));
}

function getWarehouseNumber(product) {
  return products.findIndex((item) => item.id === product.id) + 1;
}

function isLowStock(product) {
  return Number(product.stock) < Number(product.required);
}

function shortageQuantity(product) {
  return Math.max(0, Math.floor(Number(product.required) - Number(product.stock)));
}

function inventoryValue(productList = products) {
  return productList.reduce(
    (total, product) => total + ((Number(product.stock) || 0) * (Number(product.purchasePrice) || 0)),
    0,
  );
}

function renderBreadcrumbs() {
  const product = getCurrentProduct();
  const productNumber = product ? getWarehouseNumber(product) : 0;
  if (currentView === "orders") {
    breadcrumbs.innerHTML = `
      <button type="button" data-breadcrumb-view="list">Główne okno</button>
      <span>/</span>
      <strong class="current-crumb">Zamówienia</strong>
    `;
    return;
  }
  if (currentView === "statistics") {
    breadcrumbs.innerHTML = '<strong class="current-crumb">Statystyki</strong>';
    return;
  }
  if (currentView === "detail") {
    breadcrumbs.innerHTML = `
      <button type="button" data-breadcrumb-view="list">Główne okno</button>
      <span>/</span>
      <strong class="current-crumb">Szczegóły produktu${productNumber ? ` (nr ${productNumber})` : ""}</strong>
    `;
    return;
  }
  breadcrumbs.innerHTML = `
    <button type="button" data-breadcrumb-view="list">Główne okno</button>
    <span>/</span>
    <strong class="current-crumb">Wszystkie produkty</strong>
  `;
}

function updateViewHistory(view, replace = false) {
  if (!window.history?.pushState) return;
  const product = getCurrentProduct();
  const productNumber = product ? getWarehouseNumber(product) : "";
  const hash = view === "statistics"
    ? "#statystyki"
    : (view === "orders"
      ? "#zamowienia"
      : (view === "detail" ? `#szczegoly-produktu-${productNumber}` : "#wszystkie-produkty"));
  const state = { view, productId: currentProductId };
  const sameState = window.history.state?.view === view && window.history.state?.productId === currentProductId;
  if (sameState && !replace) return;
  window.history[replace ? "replaceState" : "pushState"](state, "", hash);
}

function updateCategorySuggestions() {
  categorySuggestions.innerHTML = uniqueSortedValues(products.map((product) => product.category))
    .map((category) => `<option value="${escapeHtml(category)}"></option>`)
    .join("");
}

function getShipmentHistory() {
  return products.flatMap((product) =>
    (Array.isArray(product.shipments) ? product.shipments : []).map((shipment) => ({
      productId: product.id,
      productName: product.name,
      quantity: Number(shipment.quantity) || 0,
      date: shipment.date,
    }))
  ).filter((shipment) => shipment.quantity > 0 && shipment.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

const statisticsRangeLabels = {
  quarter: "Kwartalna",
  half: "Półroczna",
  year: "Roczna",
  all: "Od początku",
};

function getStatisticsPeriodStart(range, now = new Date()) {
  if (range === "all") return null;
  if (range === "year") return new Date(now.getFullYear(), 0, 1);
  if (range === "half") return new Date(now.getFullYear(), now.getMonth() < 6 ? 0 : 6, 1);
  return new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
}

function shipmentQuantityForRange(product, range) {
  const start = getStatisticsPeriodStart(range);
  return (Array.isArray(product.shipments) ? product.shipments : [])
    .filter((shipment) => shipment.date && (!start || new Date(shipment.date) >= start))
    .reduce((total, shipment) => total + (Number(shipment.quantity) || 0), 0);
}

function shipmentQuantitySinceMonths(product, months) {
  const start = new Date();
  start.setMonth(start.getMonth() - months);
  return (Array.isArray(product.shipments) ? product.shipments : [])
    .filter((shipment) => shipment.date && new Date(shipment.date) >= start)
    .reduce((total, shipment) => total + (Number(shipment.quantity) || 0), 0);
}

function renderStatistics() {
  const searchQuery = statisticsSearch.value.trim().toLocaleLowerCase("pl");
  const statisticsProducts = products.filter((product) =>
    !searchQuery || [getWarehouseNumber(product), product.name, product.machineType, product.location, product.manufacturer]
      .join(" ")
      .toLocaleLowerCase("pl")
      .includes(searchQuery)
  );
  statisticsTotalProducts.textContent = statisticsProducts.length;
  statisticsLowStockProducts.textContent = statisticsProducts.filter(isLowStock).length;
  statisticsInventoryValue.textContent = formatPrice(inventoryValue(statisticsProducts));
  const matchingProductIds = new Set(statisticsProducts.map((product) => product.id));
  const history = getShipmentHistory().filter((shipment) => matchingProductIds.has(shipment.productId));
  const rangeOne = statisticsRangeOne.value;
  const rangeTwo = statisticsRangeTwo.value;
  const totalForRange = (range) => statisticsProducts.reduce(
    (total, product) => total + shipmentQuantityForRange(product, range),
    0,
  );

  statisticsValueOne.textContent = totalForRange(rangeOne);
  statisticsValueTwo.textContent = totalForRange(rangeTwo);
  statisticsHeaderOne.textContent = statisticsRangeLabels[rangeOne];
  statisticsHeaderTwo.textContent = statisticsRangeLabels[rangeTwo];

  statisticsProductsList.innerHTML = statisticsProducts.length
    ? statisticsProducts.map((product) => {
      const index = getWarehouseNumber(product) - 1;
      return `
    <div class="statistics-product-row">
      <span class="row-number">${index + 1}</span>
      <span class="row-image"><img src="${escapeHtml(getProductImages(product)[0] || DEFAULT_IMAGE)}" alt="" /></span>
      <button class="statistics-product-name ${isLowStock(product) ? "low-stock-name" : ""}" type="button" data-statistics-product="${product.id}">
        ${escapeHtml(product.name)}
      </button>
      <span class="row-location">${escapeHtml(normalizeLocation(product.location))}</span>
      <span class="row-balance">${Number(product.stock)}/<span class="demand">${Number(product.required)}</span> <small>szt.</small></span>
      <span class="row-manufacturer">${escapeHtml(product.manufacturer || "Nie podano")}</span>
      <strong class="statistics-quantity">${shipmentQuantityForRange(product, rangeOne)} szt.</strong>
      <strong class="statistics-quantity">${shipmentQuantityForRange(product, rangeTwo)} szt.</strong>
    </div>
  `;
    }).join("")
    : '<div class="statistics-empty">Nie znaleziono produktu o podanej nazwie lub rodzaju maszyny.</div>';

  const manufacturerTotals = new Map();
  statisticsProducts.forEach((product) => {
    const manufacturer = String(product.manufacturer || "").trim();
    if (!manufacturer) return;
    manufacturerTotals.set(
      manufacturer,
      (manufacturerTotals.get(manufacturer) || 0) + shipmentQuantityForRange(product, "all"),
    );
  });
  const topManufacturer = [...manufacturerTotals.entries()]
    .sort((a, b) => b[1] - a[1])[0];
  topManufacturerName.textContent = topManufacturer?.[1] ? topManufacturer[0] : "Brak danych";
  topManufacturerQuantity.textContent = topManufacturer?.[1] || 0;

  const requestedTopCount = Math.min(
    100,
    Math.max(1, Math.floor(Number(topProductsCount.value) || 3)),
  );
  topProductsCount.value = requestedTopCount;
  const topProducts = statisticsProducts
    .map((product) => ({ product, quantity: shipmentQuantityForRange(product, "all") }))
    .filter((item) => item.quantity > 0)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, requestedTopCount);
  topProductsList.innerHTML = topProducts.length
    ? topProducts.map((item) => `
      <li>
        <span class="ranking-product">
          <b>${escapeHtml(item.product.name)}</b>
          <small>${escapeHtml(item.product.manufacturer || "Nie podano")}</small>
        </span>
        <strong>${item.quantity} szt.</strong>
      </li>
    `).join("")
    : "<li><span>Brak zapisanych wysyłek</span><strong>0 szt.</strong></li>";

  statisticsList.innerHTML = history.length
    ? history.map((shipment) => `
      <div class="statistics-row">
        <time datetime="${escapeHtml(shipment.date)}">${new Intl.DateTimeFormat("pl-PL", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(shipment.date))}</time>
        <button type="button" data-statistics-product="${shipment.productId}">${escapeHtml(shipment.productName)}</button>
        <strong>${shipment.quantity} szt.</strong>
      </div>
    `).join("")
    : '<div class="statistics-empty">Nie zapisano jeszcze żadnej wysyłki z datą.</div>';
}

function updateFilterOptions(select, values, emptyLabel) {
  const selected = select.value;
  select.innerHTML = `<option value="">${emptyLabel}</option>`
    + values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");
  select.value = values.includes(selected) ? selected : "";
}

function refreshFilters() {
  const selectedShelf = shelfFilter.value;
  const shelves = [...new Set([...DEFAULT_SHELVES, ...products.map((product) => getShelf(product.location))])]
    .sort((a, b) => a.localeCompare(b, "pl", { numeric: true }));
  shelfFilter.innerHTML = '<option value="">Wszystkie regały</option>'
    + shelves.map((shelf) => `<option value="${escapeHtml(shelf)}">${escapeHtml(shelf)}</option>`).join("");
  shelfFilter.value = shelves.includes(selectedShelf) ? selectedShelf : "";
  updateFilterOptions(
    categoryFilter,
    uniqueSortedValues(products.map((product) => product.category)),
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
    const warehouseNumber = getWarehouseNumber(product);
    const matchesShortage = !showShortagesOnly || isLowStock(product);
    const matchesShelf = !shelf || getShelf(product.location) === shelf;
    const matchesCategory = !category || (product.category || "Inne") === category;
    const matchesMachine = !machineType || (product.machineType || "Nie podano") === machineType;
    const matchesManufacturer = !manufacturer || (product.manufacturer || "Nie podano") === manufacturer;
    const searchable = [
      warehouseNumber,
      product.name,
      product.location,
      product.category,
      product.machineType,
      product.manufacturer,
    ].join(" ").toLocaleLowerCase("pl");
    return matchesShortage
      && matchesShelf
      && matchesCategory
      && matchesMachine
      && matchesManufacturer
      && (!query || searchable.includes(query));
  });
}

function setView(view, options = {}) {
  const { updateHistory = true, replaceHistory = false } = options;
  currentView = view;
  const showList = view === "list";
  const showDetail = view === "detail";
  const showStatistics = view === "statistics";
  const showOrders = view === "orders";
  detailView.hidden = !showDetail;
  productsView.hidden = !showList;
  statisticsView.hidden = !showStatistics;
  ordersView.hidden = !showOrders;
  pageTitle.textContent = showStatistics
    ? "Statystyki wysyłek"
    : (showOrders ? "Zamówienia" : (showList ? "Wszystkie produkty" : "Szczegóły produktu"));
  allProductsButton.classList.toggle("active", showList);
  productsNavButton.classList.toggle("active", showList || showDetail);
  ordersNavButton.classList.toggle("active", showOrders);
  statisticsNavButton.classList.toggle("active", showStatistics);
  viewButtonLabel.textContent = showList ? "Szczegóły produktu" : "Wszystkie produkty";
  editButton.hidden = !showDetail;
  deleteProductButton.hidden = !showDetail;
  productSelect.closest(".product-switcher").hidden = !showDetail;
  renderBreadcrumbs();
  if (updateHistory) updateViewHistory(view, replaceHistory);
  if (showList) renderProductsList();
  if (showOrders) renderOrdersView();
  if (showStatistics) renderStatistics();
}

function fillForm(product) {
  form.elements.name.value = product.name || "";
  form.elements.category.value = product.category || "Inne";
  updateCategorySuggestions();
  form.elements.machineType.value = product.machineType || "";
  form.elements.location.value = product.location || "";
  locationShelf.value = DEFAULT_SHELVES.includes(getShelf(product.location))
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
    ? { name: "", category: "", machineType: "", location: "A/1/1", description: "", stock: 0, required: 0, ordered: 0, sent: 0, purchasePrice: 0, manufacturer: "", images: [], shipments: [] }
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

function openImageLightbox(source, title = "Zdjęcie produktu") {
  if (!source || source === DEFAULT_IMAGE) {
    showToast("Ten produkt nie ma jeszcze zdjęcia.");
    return;
  }
  lightboxImage.src = source;
  lightboxImage.alt = title;
  lightboxTitle.textContent = title;
  imageLightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeImageLightbox() {
  imageLightbox.hidden = true;
  lightboxImage.src = DEFAULT_IMAGE;
  if (modal.hidden && authModal.hidden) document.body.style.overflow = "";
}

function rotateImage(source, direction) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onerror = reject;
    image.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.height;
      canvas.height = image.width;
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      if (direction === "left") {
        context.translate(0, canvas.height);
        context.rotate(-Math.PI / 2);
      } else {
        context.translate(canvas.width, 0);
        context.rotate(Math.PI / 2);
      }
      context.drawImage(image, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", IMAGE_QUALITY));
    });
    image.src = source;
  });
}

function updateImagePreviews() {
  imagePreviews.innerHTML = pendingImages.length
    ? pendingImages.map((source, index) => `
      <div class="image-preview-item">
        <img src="${escapeHtml(source)}" alt="Zdjęcie ${index + 1}" />
        <div class="image-preview-actions" aria-label="Prostowanie zdjęcia ${index + 1}">
          <button class="image-preview-rotate" type="button" data-rotate-image="${index}" data-direction="left" title="Obróć w lewo">↺</button>
          <button class="image-preview-rotate" type="button" data-rotate-image="${index}" data-direction="right" title="Obróć w prawo">↻</button>
        </div>
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

function getOrderDate() {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
}

function getOrderTitle() {
  return `Zamówienie dnia ${getOrderDate()} nr ${currentOrderNumber}`;
}

function renderOrderSummary() {
  const total = products.reduce((sum, product) => sum + (Number(product.sent) || 0), 0);
  orderHeading.textContent = getOrderTitle();
  orderItemsCount.textContent = total;
  exportOrderButton.disabled = total === 0;
  clearOrderButton.disabled = total === 0;
  createShortageOrderButton.disabled = !products.some((product) => shortageQuantity(product) > 0);
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
    "Min": Number(product.required),
    "Stan / min": `${Number(product.stock)}/${Number(product.required)} szt.`,
    "Cena zakupu (PLN)": Number(product.purchasePrice) || 0,
    "Wysłano": Number(product.sent) || 0,
    "Wysłane — ostatni kwartał": shipmentQuantitySinceMonths(product, 3),
    "Wysłane — ostatnie pół roku": shipmentQuantitySinceMonths(product, 6),
    "ID produktu": product.id,
  }));

  const worksheet = window.XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 6 }, { wch: 28 }, { wch: 42 }, { wch: 16 },
    { wch: 22 }, { wch: 22 }, { wch: 16 }, { wch: 17 },
    { wch: 12 }, { wch: 16 }, { wch: 20 }, { wch: 12 },
    { wch: 27 }, { wch: 29 }, { hidden: true },
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

function exportOrderToExcel() {
  const orderedProducts = products.filter((product) => Number(product.sent) > 0);
  if (!orderedProducts.length) {
    showToast("Lista zamówienia jest pusta.");
    return;
  }
  if (!window.XLSX) {
    showToast("Nie udało się załadować modułu eksportu Excel.");
    return;
  }
  const rows = orderedProducts.map((product) => {
    const warehouseNumber = products.findIndex((item) => item.id === product.id) + 1;
    const quantity = Number(product.sent) || 0;
    const unitPrice = Number(product.purchasePrice) || 0;
    return [
      warehouseNumber,
      product.name,
      product.machineType || "",
      product.manufacturer || "",
      quantity,
      unitPrice,
      Number((quantity * unitPrice).toFixed(2)),
    ];
  });
  const orderTitle = getOrderTitle();
  const worksheet = window.XLSX.utils.aoa_to_sheet([
    [orderTitle],
    [],
    [
      "Numer magazynowy",
      "Nazwa produktu",
      "Rodzaj maszyny",
      "Producent części",
      "Ilość do zamówienia",
      "Cena jednostkowa (PLN)",
      "Wartość zamówienia (PLN)",
    ],
    ...rows,
  ]);
  worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];
  worksheet["!cols"] = [
    { wch: 18 }, { wch: 34 }, { wch: 24 }, { wch: 26 },
    { wch: 21 }, { wch: 23 }, { wch: 27 },
  ];
  worksheet["!autofilter"] = { ref: `A3:G${rows.length + 3}` };
  if (worksheet.A1) {
    worksheet.A1.s = {
      font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "486EE8" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }
  ["A3", "B3", "C3", "D3", "E3", "F3", "G3"].forEach((address) => {
    if (!worksheet[address]) return;
    worksheet[address].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "17243F" } },
    };
  });
  rows.forEach((_row, index) => {
    const excelRow = index + 4;
    if (worksheet[`F${excelRow}`]) worksheet[`F${excelRow}`].z = '#,##0.00 "zł"';
    if (worksheet[`G${excelRow}`]) worksheet[`G${excelRow}`].z = '#,##0.00 "zł"';
  });
  const workbook = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(workbook, worksheet, "Zamówienie");
  window.XLSX.writeFile(workbook, `${orderTitle}.xlsx`);
  currentOrderNumber += 1;
  localStorage.setItem(ORDER_NUMBER_KEY, String(currentOrderNumber));
  renderOrderSummary();
  showToast(`Wyeksportowano zamówienie: ${orderedProducts.length} pozycji.`);
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
    category: importedCategory || "Inne",
    machineType: String(row["Rodzaj maszyny"] || existingProduct?.machineType || "").trim(),
    manufacturer: String(row["Producent części"] || existingProduct?.manufacturer || "").trim(),
    location,
    stock: numberFromExcel(row["Stan magazynowy"]),
    required: numberFromExcel(
      row["Min"] !== "" && row["Min"] != null
        ? row["Min"]
        : (row["Max"] !== "" && row["Max"] != null ? row["Max"] : row["Zapotrzebowanie"])
    ),
    ordered: row["Zamówione"] !== "" && row["Zamówione"] != null
      ? numberFromExcel(row["Zamówione"])
      : numberFromExcel(existingProduct?.ordered),
    sent: numberFromExcel(row["Wysłano"]),
    purchasePrice: numberFromExcel(row["Cena zakupu (PLN)"]),
    description: String(row["Opis"] || existingProduct?.description || "").trim(),
    shipments: existingProduct && Array.isArray(existingProduct.shipments) ? existingProduct.shipments : [],
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
    } else if (nextProducts.length < PRODUCT_LIMIT) {
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

async function exportBackup() {
  try {
    const productsWithImages = await Promise.all(products.map(productWithBackupImages));
    const backup = {
      format: "stockly-backup",
      version: 2,
      createdAt: new Date().toISOString(),
      products: productsWithImages,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kopia-magazynu-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Kopia zapasowa ze zdjęciami została pobrana.");
  } catch {
    showToast("Nie udało się przygotować kopii zapasowej ze zdjęciami.");
  }
}

async function restoreBackup(file) {
  const backup = JSON.parse(await file.text());
  if (backup?.format !== "stockly-backup" || !Array.isArray(backup.products) || !backup.products.length) {
    throw new Error("To nie jest prawidłowa kopia zapasowa aplikacji.");
  }
  if (!window.confirm(`Wczytać kopię zawierającą ${backup.products.length} produktów? Obecna lista zostanie zastąpiona.`)) return;

  const restored = backup.products.slice(0, PRODUCT_LIMIT).map((product) => ({
    id: product.id || crypto.randomUUID(),
    name: String(product.name || "Produkt"),
    category: String(product.category || "Inne").trim() || "Inne",
    machineType: typeof product.machineType === "string" ? product.machineType : "",
    manufacturer: String(product.manufacturer || ""),
    location: normalizeLocation(product.location),
    description: String(product.description || ""),
    stock: numberFromExcel(product.stock),
    required: numberFromExcel(product.required),
    ordered: numberFromExcel(product.ordered),
    sent: numberFromExcel(product.sent),
    shipments: Array.isArray(product.shipments) ? product.shipments : [],
    purchasePrice: numberFromExcel(product.purchasePrice),
    images: Array.isArray(product.images) && product.images.length
      ? product.images.slice(0, 3)
      : [product.image || DEFAULT_IMAGE],
    image: (Array.isArray(product.images) && product.images[0]) || product.image || DEFAULT_IMAGE,
  }));
  await saveAllProductImages(restored);
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

  const deletedIndex = products.findIndex((item) => item.id === productId);
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
  setLastDeletedProduct({ product, index: deletedIndex });
  renderProduct();
  renderProductsList();
  showToast("Produkt został usunięty. Możesz cofnąć usunięcie.");
}

async function undoLastProductDeletion() {
  if (!lastDeletedProduct?.product) {
    showToast("Nie ma produktu do przywrócenia.");
    return;
  }
  if (products.length >= PRODUCT_LIMIT) {
    showToast(`Najpierw usuń inny produkt — osiągnięto limit ${PRODUCT_LIMIT} produktów.`);
    return;
  }
  const restored = { ...lastDeletedProduct.product };
  if (!getStoredImages(restored).length) {
    const restoredImages = await loadProductImages(restored.id);
    restored.images = restoredImages;
    restored.image = restoredImages[0] || DEFAULT_IMAGE;
  }
  if (products.some((product) => product.id === restored.id)) {
    setLastDeletedProduct(null);
    showToast("Ten produkt znajduje się już w magazynie.");
    return;
  }
  const insertIndex = Math.min(Math.max(0, Number(lastDeletedProduct.index) || 0), products.length);
  try {
    await saveProductImages(restored.id, getStoredImages(restored));
    await saveProductToCloud(restored, true);
    products.splice(insertIndex, 0, restored);
    currentProductId = restored.id;
    saveProducts();
    setLastDeletedProduct(null);
    renderProduct();
    renderProductsList();
    renderStatistics();
    updateCategorySuggestions();
    showToast(`Przywrócono produkt „${restored.name}”.`);
  } catch (error) {
    const reason = error?.message ? ` Powód: ${error.message}` : "";
    showToast(`Nie udało się przywrócić produktu.${reason}`);
  }
}

async function clearOrder() {
  if (!products.some((product) => Number(product.sent) > 0)) {
    showToast("Lista zamówienia jest już pusta.");
    return;
  }
  if (!window.confirm("Wyczyścić całe przygotowane zamówienie z kolumny „Wysłano”? Historia statystyk pozostanie bez zmian.")) return;
  const previousValues = products.map((product) => product.sent);
  products.forEach((product) => { product.sent = 0; });
  try {
    await updateAllProductsFieldInCloud({ sent: 0 });
    saveProducts();
    renderProduct();
    renderProductsList();
    showToast("Lista zamówienia została wyczyszczona.");
  } catch {
    products.forEach((product, index) => { product.sent = previousValues[index]; });
    renderOrderSummary();
    showToast("Nie udało się wyczyścić zamówienia.");
  }
}

async function createOrderFromShortages() {
  const shortageProducts = products.filter((product) => shortageQuantity(product) > 0);
  if (!shortageProducts.length) {
    showToast("Nie ma braków magazynowych do zamówienia.");
    return;
  }
  const currentOrderQuantity = products.reduce((sum, product) => sum + (Number(product.sent) || 0), 0);
  if (
    currentOrderQuantity > 0
    && !window.confirm("Zastąpić obecne wartości w kolumnie „Wysłano” nowym zamówieniem z braków?")
  ) {
    return;
  }

  const previousValues = products.map((product) => product.sent);
  products.forEach((product) => {
    product.sent = shortageQuantity(product);
  });
  const changedProducts = products.filter((product, index) => Number(product.sent) !== Number(previousValues[index]));

  try {
    if (currentUser && changedProducts.length) {
      setSyncStatus("", "Zapisywanie zamówienia…");
      await Promise.all(changedProducts.map((product) => saveProductToCloud(product, false)));
      setSyncStatus("online", "Zsynchronizowano");
    }
    saveProducts();
    renderProduct();
    renderProductsList();
    showToast(`Utworzono zamówienie z braków: ${shortageProducts.length} pozycji, ${products.reduce((sum, product) => sum + (Number(product.sent) || 0), 0)} szt.`);
  } catch (error) {
    products.forEach((product, index) => { product.sent = previousValues[index]; });
    renderProductsList();
    setSyncStatus("error", "Błąd zapisu");
    const reason = error?.message ? ` Powód: ${error.message}` : "";
    showToast(`Nie udało się utworzyć zamówienia z braków.${reason}`);
  }
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
  product.shipments = [
    ...(Array.isArray(product.shipments) ? product.shipments : []),
    { quantity, date: new Date().toISOString() },
  ];
  try {
    await saveProductToCloud(product, false);
    saveProducts();
    renderProduct();
    renderProductsList();
    renderStatistics();
    showToast(`Zarejestrowano wysyłkę ${quantity} szt.`);
  } catch {
    Object.assign(product, previous);
    showToast("Nie udało się zapisać wysyłki.");
  }
}

async function updateAllProductsFieldInCloud(values) {
  if (!currentUser) return;
  const ids = products.map((product) => product.id);
  if (!ids.length) return;
  setSyncStatus("", "Zapisywanie…");
  const { error } = await supabaseClient.from("products").update(values).in("id", ids);
  if (error) throw error;
  setSyncStatus("online", "Zsynchronizowano");
}

async function clearAllSentCounters() {
  if (!products.some((product) => Number(product.sent))) {
    showToast("Wszystkie wartości „Wysłano” są już puste.");
    return;
  }
  if (!window.confirm("Wyczyścić wartości „Wysłano” dla wszystkich produktów? Historia statystyk pozostanie bez zmian.")) return;
  const previousValues = products.map((product) => product.sent);
  products.forEach((product) => { product.sent = 0; });
  try {
    await updateAllProductsFieldInCloud({ sent: 0 });
    saveProducts();
    renderProduct();
    renderProductsList();
    renderStatistics();
    showToast("Wyczyszczono wszystkie wartości „Wysłano”. Statystyki zachowano.");
  } catch {
    products.forEach((product, index) => { product.sent = previousValues[index]; });
    showToast("Nie udało się wyczyścić wartości „Wysłano”.");
  }
}

async function clearAllStatistics() {
  if (!products.some((product) => Array.isArray(product.shipments) && product.shipments.length)) {
    showToast("Statystyki są już puste.");
    return;
  }
  if (!window.confirm("Wyczyścić całą historię statystyk wysyłek? Produkty, stany i kolumna „Wysłano” pozostaną bez zmian.")) return;
  const previousShipments = products.map((product) =>
    Array.isArray(product.shipments) ? [...product.shipments] : []
  );
  products.forEach((product) => { product.shipments = []; });
  try {
    await updateAllProductsFieldInCloud({ shipments: [] });
    saveProducts();
    renderStatistics();
    showToast("Cała historia statystyk została wyczyszczona.");
  } catch {
    products.forEach((product, index) => { product.shipments = previousShipments[index]; });
    showToast("Nie udało się wyczyścić statystyk.");
  }
}

async function saveQuickInventoryChange(product, previous, successMessage) {
  try {
    await saveProductToCloud(product, false);
    saveProducts();
    renderProduct();
    renderProductsList();
    renderStatistics();
    showToast(successMessage);
  } catch (error) {
    Object.assign(product, previous);
    renderProduct();
    setSyncStatus("error", "Błąd zapisu");
    const reason = error?.message ? ` Powód: ${error.message}` : "";
    showToast(`Nie udało się zapisać zmiany.${reason}`);
  }
}

async function quickAddStock() {
  const product = getCurrentProduct();
  if (!product) return;
  const value = window.prompt(
    `Ile sztuk dodać do stanu produktu „${product.name}”?\n\nObecny stan: ${Number(product.stock)} szt.`,
    "1",
  );
  if (value === null) return;
  const quantity = Math.floor(numberFromExcel(value));
  if (quantity <= 0) {
    showToast("Wpisz liczbę większą od zera.");
    return;
  }
  const previous = { ...product };
  product.stock = Number(product.stock) + quantity;
  await saveQuickInventoryChange(
    product,
    previous,
    `Dodano ${quantity} szt. Nowy stan: ${product.stock} szt.`,
  );
}

async function quickChangeRequired() {
  const product = getCurrentProduct();
  if (!product) return;
  const value = window.prompt(
    `Ustaw nowe minimum magazynowe dla produktu „${product.name}”.\n\nObecne minimum: ${Number(product.required)} szt.`,
    String(Number(product.required)),
  );
  if (value === null) return;
  const required = Math.floor(numberFromExcel(value));
  const previous = { ...product };
  product.required = required;
  await saveQuickInventoryChange(
    product,
    previous,
    `Ustawiono minimum magazynowe: ${required} szt.`,
  );
}

editButton.addEventListener("click", () => openModal("edit"));
deleteProductButton.addEventListener("click", () => deleteProduct(currentProductId));
newProductButton.addEventListener("click", () => {
  if (products.length >= PRODUCT_LIMIT) {
    showToast(`Osiągnięto limit ${PRODUCT_LIMIT} produktów.`);
    return;
  }
  openModal("new");
});
stockButton.addEventListener("click", () => openModal("edit", true));
quickAddStockButton.addEventListener("click", quickAddStock);
quickChangeRequiredButton.addEventListener("click", quickChangeRequired);
allProductsButton.addEventListener("click", () => setView(currentView === "list" ? "detail" : "list"));
productsNavButton.addEventListener("click", (event) => {
  event.preventDefault();
  setView("list");
});
statisticsNavButton.addEventListener("click", (event) => {
  event.preventDefault();
  setView("statistics");
});
ordersNavButton.addEventListener("click", (event) => {
  event.preventDefault();
  setView("orders");
});
breadcrumbs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-breadcrumb-view]");
  if (!button) return;
  setView(button.dataset.breadcrumbView);
});
statisticsRangeOne.addEventListener("change", renderStatistics);
statisticsRangeTwo.addEventListener("change", renderStatistics);
statisticsSearch.addEventListener("input", renderStatistics);
topProductsCount.addEventListener("change", renderStatistics);
undoDeleteButton.addEventListener("click", undoLastProductDeletion);
clearAllSentButton.addEventListener("click", clearAllSentCounters);
clearStatisticsButton.addEventListener("click", clearAllStatistics);
createShortageOrderButton.addEventListener("click", createOrderFromShortages);
ordersCreateShortageOrderButton.addEventListener("click", createOrderFromShortages);
shortageFilterButton.addEventListener("click", () => {
  showShortagesOnly = !showShortagesOnly;
  renderProductsList();
});
statisticsList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-statistics-product]");
  if (!button) return;
  currentProductId = button.dataset.statisticsProduct;
  activeImageIndex = 0;
  renderProduct();
  setView("detail");
});
statisticsProductsList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-statistics-product]");
  if (!button) return;
  currentProductId = button.dataset.statisticsProduct;
  activeImageIndex = 0;
  renderProduct();
  setView("detail");
});
ordersList.addEventListener("click", (event) => {
  const rowImage = event.target.closest(".row-image");
  if (rowImage) {
    const row = rowImage.closest("[data-order-product]");
    const product = products.find((item) => item.id === row?.dataset.orderProduct);
    if (product) {
      event.stopPropagation();
      openImageLightbox(getProductImages(product)[0], `Zdjęcie produktu: ${product.name}`);
    }
    return;
  }
  const target = event.target.closest("[data-order-product], [data-open-order-product]");
  const productId = target?.dataset.orderProduct || target?.dataset.openOrderProduct;
  if (!productId) return;
  currentProductId = productId;
  activeImageIndex = 0;
  renderProduct();
  setView("detail");
});
ordersList.addEventListener("keydown", (event) => {
  if (event.target.matches("[data-order-product]") && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    currentProductId = event.target.dataset.orderProduct;
    activeImageIndex = 0;
    renderProduct();
    setView("detail");
  }
});
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
  showShortagesOnly = false;
  renderProductsList();
});
exportExcelButton.addEventListener("click", exportProductsToExcel);
exportOrderButton.addEventListener("click", exportOrderToExcel);
clearOrderButton.addEventListener("click", clearOrder);
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
  locationShelf.value = DEFAULT_SHELVES.includes(shelf) ? shelf : "INNE";
});
form.elements.name.addEventListener("input", updateLocationSuggestion);
form.elements.machineType.addEventListener("input", updateLocationSuggestion);
form.elements.category.addEventListener("input", updateLocationSuggestion);
locationSuggestion.addEventListener("click", () => {
  form.elements.location.value = locationSuggestion.dataset.location;
  const shelf = getShelf(locationSuggestion.dataset.location);
  locationShelf.value = DEFAULT_SHELVES.includes(shelf) ? shelf : "INNE";
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
  const rowImage = event.target.closest(".row-image");
  if (rowImage) {
    const row = rowImage.closest("[data-product-id]");
    const product = products.find((item) => item.id === row?.dataset.productId);
    if (product) {
      event.stopPropagation();
      openImageLightbox(getProductImages(product)[0], `Zdjęcie produktu: ${product.name}`);
    }
    return;
  }
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
  if (currentView === "detail") updateViewHistory("detail", true);
});

productGalleryThumbs.addEventListener("click", (event) => {
  const thumb = event.target.closest("[data-gallery-index]");
  if (!thumb) return;
  activeImageIndex = Number(thumb.dataset.galleryIndex);
  renderProduct();
});

document.querySelectorAll("[data-product-image]").forEach((image) => {
  image.addEventListener("click", () => {
    const product = getCurrentProduct();
    openImageLightbox(getProductImages(product)[activeImageIndex], `Zdjęcie produktu: ${product.name}`);
  });
});

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.addEventListener("load", () => {
      const sourceImage = new Image();
      sourceImage.onerror = reject;
      sourceImage.addEventListener("load", () => {
        const maxSide = IMAGE_MAX_SIDE;
        const scale = Math.min(1, maxSide / Math.max(sourceImage.width, sourceImage.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(sourceImage.width * scale);
        canvas.height = Math.round(sourceImage.height * scale);
        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", IMAGE_QUALITY));
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

imagePreviews.addEventListener("click", async (event) => {
  const rotateButton = event.target.closest("[data-rotate-image]");
  if (rotateButton) {
    const index = Number(rotateButton.dataset.rotateImage);
    try {
      pendingImages[index] = await rotateImage(pendingImages[index], rotateButton.dataset.direction);
      updateImagePreviews();
    } catch {
      showToast("Nie udało się obrócić zdjęcia.");
    }
    return;
  }
  const button = event.target.closest("[data-remove-image]");
  if (!button) return;
  pendingImages.splice(Number(button.dataset.removeImage), 1);
  updateImagePreviews();
});

closeLightbox.addEventListener("click", closeImageLightbox);
imageLightbox.addEventListener("click", (event) => {
  if (event.target === imageLightbox) closeImageLightbox();
});

document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModal));
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!imageLightbox.hidden) closeImageLightbox();
    if (!modal.hidden) closeModal();
    if (!authModal.hidden) {
      authModal.hidden = true;
      document.body.style.overflow = "";
    }
  }
});

window.addEventListener("popstate", (event) => {
  const state = event.state || { view: "list", productId: currentProductId };
  if (state.productId && products.some((product) => product.id === state.productId)) {
    currentProductId = state.productId;
    activeImageIndex = 0;
    renderProduct();
  }
  setView(state.view || "list", { updateHistory: false });
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
    shipments: formMode === "new"
      ? []
      : (Array.isArray(getCurrentProduct().shipments) ? getCurrentProduct().shipments : []),
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
    await saveProductImages(savedProduct.id, getStoredImages(savedProduct));
    await saveProductToCloud(savedProduct, formMode === "new");
    saveProducts();
  } catch (error) {
    products = productsBeforeSave;
    currentProductId = productIdBeforeSave;
    setSyncStatus("error", "Błąd zapisu");
    const reason = error?.message ? ` Powód: ${error.message}` : "";
    showToast(`Nie udało się zapisać produktu.${reason}`);
    return;
  }
  renderProduct();
  renderProductsList();
  updateCategorySuggestions();
  closeModal();
  showToast(formMode === "new" ? "Nowy produkt został dodany." : "Zmiany zostały zapisane.");
});

renderProduct();
renderProductsList();
setLastDeletedProduct(lastDeletedProduct);
setView("list", { replaceHistory: true });
requestPersistentLocalStorage();
registerServiceWorker();
hydrateImagesFromLocalDatabase();
initializeSupabase();
setInterval(() => {
  if (currentUser && document.visibilityState === "visible") {
    loadCloudProducts({ quiet: true });
  }
}, 10000);
