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

let clientSupabase = null;
let clientProducts = [];
let clientSession = null;

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
    : "Brak produktów przypisanych do tego konta.";

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
      </article>
    `).join("")
    : '<div class="client-empty">Nie znaleziono produktów dla tego konta.</div>';
}

async function loadClientProducts() {
  if (!clientSession) return;
  clientStatus.textContent = "Ładowanie produktów…";
  const { data, error } = await clientSupabase.rpc("get_client_products");
  if (error) {
    clientStatus.textContent = "Nie udało się pobrać produktów.";
    showClientToast("Sprawdź, czy uruchomiono najnowszy supabase-setup.sql.");
    return;
  }
  clientProducts = Array.isArray(data) ? data : [];
  renderClientProducts();
}

function setClientSession(session) {
  clientSession = session;
  clientLoginCard.hidden = Boolean(session);
  clientProductsCard.hidden = !session;
  if (session) loadClientProducts();
}

async function initializeClientApp() {
  if (!window.supabase?.createClient) {
    showClientToast("Nie udało się załadować logowania Supabase.");
    return;
  }
  clientSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data } = await clientSupabase.auth.getSession();
  setClientSession(data.session);
  clientSupabase.auth.onAuthStateChange((_event, session) => setClientSession(session));
}

clientLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = clientLoginForm.elements.email.value.trim();
  const button = clientLoginForm.querySelector("button[type='submit']");
  button.disabled = true;
  button.textContent = "Wysyłanie…";
  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  const { error } = await clientSupabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  button.disabled = false;
  button.textContent = "Wyślij link logowania";
  if (error) {
    showClientToast(`Nie udało się wysłać linku: ${error.message}`);
    return;
  }
  showClientToast("Link logowania został wysłany na e-mail klienta.");
});

clientLogoutButton.addEventListener("click", async () => {
  await clientSupabase.auth.signOut();
  clientProducts = [];
  renderClientProducts();
  showClientToast("Wylogowano.");
});

clientRefreshButton.addEventListener("click", loadClientProducts);
clientSearch.addEventListener("input", renderClientProducts);

initializeClientApp();
