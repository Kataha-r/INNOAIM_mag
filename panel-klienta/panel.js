"use strict";
const SUPABASE_URL = "https://amvgmfvjidukphbbblms.supabase.co";
const SUPABASE_KEY = "sb_publishable_GmzJPNZa8Ut8njNuJr7s6A_oYlEk-q_";
const $ = (id) => document.getElementById(id);
let api, sessionUser = null, products = [], loading = false, generation = 0, reloadPending = false;
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function imageUrl(value) {
  if (typeof value !== "string") return "product-placeholder.svg";
  if (/^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(value)) return value;
  try { const url = new URL(value); if (url.protocol === "https:") return url.href; } catch {}
  return "product-placeholder.svg";
}
function render() {
  const search = $("search").value.trim().toLocaleLowerCase("pl");
  const category = $("category").value;
  const visible = products.filter((p) => (!category || p.category === category) && [p.name,p.category,p.manufacturer,p.machine_type,p.description].join(" ").toLocaleLowerCase("pl").includes(search));
  $("count").textContent = `Wyświetlono ${visible.length} z ${products.length} produktów`;
  $("products").innerHTML = visible.length ? visible.map((p) => {
    const stock = Math.max(0, Math.floor(Number(p.stock) || 0));
    const photo = imageUrl((Array.isArray(p.images) && p.images[0]) || p.image);
    return `<article class="product" role="listitem"><img src="${escapeHtml(photo)}" alt="" loading="lazy" referrerpolicy="no-referrer"><div class="product-info"><h3>${escapeHtml(p.name)}</h3><div class="metadata">${[p.category,p.manufacturer,p.machine_type].filter(Boolean).map(escapeHtml).join(" · ")}</div>${p.description ? `<p class="description">${escapeHtml(p.description)}</p>` : ""}</div><div class="stock ${stock === 0 ? "zero" : ""}"><span class="sr-only">Stan magazynowy:</span><strong>${stock.toLocaleString("pl-PL")} <small>szt.</small></strong>${stock === 0 ? '<span class="zero-label">Brak na stanie</span>' : ""}</div></article>`;
  }).join("") : `<div class="empty">${products.length ? "Brak produktów pasujących do wyszukiwania." : "Magazyn nie zawiera jeszcze produktów."}</div>`;
  $("products").querySelectorAll("img").forEach((img) => img.addEventListener("error", () => { img.src = "product-placeholder.svg"; }, {once:true}));
}
function clearCatalog() {
  generation++;
  products = [];
  $("products").replaceChildren();
  $("count").textContent = "";
  $("account").textContent = "";
  $("search").value = "";
  $("category").innerHTML = '<option value="">Wszystkie kategorie</option>';
  $("catalog").hidden = true;
  $("loginCard").hidden = false;
}
function showAccess(title, message, retry = false) {
  $("loginCard").hidden = true;
  $("accessCard").hidden = false;
  $("accessCard").setAttribute("aria-busy", String(!retry));
  $("accessTitle").textContent = title;
  $("accessMessage").textContent = message;
  $("retryAccess").hidden = !retry;
  $("changeAccount").hidden = !retry || !sessionUser;
}
function showLogin(message) {
  $("accessCard").hidden = true;
  $("loginCard").hidden = false;
  $("loginMessage").textContent = message;
}
function showCatalog(nextProducts, complete) {
  products = nextProducts;
  const selected = $("category").value;
  $("category").innerHTML = '<option value="">Wszystkie kategorie</option>' + [...new Set(products.map((p) => p.category).filter(Boolean))].sort((a,b) => a.localeCompare(b,"pl")).map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  $("category").value = selected;
  if (!$("category").value) $("category").value = "";
  $("loginCard").hidden = true;
  $("accessCard").hidden = true;
  $("catalog").hidden = false;
  $("account").textContent = sessionUser.email;
  render();
  $("syncStatus").textContent = complete
    ? `Aktualizacja: ${new Date().toLocaleTimeString("pl-PL")} · co 30 s`
    : `Wczytano ${products.length} produktów · pobieranie pozostałych…`;
}
async function loadProducts() {
  if (!sessionUser || document.hidden) return;
  if (loading) { reloadPending = true; return; }
  loading = true;
  reloadPending = false;
  const ticket = generation;
  const initialLoad = $("catalog").hidden;
  if (initialLoad) showAccess("Wczytywanie produktów…", "Zalogowano. Pobieramy aktualne stany magazynowe.");
  $("refresh").disabled = true;
  $("syncStatus").textContent = "Aktualizowanie…";
  try {
    const fresh = [];
    for (let start = 0; ; start += 50) {
      const {data, error} = await api.rpc("client_inventory").range(start, start + 49);
      if (ticket !== generation) return;
      if (error) throw error;
      fresh.push(...(data || []));
      const complete = !data || data.length < 50;
      // Pierwsze produkty są widoczne bez oczekiwania na wszystkie zdjęcia w bazie.
      if (initialLoad) showCatalog(fresh.slice(), complete);
      if (complete) break;
    }
    showCatalog(fresh, true);
  } catch (error) {
    if (ticket !== generation) return;
    // Clear old data on every failed access check, including revoked permissions.
    clearCatalog();
    showAccess(error.code === "42501" ? "Brak dostępu do magazynu" : "Nie udało się pobrać produktów",
      error.code === "42501"
        ? `Konto ${sessionUser?.email || ""} jest zalogowane, ale nie ma uprawnień. Skontaktuj się z InnoAim. Po nadaniu dostępu kliknij „Spróbuj ponownie”.`
        : "Logowanie nie wymaga ponownego wpisywania e-maila. Sprawdź połączenie i kliknij „Spróbuj ponownie”.", true);
  } finally {
    loading = false;
    $("refresh").disabled = false;
    if (reloadPending && sessionUser) { reloadPending = false; setTimeout(loadProducts, 0); }
  }
}
function acceptSession(session) {
  const user = session?.user || null;
  const sameUser = user?.id === sessionUser?.id;
  if (user?.id !== sessionUser?.id) clearCatalog();
  sessionUser = user;
  if (user) {
    if (!sameUser || (!loading && $("catalog").hidden)) loadProducts();
  } else {
    clearCatalog();
    showLogin("Wpisz e-mail, aby otrzymać jednorazowy link do magazynu.");
  }
}
$("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!api) return;
  $("sendLink").disabled = true;
  $("loginMessage").textContent = "Wysyłanie linku…";
  try {
    const redirect = new URL("./", window.location.href).href;
    const {error} = await api.auth.signInWithOtp({email:$("email").value.trim().toLowerCase(),options:{shouldCreateUser:false,emailRedirectTo:redirect}});
    if (error) throw error;
    $("loginMessage").textContent = "Jeśli adres ma aktywne konto, otrzymasz link do logowania. Sprawdź pocztę i folder spam. Otwórz link w tej przeglądarce.";
  } catch {
    $("loginMessage").textContent = "Nie udało się wysłać linku. Sprawdź adres i połączenie. Odczekaj minutę i spróbuj ponownie lub skontaktuj się z InnoAim.";
  } finally { $("sendLink").disabled = false; }
});
$("logout").addEventListener("click", async () => {
  sessionUser = null;
  clearCatalog();
  showLogin("Wylogowywanie…");
  const {error} = await api.auth.signOut({scope:"local"});
  $("loginMessage").textContent = error ? "Nie udało się zakończyć sesji. Spróbuj ponownie po odzyskaniu połączenia." : "Wylogowano. Możesz zalogować się ponownie.";
});
$("changeAccount").addEventListener("click", () => $("logout").click());
$("retryAccess").addEventListener("click", () => {
  if (sessionUser) loadProducts();
  else window.location.reload();
});
$("refresh").addEventListener("click", loadProducts);
$("search").addEventListener("input", render);
$("category").addEventListener("change", render);
document.addEventListener("visibilitychange", () => { if (!document.hidden) loadProducts(); });
window.addEventListener("online", loadProducts);
window.addEventListener("offline", () => {
  clearCatalog();
  showAccess("Brak połączenia", "Po odzyskaniu internetu sprawdzimy dostęp automatycznie. Nie musisz ponownie wpisywać e-maila.", true);
});
async function initialize() {
  try {
    if (!window.supabase?.createClient) throw new Error("SDK unavailable");
    const callbackError = new URLSearchParams(window.location.hash.slice(1)).get("error");
    api = window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{storageKey:"innoaim-inventory-client-v1",flowType:"implicit",detectSessionInUrl:true,persistSession:true,autoRefreshToken:true}});
    api.auth.onAuthStateChange((_event,session) => { setTimeout(() => acceptSession(session),0); });
    const {data,error} = await api.auth.getSession();
    if (error) throw error;
    acceptSession(data.session);
    if (!data.session && callbackError) showLogin("Ten link wygasł lub został już wykorzystany. Zamów nowy link do logowania.");
    $("sendLink").disabled = false;
    setInterval(loadProducts,30000);
  } catch {
    showAccess("Nie udało się otworzyć magazynu", "Sprawdź połączenie i spróbuj ponownie. Jeśli link wygasł lub był już użyty, otwórz panel bez linku z poczty i zamów nowy.", true);
  }
}
initialize();
