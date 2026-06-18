const STORAGE_KEY = "stockly-products-v2";
const DEFAULT_IMAGE = "product-placeholder.svg";

const defaultProduct = {
  id: crypto.randomUUID(),
  name: "Płytka testowa 1",
  category: "Płytka testowa",
  location: "A/1/1",
  description: "Płytka z dużą liczbą elementów montowanych powierzchniowo.",
  stock: 0,
  required: 50,
  ordered: 16,
  purchasePrice: 0,
  image: "product-board.svg",
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
const imagePreview = document.querySelector("#imagePreview");
const removeImageButton = document.querySelector("#removeImageButton");
const detailView = document.querySelector("#detailView");
const productsView = document.querySelector("#productsView");
const productsList = document.querySelector("#productsList");
const productsCount = document.querySelector("#productsCount");
const allProductsButton = document.querySelector("#allProductsButton");
const viewButtonLabel = document.querySelector("#viewButtonLabel");
const pageTitle = document.querySelector("#pageTitle");
const deleteProductButton = document.querySelector("#deleteProductButton");

let products = loadProducts();
let currentProductId = products[0].id;
let formMode = "edit";
let pendingImage = products[0].image;
let currentView = "detail";

function loadProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const loaded = Array.isArray(saved) && saved.length ? saved : [defaultProduct];
    return loaded.slice(0, 100).map((product) => ({
      ...product,
      location: normalizeLocation(product.location),
      purchasePrice: Number(product.purchasePrice) || 0,
    }));
  } catch {
    return [defaultProduct];
  }
}

function normalizeLocation(location) {
  const parts = String(location || "").split("/").filter(Boolean);
  while (parts.length < 3) parts.push("1");
  return parts.slice(0, 3).join("/").toUpperCase();
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
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
  document.querySelectorAll("[data-field]").forEach((element) => {
    const key = element.dataset.field;
    if (key in product) element.textContent = product[key];
  });

  document.querySelectorAll("[data-product-image]").forEach((image) => {
    image.src = product.image || DEFAULT_IMAGE;
    image.alt = `Zdjęcie produktu: ${product.name}`;
  });
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
  productsCount.textContent = products.length;
  productsList.innerHTML = products.length
    ? products.map((product, index) => `
      <div class="product-list-row" data-product-id="${product.id}" role="button" tabindex="0" aria-label="Otwórz produkt ${escapeHtml(product.name)}">
        <span class="row-number">${index + 1}</span>
        <span class="row-image"><img src="${escapeHtml(product.image || DEFAULT_IMAGE)}" alt="" /></span>
        <span class="row-name">
          <strong>${escapeHtml(product.name)}</strong>
          <span>${escapeHtml(product.description || product.category)}</span>
        </span>
        <span class="row-location">${escapeHtml(normalizeLocation(product.location))}</span>
        <span class="row-quantity">${Number(product.stock)} <small>szt.</small></span>
        <span class="row-quantity row-demand">${Number(product.required)} <small>szt.</small></span>
        <span class="row-price">${formatPrice(product.purchasePrice)}</span>
        <button class="row-delete-button" type="button" data-delete-product="${product.id}" aria-label="Usuń produkt ${escapeHtml(product.name)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4V2h8v2h5v2H3V4h5Zm-2 4h12l-1 14H7L6 8Zm4 2v9h2v-9h-2Zm4 0v9h2v-9h-2Z"/></svg>
        </button>
      </div>
    `).join("")
    : '<div class="empty-products">Nie dodano jeszcze żadnych produktów.</div>';
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
  form.elements.category.value = product.category || "";
  form.elements.location.value = product.location || "";
  form.elements.description.value = product.description || "";
  form.elements.stock.value = product.stock ?? 0;
  form.elements.required.value = product.required ?? 0;
  form.elements.ordered.value = product.ordered ?? 0;
  form.elements.purchasePrice.value = product.purchasePrice ?? 0;
  pendingImage = product.image || "";
  updateImagePreview();
  imageInput.value = "";
}

function openModal(mode = "edit", focusStock = false) {
  formMode = mode;
  const product = mode === "new"
    ? { name: "", category: "", location: "", description: "", stock: 0, required: 0, ordered: 0, purchasePrice: 0, image: "" }
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

function updateImagePreview() {
  imagePreview.src = pendingImage || "";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
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

function deleteProduct(productId) {
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
allProductsButton.addEventListener("click", () => {
  setView(currentView === "list" ? "detail" : "list");
});

productsList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-product]");
  if (deleteButton) {
    event.stopPropagation();
    deleteProduct(deleteButton.dataset.deleteProduct);
    return;
  }
  const row = event.target.closest("[data-product-id]");
  if (!row) return;
  currentProductId = row.dataset.productId;
  renderProduct();
  setView("detail");
});

productsList.addEventListener("keydown", (event) => {
  if (event.target.matches("[data-product-id]") && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    currentProductId = event.target.dataset.productId;
    renderProduct();
    setView("detail");
  }
});

productSelect.addEventListener("change", () => {
  currentProductId = productSelect.value;
  renderProduct();
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  if (file.size > 3 * 1024 * 1024) {
    imageInput.value = "";
    showToast("Zdjęcie może mieć maksymalnie 3 MB.");
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const sourceImage = new Image();
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
      pendingImage = canvas.toDataURL("image/jpeg", 0.82);
      updateImagePreview();
    });
    sourceImage.src = reader.result;
  });
  reader.readAsDataURL(file);
});

removeImageButton.addEventListener("click", () => {
  pendingImage = "";
  imageInput.value = "";
  updateImagePreview();
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const productsBeforeSave = products.map((product) => ({ ...product }));
  const productIdBeforeSave = currentProductId;
  const productData = {
    name: data.get("name").trim(),
    category: data.get("category").trim(),
    location: normalizeLocation(data.get("location")),
    description: data.get("description").trim(),
    stock: Number(data.get("stock")),
    required: Number(data.get("required")),
    ordered: Number(data.get("ordered")),
    purchasePrice: Number(data.get("purchasePrice")),
    image: pendingImage,
  };

  if (formMode === "new") {
    const newProduct = { id: crypto.randomUUID(), ...productData };
    products.push(newProduct);
    currentProductId = newProduct.id;
  } else {
    const index = products.findIndex((product) => product.id === currentProductId);
    products[index] = { ...products[index], ...productData };
  }

  try {
    saveProducts();
  } catch {
    products = productsBeforeSave;
    currentProductId = productIdBeforeSave;
    showToast("Nie udało się zapisać. Wybierz mniejsze zdjęcie.");
    return;
  }
  renderProduct();
  renderProductsList();
  closeModal();
  showToast(formMode === "new" ? "Nowy produkt został dodany." : "Zmiany zostały zapisane.");
});

renderProduct();
renderProductsList();
