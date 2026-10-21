"use strict";
window.InnoAimClientImport = (() => {
  const escape = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm = value => String(value ?? "").trim().replace(/\s+/g," ").toLocaleLowerCase("pl");
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  function parseRows(rows, products) {
    const header = rows.findIndex(row => row.some(v => norm(v)==="nazwa produktu") && row.some(v => ["ilość","ilość sztuk","ilość do zamówienia"].includes(norm(v))));
    if(header<0)throw new Error("Nie znaleziono tabeli zamówienia. Użyj Excela z panelu klienta.");
    const column = names => rows[header].findIndex(v=>names.includes(norm(v)));
    const idCol=column(["id produktu"]),nameCol=column(["nazwa produktu"]),qtyCol=column(["ilość","ilość sztuk","ilość do zamówienia"]),machineCol=column(["rodzaj maszyny"]),makerCol=column(["producent części"]);
    const meta = names => {const row=rows.slice(0,header).find(r=>names.includes(norm(r[0])));return String(row?.[1]??"").trim();};
    const items=new Map(),issues=[];
    rows.slice(header+1).forEach((row,i)=>{
      const name=String(row[nameCol]??"").trim(),id=idCol>=0?String(row[idCol]??"").trim():"";
      if(!name&&!id&&String(row[qtyCol]??"").trim()==="")return;
      if(!id&&["razem","suma","łącznie"].includes(norm(name)))return;
      const quantity=Number(String(row[qtyCol]??"").replace(/\s/g,"").replace(",","."));
      if(!Number.isSafeInteger(quantity)||quantity<1){issues.push(`Wiersz ${header+i+2}: nieprawidłowa ilość dla „${name||id}”.`);return;}
      let product;
      if(id){
        if(!uuidPattern.test(id)){issues.push(`Nieprawidłowe ID produktu: ${name||id}.`);return;}
        product=products.find(p=>p.id.toLowerCase()===id.toLowerCase());
      }else{
        const machine=machineCol>=0?norm(row[machineCol]):"",maker=makerCol>=0?norm(row[makerCol]):"";
        const matches=products.filter(p=>norm(p.name)===norm(name)&&(!machine||norm(p.machineType)===machine)&&(!maker||norm(p.manufacturer)===maker));
        if(matches.length>1){issues.push(`Niejednoznaczna nazwa „${name}”. Potrzebny plik z ID produktu.`);return;}
        product=matches[0];
      }
      if(!product){issues.push(`Nie znaleziono produktu: ${name||id}.`);return;}
      const total=(items.get(product.id)?.quantity||0)+quantity;
      if(!Number.isSafeInteger(total)){issues.push(`Zbyt duża ilość: ${name}.`);return;}
      items.set(product.id,{productId:product.id,name:product.name,quantity:total,stock:Number(product.stock)||0});
    });
    if(!items.size&&!issues.length)throw new Error("Zamówienie nie zawiera żadnych pozycji.");
    if(items.size>400)throw new Error("Zamówienie przekracza 400 pozycji.");
    return {
      orderId:meta(["identyfikator zamówienia"]),orderTitle:String(rows[0]?.[0]||"Zamówienie klienta").slice(0,200),
      recipientName:meta(["firma / odbiorca","nazwa odbiorcy","firma"]),recipientAddress:meta(["adres wysyłki","adres odbiorcy"]),
      contactPerson:meta(["osoba kontaktowa"]),phoneNumber:meta(["telefon","nr telefonu"]),clientEmail:meta(["e-mail klienta"]),notes:meta(["uwagi"]),
      items:[...items.values()].sort((a,b)=>a.productId.localeCompare(b.productId)),issues
    };
  }
  async function open(file, context) {
    if(!context.getUser()||!context.getClient())throw new Error("Zaloguj administratora do chmury przed realizacją zamówienia.");
    if(!window.XLSX)throw new Error("Nie załadowano biblioteki Excel.");
    if(file.size>5*1024*1024)throw new Error("Plik zamówienia jest zbyt duży (maks. 5 MB).");
    const userId=context.getUser().id;
    const bytes=await file.arrayBuffer();
    const book=window.XLSX.read(bytes,{type:"array",cellFormula:true});
    const sheet=book.Sheets[book.SheetNames[0]];
    if(!sheet)throw new Error("Plik nie zawiera arkusza.");
    const bounds=window.XLSX.utils.decode_range(sheet['!ref']||'A1');
    if(bounds.e.r>1000||bounds.e.c>30)throw new Error("Arkusz zamówienia ma zbyt wiele wierszy lub kolumn.");
    for(const [key,cell] of Object.entries(sheet))if(!key.startsWith('!')&&cell.f)throw new Error("Plik zamówienia zawiera formuły. Zapisz dane jako wartości i wgraj ponownie.");
    const order=parseRows(window.XLSX.utils.sheet_to_json(sheet,{header:1,defval:""}),context.getProducts());
    if(!order.orderId){
      const hash=await crypto.subtle.digest('SHA-256',bytes);
      order.orderId='legacy-'+Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');
    }
    if(!/^[a-zA-Z0-9:_-]{8,100}$/.test(order.orderId))throw new Error("Nieprawidłowy identyfikator zamówienia w pliku.");
    const stockIssues=order.items.filter(i=>i.quantity>i.stock).map(i=>`${i.name}: zamówiono ${i.quantity}, obecnie ${i.stock} szt.`);
    const allIssues=[...order.issues,...stockIssues];
    const dialog=document.createElement('dialog');dialog.className='client-import-dialog';
    const now=new Date(),date=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    dialog.innerHTML=`<div class="import-heading"><div><h2>Realizacja zamówienia klienta</h2><p>Sprawdź produkty i dane wysyłki. Stan zmieni się dopiero po zatwierdzeniu.</p></div><button type="button" class="secondary-button import-close" aria-label="Zamknij import">×</button></div><p class="import-id">ID: ${escape(order.orderId)}</p><div class="import-table-wrap"><table><thead><tr><th>Produkt</th><th>Zamówiono</th><th>Na stanie</th><th>Po realizacji</th></tr></thead><tbody>${order.items.map(i=>`<tr><td>${escape(i.name)}</td><td>${i.quantity}</td><td>${i.stock}</td><td class="${i.stock<i.quantity?'import-error':''}">${i.stock-i.quantity}</td></tr>`).join('')}</tbody></table></div>${allIssues.length?`<div class="import-error"><strong>Realizacja zablokowana:</strong><ul>${allIssues.map(i=>`<li>${escape(i)}</li>`).join('')}</ul></div>`:''}<form><div class="import-fields"><label>Nazwa odbiorcy<input name="recipientName" maxlength="200" required value="${escape(order.recipientName)}"></label><label>Data wysyłki<input name="shippingDate" type="date" required value="${date}" max="${date}"></label><label class="wide">Adres wysyłki<textarea name="recipientAddress" maxlength="1000" rows="3" required>${escape(order.recipientAddress)}</textarea></label><label>Osoba kontaktowa<input name="contactPerson" maxlength="200" value="${escape(order.contactPerson)}"></label><label>Telefon<input name="phoneNumber" maxlength="80" value="${escape(order.phoneNumber)}"></label><label class="wide">E-mail klienta<input name="clientEmail" type="email" maxlength="254" value="${escape(order.clientEmail)}"></label><label class="wide">Uwagi<textarea name="notes" maxlength="2000" rows="2">${escape(order.notes)}</textarea></label></div><p>Po zatwierdzeniu odejmiemy <strong>${order.items.reduce((s,i)=>s+i.quantity,0)} szt.</strong> i zapiszemy wysyłkę w statystykach. Wszystkie pozycje zapiszą się razem. Ponowny import tego samego ID nie odejmie sztuk ponownie.</p><div class="import-actions"><button type="button" class="secondary-button import-cancel">Anuluj</button><button type="submit" class="primary-button" ${allIssues.length?'disabled':''}>Zatwierdź wysyłkę i odejmij sztuki</button></div><p class="import-status" role="status" aria-live="polite"></p></form>`;
    document.body.append(dialog);dialog.showModal();
    let busy=false;
    return new Promise(resolve=>{
      const close=result=>{if(busy)return;dialog.close();dialog.remove();resolve(result);};
      dialog.querySelector('.import-close').addEventListener('click',()=>close(false));
      dialog.querySelector('.import-cancel').addEventListener('click',()=>close(false));
      dialog.addEventListener('cancel',e=>{e.preventDefault();close(false);});
      dialog.querySelector('form').addEventListener('submit',async e=>{
        e.preventDefault();if(busy||allIssues.length)return;
        const form=e.currentTarget;if(!form.reportValidity())return;
        const details=Object.fromEntries(new FormData(form));for(const k of Object.keys(details))details[k]=details[k].trim();
        const status=dialog.querySelector('.import-status');
        if(!details.recipientName||!details.recipientAddress){status.textContent='Uzupełnij odbiorcę i adres wysyłki.';return;}
        if(context.getUser()?.id!==userId){status.textContent='Konto administratora zmieniło się. Zamknij okno i wczytaj plik ponownie.';return;}
        busy=true;for(const b of dialog.querySelectorAll('button'))b.disabled=true;
        status.textContent='Zapisywanie zamówienia w chmurze…';
        try{
          const payload={orderId:order.orderId,orderTitle:order.orderTitle,...details,
            shippedAt:new Date(details.shippingDate+'T12:00:00').toISOString(),
            items:order.items.map(i=>({productId:i.productId,quantity:i.quantity}))};
          const {data,error}=await context.getClient().rpc('fulfill_client_order',{order_payload:payload});
          if(error)throw error;
          try {await context.onCommitted(data);}catch{window.alert('Zamówienie zapisano w bazie. Odśwież magazyn, aby pobrać aktualne dane. Nie realizuj ponownie jako nowego zamówienia.');}
          if(data.alreadyProcessed)window.alert('To zamówienie zostało już zrealizowane. Sztuki nie zostały odjęte ponownie.');
          busy=false;close(data);
        }catch(error){
          status.textContent=error.code==='PGRST202'?'Brakuje funkcji realizacji zamówienia. Uruchom plik 1-SUPABASE-ZAMOWIENIA.sql w Supabase.':`Nie zapisano zamówienia: ${error.message||'błąd połączenia'}. Możesz ponowić tę samą operację — identyfikator chroni przed podwójnym odjęciem.`;
          busy=false;for(const b of dialog.querySelectorAll('button'))b.disabled=false;
        }
      });
    });
  }
  return {open,parseRows};
})();
