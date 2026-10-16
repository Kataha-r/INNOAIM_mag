"use strict";
const SUPABASE_URL = "https://amvgmfvjidukphbbblms.supabase.co";
const SUPABASE_KEY = "sb_publishable_GmzJPNZa8Ut8njNuJr7s6A_oYlEk-q_";
const $ = (id) => document.getElementById(id);
let api, sessionUser = null, products = [], loading = false, generation = 0;
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
async function loadProducts() {
  if (!sessionUser || loading || document.hidden) return;
  loading = true;
  const ticket = generation;
  $("refresh").disabled = true;
  $("syncStatus").textContent = "Aktualizowanie…";
  try {
    const fresh = [];
    for (let start = 0; ; start += 50) {
      const {data, error} = await api.rpc("client_inventory").range(start, start + 49);
      if (ticket !== generation) return;
      if (error) throw error;
      fresh.push(...(data || []));
      if (!data || data.length < 50) break;
    }
    products = fresh;
    const previousCategory = $("category").value;
    $("category").innerHTML = '<option value="">Wszystkie kategorie</option>' + [...new Set(products.map((p) => p.category).filter(Boolean))].sort((a,b) => a.localeCompare(b,"pl")).map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
    $("category").value = previousCategory;
    if (!$("category").value) $("category").value = "";
    $("loginCard").hidden = true;
    $("catalog").hidden = false;
    $("account").textContent = sessionUser.email;
    render();
    $("syncStatus").textContent = `Aktualizacja: ${new Date().toLocaleTimeString("pl-PL")} · co 30 s`;
  } catch (error) {
    if (ticket !== generation) return;
    // Clear old data on every failed access check, including revoked permissions.
    clearCatalog();
    $("loginMessage").textContent = error.code === "42501"
      ? "Ten adres nie ma dostępu do panelu. Skontaktuj się z InnoAim."
      : "Nie udało się sprawdzić dostępu lub pobrać produktów. Sprawdź połączenie i spróbuj ponownie. Jeśli problem trwa, skontaktuj się z InnoAim.";
  } finally {
    loading = false;
    $("refresh").disabled = false;
  }
}
function acceptSession(session) {
  const user = session?.user || null;
  if (user?.id !== sessionUser?.id) clearCatalog();
  sessionUser = user;
  if (user) loadProducts();
  else clearCatalog();
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
  const {error} = await api.auth.signOut({scope:"local"});
  $("loginMessage").textContent = error ? "Nie udało się zakończyć sesji. Spróbuj ponownie po odzyskaniu połączenia." : "Wylogowano. Możesz zalogować się ponownie.";
});
$("refresh").addEventListener("click", loadProducts);
$("search").addEventListener("input", render);
$("category").addEventListener("change", render);
document.addEventListener("visibilitychange", () => { if (!document.hidden) loadProducts(); });
window.addEventListener("online", loadProducts);
window.addEventListener("offline", () => {
  clearCatalog();
  $("loginMessage").textContent = "Brak internetu. Po odzyskaniu połączenia ponownie sprawdzimy dostępność.";
});
async function initialize() {
  try {
    if (!window.supabase?.createClient) throw new Error("SDK unavailable");
    api = window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{storageKey:"innoaim-inventory-client-v1"}});
    api.auth.onAuthStateChange((_event,session) => { setTimeout(() => acceptSession(session),0); });
    const {data,error} = await api.auth.getSession();
    if (error) throw error;
    acceptSession(data.session);
    $("loginMessage").textContent = "Dostęp wyłącznie dla klientów zaproszonych przez InnoAim.";
    $("sendLink").disabled = false;
    setInterval(loadProducts,30000);
  } catch {
    $("loginMessage").textContent = "Nie udało się uruchomić panelu. Sprawdź internet i odśwież stronę.";
  }
}
initialize();
