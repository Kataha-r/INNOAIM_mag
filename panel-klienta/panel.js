"use strict";
const SUPABASE_URL = "https://amvgmfvjidukphbbblms.supabase.co";
const SUPABASE_KEY = "sb_publishable_GmzJPNZa8Ut8njNuJr7s6A_oYlEk-q_";
const $ = (id) => document.getElementById(id);
let api, sessionUser = null, products = [], loading = false, generation = 0, reloadPending = false;
let orderUI = null;
const BACKUP_PRODUCT_ORDER = Object.freeze({"81b2a118-4d5f-44fa-b8e3-ceb84f1d5287":1,"eea275c7-9d6c-486b-823b-c12afb407e50":2,"a8172203-ab9d-46b7-8887-7d50db861633":3,"70db3ace-3ca0-4758-8c36-c3a68718e999":4,"cb349fb0-15c6-47cc-8479-9a26383da886":5,"38b252da-5ba2-47db-91da-7447e0fe5be9":6,"73f8d911-c097-4ec8-bb9f-0a2a8746ce1d":7,"77f70ab3-d8ac-4d87-9eb3-7519afc15c6f":8,"c8c652fe-7103-478c-be5e-9ea2213d58a3":9,"7b12bf99-c83c-4c55-8ed5-8d190c77f651":10,"603a9bc4-57d1-4e7f-9012-369787902aab":11,"5684b730-8108-491c-8aa5-cef016e65d30":12,"dd46908b-9582-4feb-b6d9-ab40a65d7841":13,"41b4372f-8a98-4ce8-9fbb-de3e0c5ec6f0":14,"7a14bce4-6778-404d-9199-217bd01722ad":15,"0a1cf6ad-8f65-4374-afb4-129fe072d20e":16,"54855b63-2d42-4a34-9d74-9274792918ee":17,"ea5b22f9-7f42-4d9a-adaa-41a66e6b3c30":18,"422b3589-c764-4660-88cd-08d5af8b1454":19,"375732ff-eb37-4597-a828-d3417bb6f0f9":20,"2fa2cc75-06fb-40e7-9aa6-e64106bfab77":21,"f8cf357a-d5be-4da0-93c9-18fd894240e3":22,"a4b7d1b9-40f3-4765-bd0a-9ca08e67acc2":23,"092d77c1-2605-4b45-a45f-910b43ce2408":24,"f6921147-871e-4af5-a30a-d610811525f3":25,"eb5f7cce-3f5a-4144-8600-3b8b22d37d2c":26,"f5bf5e80-2853-4446-ab44-a2f5904b147c":27,"fe80cd43-1c75-467c-bdf8-19e0cf4e8190":28,"c9846fee-6130-407d-93ac-7cfcefd0a71b":29,"eaece59c-65e7-469c-9074-1e054ccaa635":30,"ad5590d7-c741-4007-af9a-6c804313afe5":31,"18a8dcac-38c5-4b4a-a3f9-ae73428b2125":32,"c2a1d4e4-0b13-488c-9d76-7fc4dd793982":33,"ba4bfe01-53da-4e6b-8fd5-56f44fad8f71":34,"14287ccd-5984-4a25-94b7-f537811c359f":35,"3d35fc4f-fc9a-4d6f-bf1d-9adf8efffc5c":36,"30000ffd-5139-4866-80f5-5a69517613a5":37,"de691501-b955-48bf-aa5c-1e0f26aa43b8":38,"622e6a82-adb5-4f44-a211-4b1cd7ef0ca8":39,"9ae91da5-8d5c-4887-ae74-19ae1950dce1":40,"9ae77983-94e3-4422-a18d-c07f67adb2ae":41,"f4100b33-40a6-42d4-9aed-e7ec39422405":42,"eb3e9cb8-8982-414b-a997-b4833606b3d8":43,"70b1d4e0-8668-49e7-ace7-ac41be6ed7c5":44,"e36445a4-eef7-4edd-819b-63256d7487ba":45,"5e37981a-da6c-4f13-86cf-9907e8595034":46,"bbf8f563-60e9-42f2-b563-11937796458a":47,"1f72fd79-f421-4b67-9b08-a409188a908b":48,"f916be10-8862-4b8f-8895-adfe3ededd53":49,"5b118650-9759-41c8-8b25-871aad5997cc":50,"0b7d7ac8-bbda-473e-9d2f-a7ebb16aa55a":51,"8c14c1df-bbab-4909-b74e-8c7b79084031":52,"da18313e-f5cf-4ce5-83cc-f8a44bb05830":53,"3d295e43-4996-4b13-9964-ee39ca3f5aa8":54,"a28c6bbf-198b-4b30-b0c8-e23e6d4a0242":55,"f5c75656-b72b-4f83-b2b9-53488b8eeeae":56,"327c8d2d-0b84-4e49-95d3-69f9fdf0c753":57,"c6f8b5b4-4941-4ba7-8bb4-23c4c2f012a9":58,"da72ecc0-8b62-49aa-859b-0cf9e368dc0a":59,"1deb83e8-7d4f-4ac9-a19a-42531516bd00":60,"c4cd2f50-ba65-41ef-9f5b-03f021decfb0":61,"e10f8ecf-7317-4c98-9a8e-a48138c1054e":62,"75754e68-8ced-4185-9d36-2ba86c6c9436":63,"061f20ee-f227-4908-91fa-69b2ded62538":64,"3e03e314-6942-4af7-b105-29e03d38a3bc":65,"ae45599b-214c-422e-8dfc-b1071a7a8c1a":66,"d55ff82c-e6c4-4e17-aaf6-600787b9318b":67,"0f49a51f-5176-4349-9b66-90ab03d437b0":68,"105ba9fb-55a8-496e-80df-7c1e23c153eb":69,"4f44e92d-d0bc-49b4-ab13-3477839259b7":70,"a5a48efa-f936-4e6f-9966-7c994c32c02a":71,"521ef71b-eabe-4b0f-83a5-a6fa1155e154":72,"739e268b-3b92-42a1-96b7-a5ce28a6e88f":73,"1644e51f-b7f6-4a55-aa09-9c98334e03ef":74,"97d60a74-c851-4d76-9e80-2499b513b74e":75,"f015eb63-3f59-4afb-aab4-42fe0975b811":76,"35081246-0e5b-4c8c-ae79-2a8591369b64":77,"8e37aa51-cebb-4d05-9aac-be4e6c3e13cb":78,"bb0045e0-f4ab-4f48-837f-338c544299cd":79,"6a95b6f4-b821-4059-9f83-b7df898240d9":80,"465f84e8-78e9-44fb-bf01-3632e180fd06":81,"7fe54be4-9e80-4e51-a5f0-cd6e7da03cbc":82,"55e2ac9b-5f4a-4ccd-884f-6dd596566f49":83,"08578113-a58c-4a7f-9d2f-efe8f0b5bb86":84,"953e148b-a160-49cb-b733-997bcca362cf":85,"67af32d3-1f67-4624-97d6-936f17062e26":86,"ec1e4446-effa-4d51-b541-f91d6ef193f3":87,"4abacd41-d782-4b19-9c86-9ceadf57bb60":88,"b250c7e4-1d2e-4a70-b0ad-3d957f187797":89,"6ffdd507-cb7c-472f-bcae-f563d761eacb":90,"a1069d39-6c17-4b7d-a50a-96bafb3df7ff":91,"89b01f93-e503-4574-b5a2-54f3c8956a8f":92,"9b85f3d8-c14c-455f-9c66-31a3984d79f0":93,"7f2d938b-ec9e-47a5-b9c5-6efe430932fb":94,"ee916735-8aa4-4a30-8a93-3e0e894a1baa":95,"54931486-a6bf-40d5-b1ce-94af50f06fd5":96,"1aaff693-5ae7-4b21-b444-a7a0d59b4f46":97,"1cd4c1c8-b165-49e6-af67-f2fd12c37353":98,"e8918e48-0792-4207-b729-2275ea2c6850":99,"8255df4a-283d-46d7-852c-d787cc8ab9ea":100,"3a1fbf72-4d74-478b-909e-b3785e8c18cd":101,"9339d94d-a249-437c-a783-b83f2df46f03":102,"c26c31ef-fa1b-492b-8b20-acca15a6eb36":103,"0fd3ba61-f6a0-4e02-b893-c2cce705f757":104,"5bba9e8d-e99d-43a2-aa8c-c29e3f6243ad":105,"d4a778c1-9eb5-4812-b221-78464c26d3e8":106,"4a759552-22c7-49e1-9b02-254c86e6091f":107,"8105eb73-4e58-4f08-9abe-8fd729e196b1":108,"a9bbc0a1-b213-4e70-b533-432d66e586ff":109,"1e1921cf-257c-4083-a12b-566fc6ec0d96":110,"9bafba21-d41e-4242-b1b9-da9ce0814af4":111,"97dc59ce-4980-49ea-9767-04d743e65371":112,"b36c82a8-c1f1-4462-adbb-0650d300c0ce":113,"24c944cb-a3a8-4d92-8985-b91cbeaca49c":114,"c9955470-47aa-490a-a9a2-130530e7d3cf":115,"811d67e7-d44d-49da-8945-a19f1b429bc0":116,"5e1ac5e7-1b5b-4be4-8ac8-126b2f4e1238":117,"296defd8-c526-49e7-bc6d-73d232a0df76":118,"2ad238c1-4e56-411a-a10d-d6984a253450":119,"eece2bcf-cb65-4855-9fed-621c420b17cc":120,"79aa9eca-60c7-4516-b758-eba3fcffc5aa":121,"54ddf070-fcc3-4349-8675-db140223c4d1":122,"7bfe8fe6-505f-4ece-bad2-58d8e333d36f":123,"6cba8146-bcb6-4787-9ccf-1126c184a590":124,"11ff1fe2-675a-4a37-8888-378e343e62c7":125,"0e4499ed-9131-49df-a7c2-3d9f8ffb33f4":126,"b913b809-49d7-4186-b33e-306f9879ad00":127,"77034b1a-7c9f-43a5-a034-7708859422f7":128,"8c512f09-87f2-43b3-9832-358e2b3393e8":129,"531bd03a-8071-4558-ae4d-f28786a7e575":130,"8e11854e-b415-4002-a40e-4a2cb8035cb4":131,"3c7fd709-812b-4705-9546-961a037c06b7":132,"9f73b989-cf2e-4718-88c5-0c5052e2b7ad":133,"e86a2e7b-3529-4ad0-a4a1-a647717c4dc9":134,"b6786d8d-5236-431f-9010-9bcfe58a5636":135,"284d0da4-86a4-4097-9099-265b48249e86":136,"3ccf12a8-946c-48fc-befd-58133898e371":137,"3950b2a2-f9f0-481b-bd30-a44685fc07e3":138,"188e67ef-958b-414d-9960-495904545388":139,"77a356d6-4392-4796-953d-4cf4e23332e6":140,"ea32d7f0-000d-484f-a2f4-759d2b36b2fa":141,"32f82daf-0ede-4887-89fb-dcf0f1aa523f":142,"0a943526-936a-44fa-a300-c1ae6c5f4f2b":143,"3522a9b0-ac2a-4244-ae6b-1abf351321e3":144,"f6a12989-bd6c-4782-be06-4b7b93036c3e":145,"b45cf808-297c-41fa-8e9a-77b4e6244e14":146,"7ce3e216-7973-4b6e-9ffc-276027212cde":147,"3129dda1-94d1-4314-bf3b-9382a4a716f7":148,"45b9b646-8688-4f60-a69b-eb5d3d702645":149,"ffaed648-6da7-4121-84a9-3c1e9c0b810d":150,"7250bad5-748b-4f10-ac7b-eded3159a19e":151,"71b1df37-9a1e-4894-83bd-5c1254ea30f2":152,"4437bb0a-cbe6-4c25-99df-1951c642cb45":153,"2a19b5ec-83b8-4779-b504-9d3166b07ab1":154,"bfdebe09-9d39-4612-885e-715590ee65ee":155,"041b4dc2-03dc-4db1-ab43-0ef8db664383":156,"fcf17fb4-ece0-4b9c-a8da-40eae39a0d1a":157,"a4cf4a25-e481-4c15-88bc-d960f879c2f5":158,"6a4ec7c7-4d4a-426d-aeee-607f286cf714":159,"8506e894-ebb7-4e01-9a88-7c8c89084878":160,"1b635e1f-c995-4189-a57a-7c80e2e12cb5":161,"358352f7-9d55-4839-b96a-bedbefa33517":162,"dc9511b3-c839-4ea4-8db3-6c3305b07276":163,"a966b74f-76e0-4e95-a763-871e4521e350":164,"0dd52130-4c96-4f07-8be7-68347329f96c":165,"7c0aa3c4-58cf-4eac-9f24-baf25ff97031":166,"e3164956-c2c3-4328-8fa2-823b5c9158a4":167,"a22967b7-e551-46d3-ad94-c337254f3d06":168,"acc8be53-e5bc-4065-9a9c-3b991a7edffe":169,"c01ef4aa-c0ce-4506-8a37-738360ede7e8":170,"17d8da2f-64a3-4af4-9dc0-9341a8d5ae77":171,"028dcff5-0c11-4d6f-8fd9-f67aa9bd574b":172,"20ed201d-e3b5-4f20-9820-0a88a2973b23":173,"9ce1d484-f3dc-4669-9fe8-6af2d1ab2157":174,"5fbedadf-1331-4e7e-80c9-14861939fa2b":175,"051da7d3-fd55-47a7-b1b3-ed08ed632a20":176,"e91ec582-31cb-480f-813c-54881e76bd70":177,"5d2f4ce8-a8b3-4697-8387-34f8095ae6cf":178,"23a5aa9b-48b2-436a-b8f4-a64cdf401dbb":179,"4ead4dcf-4f66-435a-a06c-56a97376889b":180,"07939eb5-88a9-488e-b862-378c26b1df02":181,"600b9182-7c0f-49c3-942a-6a19924d0fa4":182,"45871fb9-2dec-4d34-a31b-868ce8dca87f":183,"721a4593-8e5a-43fd-9e47-cd564475651c":184,"2b9af5fd-e790-4c44-9b9a-fb66c8c3f37d":185,"11ceb20f-a2ec-4626-af29-ed3b887278b2":186,"b313b611-34d4-4029-9e7b-1d141ff893e0":187,"23cee519-8ce3-466e-9efe-2da6e665fc30":188,"ddbc10fe-69b7-4805-bd64-d1195aeb9973":189,"cedc6d73-4499-42ec-a1b0-9b7be7485e55":190,"98c2c1e2-27d9-46aa-8eca-ada4e5631bdd":191,"9140f3ec-d892-432b-935c-eccbc4b9d4ac":192,"12156700-ee25-491a-ab97-db7c67ce4555":193,"0dcb9c69-c557-46bc-91ec-5df92cba5877":194,"589c116a-13a2-4c44-b2f6-84997e09dc2d":195,"e64a0d1d-37bd-470c-ba2b-62a37368629f":196,"7a57c355-b30a-47d1-96bf-e937156a302d":197,"5187b7b0-082c-4a46-8743-9655556c2c01":198,"a49429da-941b-4046-9f4a-ebf6c9562f8d":199,"e5485979-d0da-4df4-b3fe-4d0910494b9c":200,"b5d7c038-bc5a-46f6-9aea-786a300debaf":201,"665b6a1a-ed7d-41b3-84c5-db32282b131f":202,"c4021556-41ca-42ff-a026-ca727570d25f":203,"fef26423-6fc4-4604-9f8d-022a939dc7a7":204,"7357fa12-7cb6-420d-b495-f5135e2d6d7d":205,"064ce772-928d-4a3f-a676-cea483673500":206,"94c3c29c-a814-4635-a376-ac3a1db05190":207,"c528c8cd-f438-443e-b452-f8626829e373":208,"9ac550c5-4c81-4399-a614-c6db4bc653c2":209,"cf3c7bde-91fd-4d14-876d-2c30455efce8":210,"ab6ffc53-b3c5-4afa-ad0c-c7b4482181a7":211,"f10618df-307a-4ccb-8c79-029d5ddfa2a4":212,"6b15b7cd-d057-48ce-883e-cc505b4870d4":213,"4fa9e5b3-75b8-4485-ac36-460db8e5f22b":214,"23add89f-bdd2-49c3-ade0-2a2abb29cbd1":215,"e7e0dedf-58a7-44b9-bff2-1d8f9b856102":216,"9fdb8a29-8ba0-46f8-9c34-6ded098617fb":217,"5e615451-4b9a-4d7b-9802-740e80e4697c":218,"37a8143c-b262-4765-9231-0004de0b2eaf":219,"210dddd7-d691-4406-8742-8368352235cd":220,"d93d0c66-d85d-4c55-9d10-3759da20f145":221,"ed2f4595-c986-4735-aaa0-93ea20892ca5":222,"ead3aa39-b09d-4b68-a5a0-20f952341654":223,"1f7fc8ae-f7dd-4153-9ada-4e027f6dbb32":224,"db2ba0c5-1d27-4675-8b30-d37490567dff":225,"2fc1927c-8111-4709-9187-eb79d37df7a1":226,"35c69435-9b0f-4fe5-adc0-2026474725a5":227,"3f7e18c0-4478-458d-b681-49e0ce8b1dd2":228,"4c1f07e0-a231-450a-a061-a9f68b92a2fc":229,"f1a95927-3894-435d-b20d-1b6bd972dbcc":230,"0f4faf78-5fdf-4ae0-b398-3115afc3e361":231,"e8136938-804d-46a4-815d-03d5947bb67b":232,"b41aa3e7-8354-4a80-971e-440e4edb3f9a":233,"24a3e1ce-0cfd-476a-a0f5-9d3798b4a469":234,"c790e981-aaf8-4899-8120-e5f452cd2e0f":235,"02f456fb-76a0-49fe-8fd8-fb11f71e2a1e":236,"33c84d12-8817-4431-a16f-e05742cf8972":237,"cc22c2ad-4a44-4c79-9b39-7b72242c930d":238,"44e80848-85ab-44ed-a460-afc48beade20":239,"54994edc-e09f-4490-96d7-716c4cf8c1fa":240,"65c97cd8-c209-4ad7-8532-99f45ce3e355":241,"d10c3b55-5dde-4707-833f-6fb947f0fc3f":242,"efb35e05-2f35-43fc-abfb-e1b7c8b56938":243,"18cd705b-05b8-4c8f-8b03-495f4f5bf853":244,"963f8be5-62e2-4bed-87a4-ea45639a745a":245,"c92b1e1e-5a13-497c-89aa-be32f56deeba":246,"cca0d2e5-6b8f-4785-9764-5c5f645b9fdb":247,"9fa0a794-440b-4835-a058-e4cd77f03d9f":248,"05ee87f8-2723-4fef-af00-ebd0721a7cac":249,"fd743d6d-71de-4188-a814-cb65565719b9":250,"3821708e-a0cd-4f1d-af55-1b929e0e639b":251,"f9ef79d4-67bc-42ca-bc10-7b45921d2e71":252,"a9f8bb12-146b-48bc-89b5-96d29fbc6d2a":253,"bbbcaae6-36d0-47e9-bcc1-655602c473b4":254,"9d54c521-2dee-46d5-bb16-7c076a7a70d0":255,"126dc5e7-5f7e-476b-8206-d554cd9e37a6":256,"8638c2b4-8095-4195-9e0c-846aff5d31f2":257,"b1bb495c-02e4-4ad2-ae8b-3ce13f976787":258,"29e7b558-f29f-4918-988e-548c08d55cad":259,"f542e925-67a9-4df0-a2a3-1338d445dab0":260,"6c2a9a0b-4b57-4d50-87e5-2169a3537a46":261,"06f89a7c-90eb-46bc-8806-7d944c91a12f":262,"87ca10bd-9140-4d03-8cca-80b713dc4592":263,"d0ed8d9e-e190-4380-b2ea-62f4c9cad858":264,"12ec1081-a8d7-4827-9632-3749a358b4fe":265,"cfff32f1-1bc9-4106-9c8b-17a7de556c1c":266,"5f3485a3-e0ce-4876-b657-69f26442bbf1":267,"e8d0cbcf-df9a-4dc2-8f99-009218987cc5":268,"889b03db-4be6-45e8-8b2d-092f76beec8f":269,"ffb799ce-82ae-4670-9471-7fb6c07617aa":270,"6f322a25-6c27-44a0-80c2-b4b64ec1b059":271,"b078e5cf-a020-4026-90f9-27fa02c93f05":272});
function sortClientProducts(items) {
  // Nie używaj kolejności alfabetycznej zwracanej przez starszą funkcję RPC.
  // Produkty spoza kopii zachowują kolejność nadaną przez bazę.
  return [...items].sort((a,b) =>
    (BACKUP_PRODUCT_ORDER[a.id] || Number.MAX_SAFE_INTEGER)
    - (BACKUP_PRODUCT_ORDER[b.id] || Number.MAX_SAFE_INTEGER));
}
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
    return `<article class="product" role="listitem"><button class="zoom-photo" type="button" data-photo="${escapeHtml(p.id)}" aria-label="Powiększ zdjęcie: ${escapeHtml(p.name)}"><img src="${escapeHtml(photo)}" alt="" loading="lazy" referrerpolicy="no-referrer"><span aria-hidden="true">⌕</span></button><div class="product-info"><h3>${escapeHtml(p.name)}</h3><div class="metadata">${[p.category,p.manufacturer,p.machine_type].filter(Boolean).map(escapeHtml).join(" · ")}</div>${p.description ? `<p class="description">${escapeHtml(p.description)}</p>` : ""}</div><div class="stock ${stock === 0 ? "zero" : ""}"><span class="sr-only">Stan magazynowy:</span><strong>${stock.toLocaleString("pl-PL")} <small>szt.</small></strong>${stock === 0 ? '<span class="zero-label">Brak na stanie</span>' : ""}</div>${orderUI ? orderUI.controls(p) : ""}</article>`;
  }).join("") : `<div class="empty">${products.length ? "Brak produktów pasujących do wyszukiwania." : "Magazyn nie zawiera jeszcze produktów."}</div>`;
  $("products").querySelectorAll("img").forEach((img) => img.addEventListener("error", () => { img.src = "product-placeholder.svg"; }, {once:true}));
}
function clearCatalog() {
  orderUI?.setAvailable(false);
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
  products = sortClientProducts(nextProducts);
  const selected = $("category").value;
  $("category").innerHTML = '<option value="">Wszystkie kategorie</option>' + [...new Set(products.map((p) => p.category).filter(Boolean))].sort((a,b) => a.localeCompare(b,"pl")).map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  $("category").value = selected;
  if (!$("category").value) $("category").value = "";
  $("loginCard").hidden = true;
  $("accessCard").hidden = true;
  $("catalog").hidden = false;
  $("account").textContent = sessionUser.email;
  render();
  orderUI?.setAvailable(complete);
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
  if (user?.id !== sessionUser?.id) { orderUI?.reset(); clearCatalog(); }
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
  orderUI?.reset();
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
orderUI = window.InnoAimClientOrders?.create({getProducts:()=>products,getUser:()=>sessionUser,imageUrl}) || null;
initialize();
