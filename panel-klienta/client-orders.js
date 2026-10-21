"use strict";
window.InnoAimClientOrders = (() => {
  const contactName = "Radosława Puźniaka";
  const contactEmail = ""; // Uzupełnić po podaniu adresu przez właściciela.
  const escape = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function create({getProducts, getUser, imageUrl, getWarehouseNumber = product => Number(product.warehouse_number)}) {
    function numberOf(product) {
      const number = Number(getWarehouseNumber(product));
      if (!Number.isSafeInteger(number) || number < 1) {
        throw new Error(`Brak numeru magazynowego produktu „${product.name}”. Odśwież panel po synchronizacji z chmurą.`);
      }
      return number;
    }
    const cart = new Map(), drafts = new Map();
    let available = false, lastSignature = "", orderId = "", previousFocus = null;
    const section = document.createElement("section");
    section.className = "card client-cart";
    section.innerHTML = `<h2>Twoje zamówienie</h2><p>Wybierz produkty, uzupełnij dane i pobierz plik Excel. Wyślij go do ${contactName}${contactEmail ? `: ${escape(contactEmail)}` : "."}</p><div id="cartItems"></div><p id="cartSummary"></p><form id="cartForm"><div class="cart-fields"><label>Firma / odbiorca<input name="recipientName" maxlength="200" required autocomplete="organization"></label><label>Osoba kontaktowa<input name="contactPerson" maxlength="200" autocomplete="name"></label><label class="wide">Adres wysyłki<textarea name="recipientAddress" rows="3" maxlength="1000" required autocomplete="street-address"></textarea></label><label>Telefon<input name="phoneNumber" type="tel" maxlength="80" autocomplete="tel"></label><label>E-mail<input name="clientEmail" type="email" maxlength="254" required autocomplete="email"></label><label class="wide">Uwagi<textarea name="notes" rows="2" maxlength="2000"></textarea></label></div><div class="actions"><button type="submit" id="exportClientOrder">Pobierz zamówienie Excel</button><button type="button" class="secondary" id="clearClientOrder">Wyczyść zamówienie</button></div></form><p id="cartMessage" role="status" aria-live="polite"></p>`;
    document.getElementById("catalog").append(section);
    const list = section.querySelector("#cartItems"), form = section.querySelector("form");
    const message = section.querySelector("#cartMessage");
    const dialog = document.createElement("dialog");
    dialog.className = "photo-dialog";
    dialog.innerHTML = `<div class="photo-top"><h2 id="photoTitle">Zdjęcie produktu</h2><button type="button" class="secondary" aria-label="Zamknij powiększenie">Zamknij ×</button></div><img alt=""><p>Kliknij poza zdjęciem lub naciśnij Esc, aby zamknąć.</p>`;
    dialog.setAttribute("aria-labelledby", "photoTitle");
    document.body.append(dialog);
    function closePhoto() { dialog.close(); dialog.querySelector("img").removeAttribute("src"); previousFocus?.focus(); }
    dialog.querySelector("button").addEventListener("click", closePhoto);
    dialog.addEventListener("click", e => { if (e.target === dialog) closePhoto(); });
    dialog.addEventListener("cancel", e => { e.preventDefault(); closePhoto(); });
    const find = id => getProducts().find(p => p.id === id);
    const stockOf = p => Math.max(0, Math.floor(Number(p?.stock) || 0));
    function controls(p) {
      const stock = stockOf(p);
      return `<div class="product-order"><label><span class="sr-only">Ilość do zamówienia: ${escape(p.name)}</span><input data-order-qty="${escape(p.id)}" type="number" min="1" step="1" max="${stock}" value="${escape(drafts.get(p.id) || 1)}" ${stock ? "" : "disabled"} inputmode="numeric"></label><button type="button" data-order-add="${escape(p.id)}" ${stock ? "" : "disabled"} aria-label="Dodaj do zamówienia: ${escape(p.name)}">Dodaj</button></div>`;
    }
    function refresh() {
      section.hidden = !available;
      let total = 0, invalid = false;
      list.innerHTML = [...cart.values()].map(item => {
        total += item.quantity;
        const product = find(item.id), stock = stockOf(product);
        const problem = !product ? "Produkt nie jest już dostępny." : item.quantity > stock ? `Dostępne tylko ${stock} szt. Zmień ilość.` : "";
        invalid ||= Boolean(problem);
        return `<div class="cart-row"><div><strong>${escape(product?.name || item.name)}</strong>${problem ? `<p class="order-error">${escape(problem)}</p>` : ""}</div><label><span class="sr-only">Ilość: ${escape(item.name)}</span><input data-cart-qty="${escape(item.id)}" type="number" min="1" step="1" value="${item.quantity}" inputmode="numeric"></label><span>szt.</span><button type="button" class="secondary" data-cart-remove="${escape(item.id)}" aria-label="Usuń z zamówienia: ${escape(item.name)}">Usuń</button></div>`;
      }).join("") || '<p class="cart-empty">Zamówienie jest puste. Kliknij „Dodaj” przy wybranym produkcie.</p>';
      section.querySelector("#cartSummary").textContent = `${cart.size} pozycji · ${total} szt.`;
      section.querySelector("#exportClientOrder").disabled = !available || !cart.size || invalid;
      section.querySelector("#clearClientOrder").disabled = !cart.size;
      if (!form.elements.clientEmail.value && getUser()?.email) form.elements.clientEmail.value = getUser().email;
    }
    function add(id) {
      const product = find(id), quantity = Number(drafts.get(id) || 1);
      if (!product || !Number.isSafeInteger(quantity) || quantity <= 0) { message.textContent = "Wpisz dodatnią, całkowitą liczbę sztuk."; return; }
      const next = (cart.get(id)?.quantity || 0) + quantity;
      if (next > stockOf(product)) { message.textContent = `Dla produktu „${product.name}” dostępne jest ${stockOf(product)} szt. (w zamówieniu masz już ${cart.get(id)?.quantity || 0}).`; section.scrollIntoView({block:"nearest",behavior:"smooth"}); return; }
      cart.set(id, {id, name:product.name, quantity:next});
      message.textContent = `Dodano: ${product.name} — zamówiono łącznie ${next} szt.`;
      refresh();
    }
    document.getElementById("products").addEventListener("input", e => {
      if (e.target.dataset.orderQty) drafts.set(e.target.dataset.orderQty, e.target.value);
    });
    document.getElementById("products").addEventListener("click", e => {
      const photo = e.target.closest("[data-photo]");
      if (photo) {
        const p = find(photo.dataset.photo); if (!p) return;
        previousFocus = photo;
        dialog.querySelector("h2").textContent = p.name;
        const img = dialog.querySelector("img");
        img.src = imageUrl((Array.isArray(p.images) && p.images[0]) || p.image);
        img.alt = p.name;
        dialog.showModal(); return;
      }
      const button = e.target.closest("[data-order-add]"); if (button) add(button.dataset.orderAdd);
    });
    list.addEventListener("click", e => { const button = e.target.closest("[data-cart-remove]"); if (button) { cart.delete(button.dataset.cartRemove); message.textContent = ""; refresh(); } });
    list.addEventListener("change", e => {
      const id = e.target.dataset.cartQty; if (!id || !cart.has(id)) return;
      const quantity = Number(e.target.value);
      if (!Number.isSafeInteger(quantity) || quantity < 1) { message.textContent = "Ilość musi być dodatnią liczbą całkowitą."; refresh(); return; }
      cart.get(id).quantity = quantity; message.textContent = ""; refresh();
    });
    section.querySelector("#clearClientOrder").addEventListener("click", () => { cart.clear(); message.textContent = "Wyczyszczono produkty zamówienia."; refresh(); });
    form.addEventListener("submit", e => {
      e.preventDefault(); if (!available || !cart.size || !form.reportValidity()) return;
      try {
        if (!window.XLSX) throw new Error("Biblioteka Excel nie jest dostępna. Odśwież panel.");
        const items = [...cart.values()].map(item => {
          const product = find(item.id);
          if (!product || item.quantity > stockOf(product)) throw new Error("Stan magazynowy zmienił się. Popraw ilości w zamówieniu.");
          return {product,quantity:item.quantity};
        });
        const details = Object.fromEntries(new FormData(form));
        for (const key of Object.keys(details)) details[key] = details[key].trim();
        if (!details.recipientName || !details.recipientAddress) throw new Error("Uzupełnij firmę i adres wysyłki.");
        const signature = JSON.stringify({details,items:items.map(({product,quantity})=>({id:product.id,quantity}))});
        if (signature !== lastSignature) { orderId = crypto.randomUUID(); lastSignature = signature; }
        const instruction = `Wyślij ten plik do ${contactName}${contactEmail ? ` (${contactEmail})` : ""}.`;
        const rows = [
          ["Zamówienie klienta InnoAim"], ["Format", "INNOAIM_CLIENT_ORDER_V1"],
          ["Identyfikator zamówienia", orderId], ["Data", new Date().toISOString()],
          ["Firma / odbiorca", details.recipientName], ["Adres wysyłki", details.recipientAddress],
          ["Osoba kontaktowa", details.contactPerson], ["Telefon", details.phoneNumber],
          ["E-mail klienta", details.clientEmail], ["Uwagi", details.notes],
          ["Instrukcja", instruction], [],
          ["Nr magazynowy", "ID produktu", "Nazwa produktu", "Rodzaj maszyny", "Producent części", "Ilość"],
          ...items.map(({product,quantity})=>[numberOf(product),product.id,product.name,product.machine_type||"",product.manufacturer||"",quantity])
        ];
        const sheet = window.XLSX.utils.aoa_to_sheet(rows);
        sheet['!cols']=[{wch:17},{wch:39},{wch:58},{wch:28},{wch:28},{wch:12}];
        sheet['!merges']=[{s:{r:0,c:0},e:{r:0,c:5}},...Array.from({length:10},(_,i)=>({s:{r:i+1,c:1},e:{r:i+1,c:5}}))];
        sheet['!rows']=[{hpt:28},...Array.from({length:11},(_,i)=>({hpt:i===4||i===8?42:24})),{hpt:30}];
        sheet['!autofilter']={ref:`A13:F${rows.length}`};
        for(const key of Object.keys(sheet)) {
          if(key.startsWith('!'))continue;
          const cell=sheet[key];
          cell.s={font:{name:"Arial",sz:11},alignment:{vertical:"top",wrapText:true}};
          if(/^[A-F]13$/.test(key)||key==='A1')cell.s={font:{name:"Arial",sz:key==='A1'?16:11,bold:true,color:{rgb:"FFFFFF"}},fill:{patternType:"solid",fgColor:{rgb:"263F2D"}},alignment:{vertical:"center",wrapText:true}};
        }
        const book=window.XLSX.utils.book_new();window.XLSX.utils.book_append_sheet(book,sheet,"Zamówienie");
        const output=window.XLSX.write(book,{bookType:"xlsx",type:"array",cellStyles:true});
        const url=URL.createObjectURL(new Blob([output],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}));
        const link=document.createElement('a');link.href=url;link.download=`INNOAIM-zamowienie-${orderId}.xlsx`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
        message.textContent = `Plik został przygotowany. ${instruction} Sam eksport nie rezerwuje ani nie zmniejsza stanu magazynowego.`;
      } catch(error) { message.textContent=error.message; }
    });
    return {
      controls, refresh,
      setAvailable(value) {available=value;refresh();},
      reset() {cart.clear();drafts.clear();form.reset();lastSignature="";orderId="";message.textContent="";if(dialog.open)closePhoto();refresh();}
    };
  }
  return {create};
})();
