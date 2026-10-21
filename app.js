const STORAGE_KEY = "stockly-products-v2";
const LAST_DELETED_KEY = "stockly-last-deleted-product";
const ORDER_NUMBER_KEY = "stockly-order-number";
const ORDER_STATE_KEY = "stockly-order-state-v2";
const ORDER_RECIPIENT_KEY = "stockly-order-recipient";
const CLIENT_CODES_KEY = "stockly-client-access-codes";
const CLOUD_PROTECT_KEY = "stockly-cloud-protect-until";
const DEFAULT_IMAGE = "product-placeholder.svg";
const SUPABASE_URL = "https://amvgmfvjidukphbbblms.supabase.co";
const SUPABASE_KEY = "sb_publishable_GmzJPNZa8Ut8njNuJr7s6A_oYlEk-q_";
const PRODUCT_LIMIT = 400;
const BACKUP_WAREHOUSE_NUMBERS = Object.freeze({"81b2a118-4d5f-44fa-b8e3-ceb84f1d5287":1,"eea275c7-9d6c-486b-823b-c12afb407e50":2,"a8172203-ab9d-46b7-8887-7d50db861633":3,"70db3ace-3ca0-4758-8c36-c3a68718e999":4,"cb349fb0-15c6-47cc-8479-9a26383da886":5,"38b252da-5ba2-47db-91da-7447e0fe5be9":6,"73f8d911-c097-4ec8-bb9f-0a2a8746ce1d":7,"77f70ab3-d8ac-4d87-9eb3-7519afc15c6f":8,"c8c652fe-7103-478c-be5e-9ea2213d58a3":9,"7b12bf99-c83c-4c55-8ed5-8d190c77f651":10,"603a9bc4-57d1-4e7f-9012-369787902aab":11,"5684b730-8108-491c-8aa5-cef016e65d30":12,"dd46908b-9582-4feb-b6d9-ab40a65d7841":13,"41b4372f-8a98-4ce8-9fbb-de3e0c5ec6f0":14,"7a14bce4-6778-404d-9199-217bd01722ad":15,"0a1cf6ad-8f65-4374-afb4-129fe072d20e":16,"54855b63-2d42-4a34-9d74-9274792918ee":17,"ea5b22f9-7f42-4d9a-adaa-41a66e6b3c30":18,"422b3589-c764-4660-88cd-08d5af8b1454":19,"375732ff-eb37-4597-a828-d3417bb6f0f9":20,"2fa2cc75-06fb-40e7-9aa6-e64106bfab77":21,"f8cf357a-d5be-4da0-93c9-18fd894240e3":22,"a4b7d1b9-40f3-4765-bd0a-9ca08e67acc2":23,"092d77c1-2605-4b45-a45f-910b43ce2408":24,"f6921147-871e-4af5-a30a-d610811525f3":25,"eb5f7cce-3f5a-4144-8600-3b8b22d37d2c":26,"f5bf5e80-2853-4446-ab44-a2f5904b147c":27,"fe80cd43-1c75-467c-bdf8-19e0cf4e8190":28,"c9846fee-6130-407d-93ac-7cfcefd0a71b":29,"eaece59c-65e7-469c-9074-1e054ccaa635":30,"ad5590d7-c741-4007-af9a-6c804313afe5":31,"18a8dcac-38c5-4b4a-a3f9-ae73428b2125":32,"c2a1d4e4-0b13-488c-9d76-7fc4dd793982":33,"ba4bfe01-53da-4e6b-8fd5-56f44fad8f71":34,"14287ccd-5984-4a25-94b7-f537811c359f":35,"3d35fc4f-fc9a-4d6f-bf1d-9adf8efffc5c":36,"30000ffd-5139-4866-80f5-5a69517613a5":37,"de691501-b955-48bf-aa5c-1e0f26aa43b8":38,"622e6a82-adb5-4f44-a211-4b1cd7ef0ca8":39,"9ae91da5-8d5c-4887-ae74-19ae1950dce1":40,"9ae77983-94e3-4422-a18d-c07f67adb2ae":41,"f4100b33-40a6-42d4-9aed-e7ec39422405":42,"eb3e9cb8-8982-414b-a997-b4833606b3d8":43,"70b1d4e0-8668-49e7-ace7-ac41be6ed7c5":44,"e36445a4-eef7-4edd-819b-63256d7487ba":45,"5e37981a-da6c-4f13-86cf-9907e8595034":46,"bbf8f563-60e9-42f2-b563-11937796458a":47,"1f72fd79-f421-4b67-9b08-a409188a908b":48,"f916be10-8862-4b8f-8895-adfe3ededd53":49,"5b118650-9759-41c8-8b25-871aad5997cc":50,"0b7d7ac8-bbda-473e-9d2f-a7ebb16aa55a":51,"8c14c1df-bbab-4909-b74e-8c7b79084031":52,"da18313e-f5cf-4ce5-83cc-f8a44bb05830":53,"3d295e43-4996-4b13-9964-ee39ca3f5aa8":54,"a28c6bbf-198b-4b30-b0c8-e23e6d4a0242":55,"f5c75656-b72b-4f83-b2b9-53488b8eeeae":56,"327c8d2d-0b84-4e49-95d3-69f9fdf0c753":57,"c6f8b5b4-4941-4ba7-8bb4-23c4c2f012a9":58,"da72ecc0-8b62-49aa-859b-0cf9e368dc0a":59,"1deb83e8-7d4f-4ac9-a19a-42531516bd00":60,"c4cd2f50-ba65-41ef-9f5b-03f021decfb0":61,"e10f8ecf-7317-4c98-9a8e-a48138c1054e":62,"75754e68-8ced-4185-9d36-2ba86c6c9436":63,"061f20ee-f227-4908-91fa-69b2ded62538":64,"3e03e314-6942-4af7-b105-29e03d38a3bc":65,"ae45599b-214c-422e-8dfc-b1071a7a8c1a":66,"d55ff82c-e6c4-4e17-aaf6-600787b9318b":67,"0f49a51f-5176-4349-9b66-90ab03d437b0":68,"105ba9fb-55a8-496e-80df-7c1e23c153eb":69,"4f44e92d-d0bc-49b4-ab13-3477839259b7":70,"a5a48efa-f936-4e6f-9966-7c994c32c02a":71,"521ef71b-eabe-4b0f-83a5-a6fa1155e154":72,"739e268b-3b92-42a1-96b7-a5ce28a6e88f":73,"1644e51f-b7f6-4a55-aa09-9c98334e03ef":74,"97d60a74-c851-4d76-9e80-2499b513b74e":75,"f015eb63-3f59-4afb-aab4-42fe0975b811":76,"35081246-0e5b-4c8c-ae79-2a8591369b64":77,"8e37aa51-cebb-4d05-9aac-be4e6c3e13cb":78,"bb0045e0-f4ab-4f48-837f-338c544299cd":79,"6a95b6f4-b821-4059-9f83-b7df898240d9":80,"465f84e8-78e9-44fb-bf01-3632e180fd06":81,"7fe54be4-9e80-4e51-a5f0-cd6e7da03cbc":82,"55e2ac9b-5f4a-4ccd-884f-6dd596566f49":83,"08578113-a58c-4a7f-9d2f-efe8f0b5bb86":84,"953e148b-a160-49cb-b733-997bcca362cf":85,"67af32d3-1f67-4624-97d6-936f17062e26":86,"ec1e4446-effa-4d51-b541-f91d6ef193f3":87,"4abacd41-d782-4b19-9c86-9ceadf57bb60":88,"b250c7e4-1d2e-4a70-b0ad-3d957f187797":89,"6ffdd507-cb7c-472f-bcae-f563d761eacb":90,"a1069d39-6c17-4b7d-a50a-96bafb3df7ff":91,"89b01f93-e503-4574-b5a2-54f3c8956a8f":92,"9b85f3d8-c14c-455f-9c66-31a3984d79f0":93,"7f2d938b-ec9e-47a5-b9c5-6efe430932fb":94,"ee916735-8aa4-4a30-8a93-3e0e894a1baa":95,"54931486-a6bf-40d5-b1ce-94af50f06fd5":96,"1aaff693-5ae7-4b21-b444-a7a0d59b4f46":97,"1cd4c1c8-b165-49e6-af67-f2fd12c37353":98,"e8918e48-0792-4207-b729-2275ea2c6850":99,"8255df4a-283d-46d7-852c-d787cc8ab9ea":100,"3a1fbf72-4d74-478b-909e-b3785e8c18cd":101,"9339d94d-a249-437c-a783-b83f2df46f03":102,"c26c31ef-fa1b-492b-8b20-acca15a6eb36":103,"0fd3ba61-f6a0-4e02-b893-c2cce705f757":104,"5bba9e8d-e99d-43a2-aa8c-c29e3f6243ad":105,"d4a778c1-9eb5-4812-b221-78464c26d3e8":106,"4a759552-22c7-49e1-9b02-254c86e6091f":107,"8105eb73-4e58-4f08-9abe-8fd729e196b1":108,"a9bbc0a1-b213-4e70-b533-432d66e586ff":109,"1e1921cf-257c-4083-a12b-566fc6ec0d96":110,"9bafba21-d41e-4242-b1b9-da9ce0814af4":111,"97dc59ce-4980-49ea-9767-04d743e65371":112,"b36c82a8-c1f1-4462-adbb-0650d300c0ce":113,"24c944cb-a3a8-4d92-8985-b91cbeaca49c":114,"c9955470-47aa-490a-a9a2-130530e7d3cf":115,"811d67e7-d44d-49da-8945-a19f1b429bc0":116,"5e1ac5e7-1b5b-4be4-8ac8-126b2f4e1238":117,"296defd8-c526-49e7-bc6d-73d232a0df76":118,"2ad238c1-4e56-411a-a10d-d6984a253450":119,"eece2bcf-cb65-4855-9fed-621c420b17cc":120,"79aa9eca-60c7-4516-b758-eba3fcffc5aa":121,"54ddf070-fcc3-4349-8675-db140223c4d1":122,"7bfe8fe6-505f-4ece-bad2-58d8e333d36f":123,"6cba8146-bcb6-4787-9ccf-1126c184a590":124,"11ff1fe2-675a-4a37-8888-378e343e62c7":125,"0e4499ed-9131-49df-a7c2-3d9f8ffb33f4":126,"b913b809-49d7-4186-b33e-306f9879ad00":127,"77034b1a-7c9f-43a5-a034-7708859422f7":128,"8c512f09-87f2-43b3-9832-358e2b3393e8":129,"531bd03a-8071-4558-ae4d-f28786a7e575":130,"8e11854e-b415-4002-a40e-4a2cb8035cb4":131,"3c7fd709-812b-4705-9546-961a037c06b7":132,"9f73b989-cf2e-4718-88c5-0c5052e2b7ad":133,"e86a2e7b-3529-4ad0-a4a1-a647717c4dc9":134,"b6786d8d-5236-431f-9010-9bcfe58a5636":135,"284d0da4-86a4-4097-9099-265b48249e86":136,"3ccf12a8-946c-48fc-befd-58133898e371":137,"3950b2a2-f9f0-481b-bd30-a44685fc07e3":138,"188e67ef-958b-414d-9960-495904545388":139,"77a356d6-4392-4796-953d-4cf4e23332e6":140,"ea32d7f0-000d-484f-a2f4-759d2b36b2fa":141,"32f82daf-0ede-4887-89fb-dcf0f1aa523f":142,"0a943526-936a-44fa-a300-c1ae6c5f4f2b":143,"3522a9b0-ac2a-4244-ae6b-1abf351321e3":144,"f6a12989-bd6c-4782-be06-4b7b93036c3e":145,"b45cf808-297c-41fa-8e9a-77b4e6244e14":146,"7ce3e216-7973-4b6e-9ffc-276027212cde":147,"3129dda1-94d1-4314-bf3b-9382a4a716f7":148,"45b9b646-8688-4f60-a69b-eb5d3d702645":149,"ffaed648-6da7-4121-84a9-3c1e9c0b810d":150,"7250bad5-748b-4f10-ac7b-eded3159a19e":151,"71b1df37-9a1e-4894-83bd-5c1254ea30f2":152,"4437bb0a-cbe6-4c25-99df-1951c642cb45":153,"2a19b5ec-83b8-4779-b504-9d3166b07ab1":154,"bfdebe09-9d39-4612-885e-715590ee65ee":155,"041b4dc2-03dc-4db1-ab43-0ef8db664383":156,"fcf17fb4-ece0-4b9c-a8da-40eae39a0d1a":157,"a4cf4a25-e481-4c15-88bc-d960f879c2f5":158,"6a4ec7c7-4d4a-426d-aeee-607f286cf714":159,"8506e894-ebb7-4e01-9a88-7c8c89084878":160,"1b635e1f-c995-4189-a57a-7c80e2e12cb5":161,"358352f7-9d55-4839-b96a-bedbefa33517":162,"dc9511b3-c839-4ea4-8db3-6c3305b07276":163,"a966b74f-76e0-4e95-a763-871e4521e350":164,"0dd52130-4c96-4f07-8be7-68347329f96c":165,"7c0aa3c4-58cf-4eac-9f24-baf25ff97031":166,"e3164956-c2c3-4328-8fa2-823b5c9158a4":167,"a22967b7-e551-46d3-ad94-c337254f3d06":168,"acc8be53-e5bc-4065-9a9c-3b991a7edffe":169,"c01ef4aa-c0ce-4506-8a37-738360ede7e8":170,"17d8da2f-64a3-4af4-9dc0-9341a8d5ae77":171,"028dcff5-0c11-4d6f-8fd9-f67aa9bd574b":172,"20ed201d-e3b5-4f20-9820-0a88a2973b23":173,"9ce1d484-f3dc-4669-9fe8-6af2d1ab2157":174,"5fbedadf-1331-4e7e-80c9-14861939fa2b":175,"051da7d3-fd55-47a7-b1b3-ed08ed632a20":176,"e91ec582-31cb-480f-813c-54881e76bd70":177,"5d2f4ce8-a8b3-4697-8387-34f8095ae6cf":178,"23a5aa9b-48b2-436a-b8f4-a64cdf401dbb":179,"4ead4dcf-4f66-435a-a06c-56a97376889b":180,"07939eb5-88a9-488e-b862-378c26b1df02":181,"600b9182-7c0f-49c3-942a-6a19924d0fa4":182,"45871fb9-2dec-4d34-a31b-868ce8dca87f":183,"721a4593-8e5a-43fd-9e47-cd564475651c":184,"2b9af5fd-e790-4c44-9b9a-fb66c8c3f37d":185,"11ceb20f-a2ec-4626-af29-ed3b887278b2":186,"b313b611-34d4-4029-9e7b-1d141ff893e0":187,"23cee519-8ce3-466e-9efe-2da6e665fc30":188,"ddbc10fe-69b7-4805-bd64-d1195aeb9973":189,"cedc6d73-4499-42ec-a1b0-9b7be7485e55":190,"98c2c1e2-27d9-46aa-8eca-ada4e5631bdd":191,"9140f3ec-d892-432b-935c-eccbc4b9d4ac":192,"12156700-ee25-491a-ab97-db7c67ce4555":193,"0dcb9c69-c557-46bc-91ec-5df92cba5877":194,"589c116a-13a2-4c44-b2f6-84997e09dc2d":195,"e64a0d1d-37bd-470c-ba2b-62a37368629f":196,"7a57c355-b30a-47d1-96bf-e937156a302d":197,"5187b7b0-082c-4a46-8743-9655556c2c01":198,"a49429da-941b-4046-9f4a-ebf6c9562f8d":199,"e5485979-d0da-4df4-b3fe-4d0910494b9c":200,"b5d7c038-bc5a-46f6-9aea-786a300debaf":201,"665b6a1a-ed7d-41b3-84c5-db32282b131f":202,"c4021556-41ca-42ff-a026-ca727570d25f":203,"fef26423-6fc4-4604-9f8d-022a939dc7a7":204,"7357fa12-7cb6-420d-b495-f5135e2d6d7d":205,"064ce772-928d-4a3f-a676-cea483673500":206,"94c3c29c-a814-4635-a376-ac3a1db05190":207,"c528c8cd-f438-443e-b452-f8626829e373":208,"9ac550c5-4c81-4399-a614-c6db4bc653c2":209,"cf3c7bde-91fd-4d14-876d-2c30455efce8":210,"ab6ffc53-b3c5-4afa-ad0c-c7b4482181a7":211,"f10618df-307a-4ccb-8c79-029d5ddfa2a4":212,"6b15b7cd-d057-48ce-883e-cc505b4870d4":213,"4fa9e5b3-75b8-4485-ac36-460db8e5f22b":214,"23add89f-bdd2-49c3-ade0-2a2abb29cbd1":215,"e7e0dedf-58a7-44b9-bff2-1d8f9b856102":216,"9fdb8a29-8ba0-46f8-9c34-6ded098617fb":217,"5e615451-4b9a-4d7b-9802-740e80e4697c":218,"37a8143c-b262-4765-9231-0004de0b2eaf":219,"210dddd7-d691-4406-8742-8368352235cd":220,"d93d0c66-d85d-4c55-9d10-3759da20f145":221,"ed2f4595-c986-4735-aaa0-93ea20892ca5":222,"ead3aa39-b09d-4b68-a5a0-20f952341654":223,"1f7fc8ae-f7dd-4153-9ada-4e027f6dbb32":224,"db2ba0c5-1d27-4675-8b30-d37490567dff":225,"2fc1927c-8111-4709-9187-eb79d37df7a1":226,"35c69435-9b0f-4fe5-adc0-2026474725a5":227,"3f7e18c0-4478-458d-b681-49e0ce8b1dd2":228,"4c1f07e0-a231-450a-a061-a9f68b92a2fc":229,"f1a95927-3894-435d-b20d-1b6bd972dbcc":230,"0f4faf78-5fdf-4ae0-b398-3115afc3e361":231,"e8136938-804d-46a4-815d-03d5947bb67b":232,"b41aa3e7-8354-4a80-971e-440e4edb3f9a":233,"24a3e1ce-0cfd-476a-a0f5-9d3798b4a469":234,"c790e981-aaf8-4899-8120-e5f452cd2e0f":235,"02f456fb-76a0-49fe-8fd8-fb11f71e2a1e":236,"33c84d12-8817-4431-a16f-e05742cf8972":237,"cc22c2ad-4a44-4c79-9b39-7b72242c930d":238,"44e80848-85ab-44ed-a460-afc48beade20":239,"54994edc-e09f-4490-96d7-716c4cf8c1fa":240,"65c97cd8-c209-4ad7-8532-99f45ce3e355":241,"d10c3b55-5dde-4707-833f-6fb947f0fc3f":242,"efb35e05-2f35-43fc-abfb-e1b7c8b56938":243,"18cd705b-05b8-4c8f-8b03-495f4f5bf853":244,"963f8be5-62e2-4bed-87a4-ea45639a745a":245,"c92b1e1e-5a13-497c-89aa-be32f56deeba":246,"cca0d2e5-6b8f-4785-9764-5c5f645b9fdb":247,"9fa0a794-440b-4835-a058-e4cd77f03d9f":248,"05ee87f8-2723-4fef-af00-ebd0721a7cac":249,"fd743d6d-71de-4188-a814-cb65565719b9":250,"3821708e-a0cd-4f1d-af55-1b929e0e639b":251,"f9ef79d4-67bc-42ca-bc10-7b45921d2e71":252,"a9f8bb12-146b-48bc-89b5-96d29fbc6d2a":253,"bbbcaae6-36d0-47e9-bcc1-655602c473b4":254,"9d54c521-2dee-46d5-bb16-7c076a7a70d0":255,"126dc5e7-5f7e-476b-8206-d554cd9e37a6":256,"8638c2b4-8095-4195-9e0c-846aff5d31f2":257,"b1bb495c-02e4-4ad2-ae8b-3ce13f976787":258,"29e7b558-f29f-4918-988e-548c08d55cad":259,"f542e925-67a9-4df0-a2a3-1338d445dab0":260,"6c2a9a0b-4b57-4d50-87e5-2169a3537a46":261,"06f89a7c-90eb-46bc-8806-7d944c91a12f":262,"87ca10bd-9140-4d03-8cca-80b713dc4592":263,"d0ed8d9e-e190-4380-b2ea-62f4c9cad858":264,"12ec1081-a8d7-4827-9632-3749a358b4fe":265,"cfff32f1-1bc9-4106-9c8b-17a7de556c1c":266,"5f3485a3-e0ce-4876-b657-69f26442bbf1":267,"e8d0cbcf-df9a-4dc2-8f99-009218987cc5":268,"889b03db-4be6-45e8-8b2d-092f76beec8f":269,"ffb799ce-82ae-4670-9471-7fb6c07617aa":270,"6f322a25-6c27-44a0-80c2-b4b64ec1b059":271,"b078e5cf-a020-4026-90f9-27fa02c93f05":272});

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
  visibleToEmails: [],
  visibleToCodes: [],
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
const clientsView = document.querySelector("#clientsView");
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
const orderRecipientModal = document.querySelector("#orderRecipientModal");
const orderRecipientForm = document.querySelector("#orderRecipientForm");
const closeOrderRecipientModal = document.querySelector("#closeOrderRecipientModal");
const productSearch = document.querySelector("#productSearch");
const shelfFilter = document.querySelector("#shelfFilter");
const categoryFilter = document.querySelector("#categoryFilter");
const machineTypeFilter = document.querySelector("#machineTypeFilter");
const manufacturerFilter = document.querySelector("#manufacturerFilter");
const clearFiltersButton = document.querySelector("#clearFiltersButton");
const exportExcelButton = document.querySelector("#exportExcelButton");
const locationShelf = document.querySelector("#locationShelf");
const importExcelInput = document.querySelector("#importExcelInput");
const clientOrderImportInput = document.querySelector("#clientOrderImportInput");
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
const clientsNavButton = document.querySelector("#clientsNavButton");
const ordersCreateShortageOrderButton = document.querySelector("#ordersCreateShortageOrderButton");
const globalClientCodesInput = document.querySelector("#globalClientCodesInput");
const addClientCodesCatalogButton = document.querySelector("#addClientCodesCatalogButton");
const saveGlobalClientCodesButton = document.querySelector("#saveGlobalClientCodesButton");
const clearGlobalClientCodesButton = document.querySelector("#clearGlobalClientCodesButton");
const downloadClientCodesSqlButton = document.querySelector("#downloadClientCodesSqlButton");
const clientPreviewCodeSelect = document.querySelector("#clientPreviewCodeSelect");
const replaceClientCodeFrom = document.querySelector("#replaceClientCodeFrom");
const replaceClientCodeTo = document.querySelector("#replaceClientCodeTo");
const replaceClientCodeButton = document.querySelector("#replaceClientCodeButton");
const checkClientCodeCloudButton = document.querySelector("#checkClientCodeCloudButton");
const clientCloudCheckResult = document.querySelector("#clientCloudCheckResult");
const clientPreviewProductsList = document.querySelector("#clientPreviewProductsList");
const clientPreviewSummary = document.querySelector("#clientPreviewSummary");
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
const topRecipientsList = document.querySelector("#topRecipientsList");
const statisticsList = document.querySelector("#statisticsList");
const statisticsSearch = document.querySelector("#statisticsSearch");
const shipmentExportDateFrom = document.querySelector("#shipmentExportDateFrom");
const shipmentExportDateTo = document.querySelector("#shipmentExportDateTo");
const exportShipmentsButton = document.querySelector("#exportShipmentsButton");
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
let localImportBusy = false;
let suppressCloudSyncUntil = loadCloudProtectionUntil();
let cloudSyncGeneration = 0;
let localProductsProtectedFromCloud = suppressCloudSyncUntil > Date.now();
let lastDeletedProduct = loadLastDeletedProduct();
let currentOrderNumber = loadCurrentOrderNumber();
let pendingOrderRecipientResolver = null;
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

function loadCloudProtectionUntil() {
  try {
    return Number(localStorage.getItem(CLOUD_PROTECT_KEY)) || 0;
  } catch {
    return 0;
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
        visibleToEmails: Array.isArray(product.visibleToEmails) ? product.visibleToEmails : [],
        visibleToCodes: Array.isArray(product.visibleToCodes) ? product.visibleToCodes : [],
        images,
        image: images[0] || DEFAULT_IMAGE,
      };
    }).sort(compareWarehouseProducts);
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
      if (currentView === "clients") renderClientsView();
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
    navigator.serviceWorker.register("./service-worker.js", { updateViaCache: "none" }).catch(() => {
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

function getErrorMessage(error) {
  return [
    error?.message,
    error?.details,
    error?.hint,
    error?.code ? `Kod: ${error.code}` : "",
  ].filter(Boolean).join(" ");
}

function pauseAutomaticCloudSync(milliseconds = 60000) {
  suppressCloudSyncUntil = Math.max(suppressCloudSyncUntil, Date.now() + milliseconds);
}

function canRunAutomaticCloudSync() {
  return !localImportBusy && !isLocalCloudProtectionActive() && Date.now() >= suppressCloudSyncUntil;
}

function isLocalCloudProtectionActive() {
  if (localProductsProtectedFromCloud && Date.now() >= suppressCloudSyncUntil) {
    allowCloudProductsAgain();
  }
  return localProductsProtectedFromCloud;
}

function protectLocalProductsFromCloud(milliseconds = 60 * 60 * 1000) {
  const protectUntil = Date.now() + milliseconds;
  localProductsProtectedFromCloud = true;
  cloudSyncGeneration += 1;
  suppressCloudSyncUntil = Math.max(suppressCloudSyncUntil, protectUntil);
  try {
    localStorage.setItem(CLOUD_PROTECT_KEY, String(suppressCloudSyncUntil));
  } catch {
    // Aplikacja nadal działa, tylko bez zapamiętania ochrony po odświeżeniu.
  }
}

function allowCloudProductsAgain() {
  localProductsProtectedFromCloud = false;
  cloudSyncGeneration += 1;
  try {
    localStorage.removeItem(CLOUD_PROTECT_KEY);
  } catch {
    // Brak wpływu na działanie aplikacji.
  }
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
    visible_to_emails: Array.isArray(product.visibleToEmails) ? product.visibleToEmails : [],
    visible_to_codes: Array.isArray(product.visibleToCodes) ? product.visibleToCodes : [],
    image: getStoredImages(product)[0] || "",
    images: getStoredImages(product),
    shipments: Array.isArray(product.shipments) ? product.shipments : [],
  };
}

function fromDatabaseProduct(product) {
  return {
    id: product.id,
    warehouseNumber: positiveWarehouseNumber(product.warehouse_number),
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
    visibleToEmails: Array.isArray(product.visible_to_emails) ? product.visible_to_emails : [],
    visibleToCodes: Array.isArray(product.visible_to_codes) ? product.visible_to_codes : [],
    images: Array.isArray(product.images) && product.images.length
      ? product.images.slice(0, 3)
      : (product.image ? [product.image] : []),
    image: (Array.isArray(product.images) && product.images[0]) || product.image || DEFAULT_IMAGE,
  };
}

async function readCloudProductPages(isCancelled) {
  const result = [];
  const seen = new Set();
  let pageSize = 25;
  while (result.length < PRODUCT_LIMIT) {
    if (isCancelled()) return null;
    const from = result.length;
    const to = Math.min(from + pageSize, PRODUCT_LIMIT) - 1;
    const { data, error } = await supabaseClient
      .from("products")
      .select("*")
      .order("warehouse_number", { ascending: true })
      .order("id", { ascending: true })
      .range(from, to);
    if (isCancelled()) return null;
    if (error) {
      if (String(error.code) === "57014" && pageSize > 5) {
        pageSize = Math.max(5, Math.floor(pageSize / 2));
        continue;
      }
      throw error;
    }
    if (!Array.isArray(data)) throw new Error("Baza zwróciła nieprawidłową odpowiedź. Lista lokalna została zachowana.");
    for (const product of data) {
      if (seen.has(product.id)) {
        throw new Error("Lista w chmurze zmieniła się podczas pobierania. Spróbuj ponownie. Lista lokalna została zachowana.");
      }
      seen.add(product.id);
      result.push(product);
    }
    setSyncStatus("", `Pobieranie produktów: ${result.length}…`);
    if (data.length < to - from + 1) break;
  }
  return result;
}

async function loadCloudProducts({ importLocalIfEmpty = false, quiet = false } = {}) {
  if (isLocalCloudProtectionActive() && !importLocalIfEmpty) {
    setSyncStatus("", "Kopia lokalna");
    return;
  }
  if (localImportBusy) return;
  if (!supabaseClient || !currentUser || cloudBusy) return;
  cloudBusy = true;
  const syncGeneration = cloudSyncGeneration;
  const syncUserId = currentUser.id;
  const isCancelled = () => localImportBusy || currentUser?.id !== syncUserId
    || syncGeneration !== cloudSyncGeneration
    || (isLocalCloudProtectionActive() && !importLocalIfEmpty);
  setSyncStatus("", "Synchronizacja…");

  try {
    const data = await readCloudProductPages(isCancelled);
    if (data === null || isCancelled()) return;

    if (!data.length && importLocalIfEmpty && products.length) {
      const { error: insertError } = await supabaseClient
        .from("products")
        .insert(products.map(toDatabaseProduct));
      if (insertError) throw insertError;
    } else if (data.length) {
      if (isLocalCloudProtectionActive() && data.length < products.length) {
        setSyncStatus("", "Kopia lokalna");
        return;
      }
      const selectedId = currentProductId;
      products = data.map(fromDatabaseProduct).sort(compareWarehouseProducts);
      currentProductId = products.some((product) => product.id === selectedId)
        ? selectedId
        : products[0].id;
      try {
        await saveAllProductImages(products);
      } catch {
        showToast("Produkty pobrano z chmury, ale część zdjęć nie zmieściła się w pamięci tej przeglądarki.");
      }
      saveProducts();
      renderProduct();
      renderProductsList();
      if (currentView === "clients") renderClientsView();
      if (currentView === "statistics") renderStatistics();
    }

    setSyncStatus("online", "Zsynchronizowano");
  } catch (error) {
    if (isCancelled()) return;
    const timedOut = String(error?.code) === "57014";
    setSyncStatus("error", timedOut ? "Przekroczony czas pobierania — dane lokalne zachowane" : "Błąd synchronizacji");
    if (!quiet) {
      const reason = getErrorMessage(error);
      showToast(reason
        ? `Błąd synchronizacji: ${reason}`
        : "Nie udało się połączyć z Supabase."
      );
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
    }, () => {
      if (canRunAutomaticCloudSync()) loadCloudProducts({ quiet: true });
    })
    .subscribe();
}

async function handleSession(session, firstLoad) {
  currentUser = session?.user || null;
  if (!currentUser) {
    loginButton.textContent = "Zaloguj";
    loginButton.classList.remove("logged-in");
    setSyncStatus("", supabaseClient ? "Nie zalogowano" : "Tryb lokalny");
    return;
  }

  loginButton.textContent = "Wyloguj";
  loginButton.classList.add("logged-in");
  subscribeToCloudChanges();
  await loadCloudProducts({ importLocalIfEmpty: firstLoad });
}

async function initializeSupabase() {
  if (!window.supabase?.createClient) {
    setSyncStatus("error", "Brak Supabase");
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
  const { data, error } = await query.select("warehouse_number").single();
  if (error) throw error;
  product.warehouseNumber = positiveWarehouseNumber(data?.warehouse_number);
  products.sort(compareWarehouseProducts);
  setSyncStatus("online", "Zsynchronizowano");
}

async function removeProductFromCloud(productId) {
  if (!currentUser) return;
  setSyncStatus("", "Usuwanie…");
  const { error } = await supabaseClient.from("products").delete().eq("id", productId);
  if (error) throw error;
  setSyncStatus("online", "Zsynchronizowano");
}

function chunkArray(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

async function replaceCloudProducts(nextProducts) {
  if (!supabaseClient) throw new Error("Brak połączenia z Supabase. Sprawdź, czy wgrano folder vendor i odśwież stronę.");
  if (!currentUser) return { synced: false, cloudCount: null };
  setSyncStatus("", "Przywracanie…");
  const { error: deleteError } = await supabaseClient
    .from("products")
    .delete()
    .eq("owner_id", currentUser.id);
  if (deleteError) throw deleteError;
  if (nextProducts.length) {
    const chunks = chunkArray(nextProducts, 25);
    let uploaded = 0;
    for (const chunk of chunks) {
      setSyncStatus("", `Wysyłanie do chmury ${uploaded}/${nextProducts.length}…`);
      const { error: insertError } = await supabaseClient
        .from("products")
        .insert(chunk.map(toDatabaseProduct));
      if (insertError) throw insertError;
      uploaded += chunk.length;
    }
  }
  const { count, error: countError } = await supabaseClient
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", currentUser.id);
  if (countError) throw countError;
  setSyncStatus("online", "Zsynchronizowano");
  return { synced: true, cloudCount: count };
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
  products.sort(compareWarehouseProducts);
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
      const warehouseNumber = getWarehouseNumber(product);
      return `
      <div class="product-list-row" data-product-id="${product.id}" role="button" tabindex="0" aria-label="Otwórz produkt ${escapeHtml(product.name)}">
        <span class="row-number">${warehouseNumber}</span>
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
        ${renderProductClientCodePicker(product)}
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
  products.sort(compareWarehouseProducts);
  renderOrderSummary();
  const shortageProducts = products.filter(isLowStock);
  ordersCount.textContent = shortageProducts.length;
  ordersList.innerHTML = shortageProducts.length
    ? shortageProducts.map((product) => {
      const warehouseNumber = getWarehouseNumber(product);
      const shortage = shortageQuantity(product);
      return `
      <div class="orders-product-row" data-order-product="${product.id}" role="button" tabindex="0" aria-label="Otwórz produkt ${escapeHtml(product.name)}">
        <span class="row-number">${warehouseNumber}</span>
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

function positiveWarehouseNumber(value) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : null;
}

function getWarehouseNumber(product) {
  // Dla produktów z kopii z 21.10.2026 numer wynika z ich stałego ID, także przy starym cache.
  return BACKUP_WAREHOUSE_NUMBERS[product?.id]
    || positiveWarehouseNumber(product?.warehouseNumber) || "—";
}

function compareWarehouseProducts(a, b) {
  const first = positiveWarehouseNumber(getWarehouseNumber(a)) || Number.MAX_SAFE_INTEGER;
  const second = positiveWarehouseNumber(getWarehouseNumber(b)) || Number.MAX_SAFE_INTEGER;
  return first - second || String(a.id).localeCompare(String(b.id));
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
  if (currentView === "clients") {
    breadcrumbs.innerHTML = `
      <button type="button" data-breadcrumb-view="list">Główne okno</button>
      <span>/</span>
      <strong class="current-crumb">Klienci</strong>
    `;
    return;
  }
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
      : (view === "clients"
        ? "#klienci"
        : (view === "detail" ? `#szczegoly-produktu-${productNumber}` : "#wszystkie-produkty")));
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
      recipientName: shipment.recipientName || "",
      recipientAddress: shipment.recipientAddress || "",
      orderTitle: shipment.orderTitle || "",
      quantity: Number(shipment.quantity) || 0,
      date: shipment.date,
      value: Number(shipment.value) || ((Number(shipment.quantity) || 0) * (Number(shipment.unitPrice ?? product.purchasePrice) || 0)),
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

function shipmentValue(product, shipment) {
  return Number(shipment.value) || ((Number(shipment.quantity) || 0) * (Number(shipment.unitPrice ?? product.purchasePrice) || 0));
}

function parseDateInputStart(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateInputLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateInputEnd(value) {
  if (!value) return null;
  const date = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getOrderNumberFromTitle(orderTitle) {
  const title = String(orderTitle || "").trim();
  const match = title.match(/\bnr\s+([0-9A-Za-z_-]+)/i);
  if (match?.[1]) return match[1].trim();
  return title;
}

function exportShipmentsToExcel() {
  if (!window.XLSX) {
    showToast("Nie udało się załadować modułu eksportu Excel.");
    return;
  }
  const dateFromValue = shipmentExportDateFrom.value;
  const dateToValue = shipmentExportDateTo.value;
  const dateFrom = parseDateInputStart(dateFromValue);
  const dateTo = parseDateInputEnd(dateToValue);
  if (!dateFrom || !dateTo) {
    showToast("Wybierz datę od i datę do eksportu wysyłek.");
    return;
  }
  if (dateFrom > dateTo) {
    showToast("Data od nie może być późniejsza niż data do.");
    return;
  }

  const shipments = getShipmentHistory()
    .filter((shipment) => {
      const date = new Date(shipment.date);
      return !Number.isNaN(date.getTime()) && date >= dateFrom && date <= dateTo;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!shipments.length) {
    showToast("Brak wysyłek w wybranym okresie.");
    return;
  }

  const rows = shipments.map((shipment, index) => [
    index + 1,
    getOrderNumberFromTitle(shipment.orderTitle),
    new Date(shipment.date),
    shipment.recipientName || "Nie podano",
    shipment.productName,
    Number(shipment.quantity) || 0,
  ]);
  const title = `Raport wysyłek od ${dateFromValue} do ${dateToValue}`;
  const worksheet = window.XLSX.utils.aoa_to_sheet([
    [title],
    ["Lp.", "Nr zamówienia", "Data wygenerowania zamówienia", "Firma", "Rodzaj produktu wysłanego", "Ilość sztuk"],
    ...rows,
  ]);
  worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];
  worksheet["!cols"] = [
    { wch: 8 },
    { wch: 18 },
    { wch: 28 },
    { wch: 30 },
    { wch: 52 },
    { wch: 14 },
  ];
  worksheet["!rows"] = [{ hpt: 26 }, { hpt: 24 }];
  worksheet["!autofilter"] = { ref: `A2:F${rows.length + 2}` };
  if (worksheet.A1) {
    worksheet.A1.s = {
      font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "17243F" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }
  ["A2", "B2", "C2", "D2", "E2", "F2"].forEach((address) => {
    if (!worksheet[address]) return;
    worksheet[address].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "1F8E5F" } },
      alignment: { vertical: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "C8D7CD" } },
        bottom: { style: "thin", color: { rgb: "C8D7CD" } },
        left: { style: "thin", color: { rgb: "C8D7CD" } },
        right: { style: "thin", color: { rgb: "C8D7CD" } },
      },
    };
  });
  rows.forEach((_row, index) => {
    const excelRow = index + 3;
    if (worksheet[`A${excelRow}`]) worksheet[`A${excelRow}`].t = "n";
    if (worksheet[`C${excelRow}`]) worksheet[`C${excelRow}`].z = "dd.mm.yyyy hh:mm";
    if (worksheet[`F${excelRow}`]) {
      worksheet[`F${excelRow}`].t = "n";
      worksheet[`F${excelRow}`].z = '#,##0 "szt."';
    }
  });

  try {
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, "Wysyłki");
    exportWorkbookToExcel(workbook, `wysylki-${dateFromValue}-do-${dateToValue}.xlsx`);
    showToast(`Wyeksportowano ${shipments.length} wierszy wysyłek.`);
  } catch (error) {
    const reason = error?.message ? ` Powód: ${error.message}` : "";
    showToast(`Nie udało się pobrać Excela z wysyłkami.${reason}`);
  }
}

function renderStatistics() {
  products.sort(compareWarehouseProducts);
  if (!shipmentExportDateFrom.value || !shipmentExportDateTo.value) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    shipmentExportDateFrom.value ||= formatDateInputLocal(startOfMonth);
    shipmentExportDateTo.value ||= formatDateInputLocal(now);
  }
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
      const warehouseNumber = getWarehouseNumber(product);
      return `
    <div class="statistics-product-row">
      <span class="row-number">${warehouseNumber}</span>
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

  const recipientTotals = new Map();
  statisticsProducts.forEach((product) => {
    (Array.isArray(product.shipments) ? product.shipments : []).forEach((shipment) => {
      const recipient = String(shipment.recipientName || "").trim();
      const quantity = Number(shipment.quantity) || 0;
      if (!recipient || quantity <= 0) return;
      const previous = recipientTotals.get(recipient) || { quantity: 0, value: 0, orders: new Set() };
      previous.quantity += quantity;
      previous.value += shipmentValue(product, shipment);
      previous.orders.add(shipment.orderTitle || shipment.date || `${recipient}-${previous.quantity}`);
      recipientTotals.set(recipient, previous);
    });
  });
  const topRecipients = [...recipientTotals.entries()]
    .map(([recipient, totals]) => ({
      recipient,
      quantity: totals.quantity,
      value: totals.value,
      ordersCount: totals.orders.size,
    }))
    .sort((a, b) => b.quantity - a.quantity || b.value - a.value)
    .slice(0, 5);
  topRecipientsList.innerHTML = topRecipients.length
    ? topRecipients.map((item) => `
      <li>
        <span class="ranking-product">
          <b>${escapeHtml(item.recipient)}</b>
          <small>${item.ordersCount} zamówień · ${formatPrice(item.value)}</small>
        </span>
        <strong>${item.quantity} szt.</strong>
      </li>
    `).join("")
    : "<li><span>Brak firm w historii</span><strong>0 szt.</strong></li>";

  statisticsList.innerHTML = history.length
    ? history.map((shipment) => `
      <div class="statistics-row">
        <time datetime="${escapeHtml(shipment.date)}">${new Intl.DateTimeFormat("pl-PL", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(shipment.date))}</time>
        <button type="button" data-statistics-product="${shipment.productId}">${escapeHtml(shipment.productName)}</button>
        <strong>${shipment.quantity} szt.</strong>
        <span class="statistics-recipient">${escapeHtml(shipment.recipientName || "Nie podano")}${shipment.recipientAddress ? `<small>${escapeHtml(shipment.recipientAddress)}</small>` : ""}</span>
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
  const showClients = view === "clients";
  detailView.hidden = !showDetail;
  productsView.hidden = !showList;
  statisticsView.hidden = !showStatistics;
  ordersView.hidden = !showOrders;
  clientsView.hidden = !showClients;
  pageTitle.textContent = showStatistics
    ? "Statystyki wysyłek"
    : (showOrders ? "Zamówienia" : (showClients ? "Klienci" : (showList ? "Wszystkie produkty" : "Szczegóły produktu")));
  allProductsButton.classList.toggle("active", showList);
  productsNavButton.classList.toggle("active", showList || showDetail);
  ordersNavButton.classList.toggle("active", showOrders);
  statisticsNavButton.classList.toggle("active", showStatistics);
  clientsNavButton.classList.toggle("active", showClients);
  viewButtonLabel.textContent = showList ? "Szczegóły produktu" : "Wszystkie produkty";
  editButton.hidden = !showDetail;
  deleteProductButton.hidden = !showDetail;
  productSelect.closest(".product-switcher").hidden = !showDetail;
  renderBreadcrumbs();
  if (updateHistory) updateViewHistory(view, replaceHistory);
  if (showList) renderProductsList();
  if (showOrders) renderOrdersView();
  if (showClients) renderClientsView();
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
  form.elements.clientCodes.value = Array.isArray(product.visibleToCodes)
    ? product.visibleToCodes.join(", ")
    : "";
  pendingImages = getStoredImages(product);
  updateImagePreviews();
  updateLocationSuggestion();
  imageInput.value = "";
}

function openModal(mode = "edit", focusStock = false) {
  formMode = mode;
  const product = mode === "new"
    ? { name: "", category: "", machineType: "", location: "A/1/1", description: "", stock: 0, required: 0, ordered: 0, sent: 0, purchasePrice: 0, manufacturer: "", visibleToEmails: [], visibleToCodes: [], images: [], shipments: [] }
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

function getOrderStorageDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function getOrderDate() {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
}

function loadCurrentOrderNumber() {
  const today = getOrderStorageDate();
  try {
    const state = JSON.parse(localStorage.getItem(ORDER_STATE_KEY));
    if (state?.date === today) return Math.max(1, Number(state.number) || 1);
  } catch {
    // Stare wersje aplikacji nie miały dziennego resetu numeru.
  }
  const legacyNumber = Math.max(1, Number(localStorage.getItem(ORDER_NUMBER_KEY)) || 1);
  localStorage.setItem(ORDER_STATE_KEY, JSON.stringify({ date: today, number: legacyNumber }));
  return legacyNumber;
}

function saveCurrentOrderNumber() {
  localStorage.setItem(ORDER_STATE_KEY, JSON.stringify({
    date: getOrderStorageDate(),
    number: currentOrderNumber,
  }));
  localStorage.setItem(ORDER_NUMBER_KEY, String(currentOrderNumber));
}

function ensureCurrentOrderNumberForToday() {
  const today = getOrderStorageDate();
  try {
    const state = JSON.parse(localStorage.getItem(ORDER_STATE_KEY));
    if (state?.date === today) {
      currentOrderNumber = Math.max(1, Number(state.number) || 1);
      return;
    }
  } catch {
    // Jeżeli zapis był nieczytelny, zaczynamy numerację dnia od nowa.
  }
  currentOrderNumber = 1;
  saveCurrentOrderNumber();
}

function getOrderTitle(companyName = "") {
  ensureCurrentOrderNumberForToday();
  const companySuffix = String(companyName || "").trim()
    ? ` firmy ${String(companyName).trim()}`
    : "";
  return `Zamówienie dnia ${getOrderDate()} nr ${currentOrderNumber}${companySuffix}`;
}

function safeFileName(value) {
  return String(value || "zamowienie")
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

function parseClientCodes(value) {
  return [...new Set(String(value || "")
    .split(/[,\n;]/)
    .map((code) => code.trim())
    .filter((code) => code.length >= 3)
  )];
}

function normalizeClientCode(code) {
  return String(code || "").trim().toLocaleLowerCase("pl");
}

function loadSavedClientCodes() {
  try {
    return parseClientCodes(JSON.parse(localStorage.getItem(CLIENT_CODES_KEY) || "[]").join(","));
  } catch {
    return [];
  }
}

function saveClientCodeCatalog(codes) {
  localStorage.setItem(CLIENT_CODES_KEY, JSON.stringify(parseClientCodes(codes.join(","))));
}

function sqlString(value) {
  return `'${String(value || "").replaceAll("'", "''")}'`;
}

function downloadTextFile(filename, content, type = "text/plain") {
  const blob = new Blob([content], { type });
  downloadBlobFile(filename, blob);
}

function downloadBlobFile(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    link.remove();
  }, 0);
}

function exportWorkbookToExcel(workbook, filename) {
  if (!window.XLSX) throw new Error("Biblioteka Excel nie została załadowana.");
  if (typeof window.XLSX.write === "function") {
    const output = window.XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
    const blob = new Blob([output], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    downloadBlobFile(filename, blob);
    return;
  }
  if (typeof window.XLSX.writeFile === "function") {
    window.XLSX.writeFile(workbook, filename);
    return;
  }
  throw new Error("Brak funkcji pobierania pliku Excel.");
}

function getAllClientCodes() {
  const productCodes = products.flatMap((product) =>
    Array.isArray(product.visibleToCodes) ? product.visibleToCodes : []
  );
  return [...new Set([...loadSavedClientCodes(), ...productCodes])]
    .sort((a, b) => a.localeCompare(b, "pl"));
}

function productVisibleForClientCode(product, code) {
  const selectedCode = normalizeClientCode(code);
  return Array.isArray(product.visibleToCodes)
    && product.visibleToCodes.some((item) => normalizeClientCode(item) === selectedCode);
}

function renderProductClientCodePicker(product) {
  const assignedCodes = Array.isArray(product.visibleToCodes) ? product.visibleToCodes : [];
  const availableCodes = getAllClientCodes()
    .filter((code) => !assignedCodes.some((assignedCode) => normalizeClientCode(assignedCode) === normalizeClientCode(code)));
  const selectHtml = `
    <select class="row-client-code-select" data-client-code-product="${escapeHtml(product.id)}" aria-label="Dodaj kod klienta do produktu ${escapeHtml(product.name)}">
      <option value="">Dodaj kod…</option>
      ${availableCodes.length
        ? availableCodes.map((code) => `<option value="${escapeHtml(code)}">${escapeHtml(code)}</option>`).join("")
        : '<option value="" disabled>Brak nowych kodów</option>'}
    </select>
  `;
  const chipsHtml = assignedCodes.length
    ? assignedCodes.map((code) => `
      <button class="row-client-code-chip" type="button" data-remove-client-code="${escapeHtml(code)}" data-client-code-product="${escapeHtml(product.id)}" title="Usuń kod ${escapeHtml(code)} z tego produktu">
        ${escapeHtml(code)} <span>×</span>
      </button>
    `).join("")
    : '<span class="row-client-code-empty">Brak</span>';
  return `<span class="row-client-codes">${selectHtml}<span class="row-client-code-chips">${chipsHtml}</span></span>`;
}

function getClientAvailability(product) {
  return Number(product.stock) > 0 ? "Dostępny" : "Na zapytanie";
}

function canSaveClientCodesToCloud() {
  if (currentUser) return true;
  showToast("Kod klienta musi być zapisany w chmurze. Kliknij „Zaloguj” w prawym górnym rogu, zaloguj admina i zapisz kod ponownie.");
  setSyncStatus("error", "Klienci: wymaga chmury");
  return false;
}

async function checkSelectedClientCodeInCloud() {
  const selectedCode = clientPreviewCodeSelect.value || parseClientCodes(globalClientCodesInput.value)[0] || "";
  if (!selectedCode) {
    clientCloudCheckResult.textContent = "Najpierw wpisz albo wybierz kod klienta.";
    showToast("Najpierw wpisz albo wybierz kod klienta.");
    return;
  }
  if (!supabaseClient && window.supabase?.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  if (!supabaseClient) {
    clientCloudCheckResult.textContent = "Nie udało się połączyć z biblioteką Supabase.";
    showToast("Nie udało się połączyć z biblioteką Supabase.");
    return;
  }
  clientCloudCheckResult.textContent = `Sprawdzam kod ${selectedCode} w chmurze…`;
  try {
    const { data, error } = await supabaseClient.rpc("get_client_products_by_code", {
      access_code: selectedCode,
    });
    if (error) throw error;
    const count = Array.isArray(data) ? data.length : 0;
    clientCloudCheckResult.textContent = count
      ? `Kod ${selectedCode} działa w chmurze: ${count} produktów.`
      : `Kod ${selectedCode} działa technicznie, ale ma 0 produktów w chmurze.`;
    showToast(count
      ? `Kod działa: ${count} produktów w chmurze.`
      : "Kod ma 0 produktów w chmurze. Trzeba zapisać kody w Supabase."
    );
  } catch (error) {
    const reason = error?.message ? ` Powód: ${error.message}` : "";
    clientCloudCheckResult.textContent = `Nie udało się sprawdzić chmury.${reason}`;
    showToast(`Nie udało się sprawdzić chmury.${reason}`);
  }
}

function downloadClientCodesRepairSql() {
  const codes = parseClientCodes(globalClientCodesInput.value);
  if (!codes.length) {
    showToast("Wpisz przynajmniej jeden kod, żeby przygotować SQL naprawy.");
    return;
  }
  saveClientCodeCatalog(codes);
  const sqlCodes = codes.map(sqlString).join(", ");
  const sql = `-- Naprawa kodów klienta InnoAim\n-- Supabase -> SQL Editor -> New query -> wklej całość -> Run\n-- Ten skrypt ustawia podane kody dla wszystkich produktów w tabeli products.\n\nalter table public.products\nadd column if not exists visible_to_codes text[] not null default '{}'::text[];\n\nupdate public.products\nset visible_to_codes = array[${sqlCodes}]::text[];\n\n-- Kontrola po uruchomieniu. Powinno pokazać liczbę produktów dla każdego kodu.\nselect\n  code,\n  count(*) as liczba_produktow\nfrom public.products p\ncross join unnest(array[${sqlCodes}]::text[]) as code\nwhere exists (\n  select 1\n  from unnest(p.visible_to_codes) as saved_code\n  where lower(trim(saved_code)) = lower(trim(code))\n)\ngroup by code\norder by code;\n`;
  downloadTextFile("naprawa-kodow-klienta.sql", sql, "text/sql");
  showToast("Pobrano plik SQL naprawy kodów. Wklej go w Supabase SQL Editor.");
}

function renderClientsView() {
  const codes = getAllClientCodes();
  const currentSelection = clientPreviewCodeSelect.value || codes[0] || "";
  globalClientCodesInput.value = codes.join(", ");
  clientPreviewCodeSelect.innerHTML = codes.length
    ? codes.map((code) => `<option value="${escapeHtml(code)}">${escapeHtml(code)}</option>`).join("")
    : '<option value="">Brak kodów</option>';
  clientPreviewCodeSelect.value = codes.includes(currentSelection) ? currentSelection : (codes[0] || "");

  const selectedCode = clientPreviewCodeSelect.value;
  const visibleProducts = selectedCode
    ? products.filter((product) => productVisibleForClientCode(product, selectedCode))
    : [];

  clientPreviewSummary.textContent = selectedCode
    ? `Kod ${selectedCode} pokazuje ${visibleProducts.length} z ${products.length} produktów.`
    : "Wpisz kod klienta i zapisz dostęp dla produktów.";

  clientPreviewProductsList.innerHTML = visibleProducts.length
    ? visibleProducts.map((product) => `
      <article class="client-product-card">
        <div class="client-product-image">
          <img src="${escapeHtml(getProductImages(product)[0] || DEFAULT_IMAGE)}" alt="Zdjęcie produktu: ${escapeHtml(product.name)}" />
        </div>
        <div class="client-product-info">
          <span>${escapeHtml(product.category || "Produkt")}</span>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.description || "Brak opisu.")}</p>
          <dl>
            <div>
              <dt>Rodzaj maszyny</dt>
              <dd>${escapeHtml(product.machineType || "Nie podano")}</dd>
            </div>
            <div>
              <dt>Producent części</dt>
              <dd>${escapeHtml(product.manufacturer || "Nie podano")}</dd>
            </div>
          </dl>
        </div>
        <strong class="client-availability ${getClientAvailability(product) === "Dostępny" ? "available" : ""}">
          ${getClientAvailability(product)}
        </strong>
        <div class="client-order-limits">
          <span>Maks. do zamówienia: <strong>${Number(product.stock) > 0 ? `${Number(product.stock)} szt.` : "bez blokady"}</strong></span>
        </div>
      </article>
    `).join("")
    : '<div class="client-empty">Ten kod nie ma jeszcze przypisanych produktów.</div>';
}

async function saveGlobalClientCodesForAllProducts() {
  if (!canSaveClientCodesToCloud()) return;
  const codes = parseClientCodes(globalClientCodesInput.value);
  const previousCodes = loadSavedClientCodes();
  saveClientCodeCatalog(codes);
  const previousProducts = products.map((product) => ({
    ...product,
    visibleToCodes: Array.isArray(product.visibleToCodes) ? [...product.visibleToCodes] : [],
  }));
  products.forEach((product) => {
    product.visibleToCodes = codes;
  });

  try {
    setSyncStatus("", "Zapisywanie klientów…");
    const { error: updateError } = await supabaseClient
      .from("products")
      .update({ visible_to_codes: codes })
      .eq("owner_id", currentUser.id);
    if (updateError) throw updateError;
    const { count, error: countError } = await supabaseClient
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", currentUser.id);
    if (countError) throw countError;
    setSyncStatus("online", "Zsynchronizowano");
    saveProducts();
    renderProduct();
    renderProductsList();
    renderClientsView();
    if (codes.length) {
      showToast(`Zapisano dostęp w chmurze: kod pokazuje ${count ?? products.length} produktów.`);
    } else {
      showToast(`Wyczyszczono dostęp kodów w chmurze dla ${count ?? products.length} produktów.`);
    }
  } catch (error) {
    saveClientCodeCatalog(previousCodes);
    products = previousProducts;
    saveProducts();
    renderProduct();
    renderProductsList();
    renderClientsView();
    setSyncStatus("error", "Błąd zapisu");
    const errorText = getErrorMessage(error);
    const reason = errorText ? ` Powód: ${errorText}` : "";
    showToast(`Nie udało się zapisać dostępu klientów.${reason}`);
  }
}

function addClientCodesToCatalogOnly() {
  const codes = parseClientCodes(globalClientCodesInput.value);
  if (!codes.length) {
    showToast("Wpisz przynajmniej jeden kod klienta.");
    return;
  }
  saveClientCodeCatalog([...new Set([...loadSavedClientCodes(), ...codes])]);
  renderProductsList();
  renderClientsView();
  showToast("Dodano kod do listy. Teraz wybierz go przy konkretnych produktach w kolumnie „Kody klientów”.");
}

async function updateProductClientCodes(productId, nextCodes) {
  if (!canSaveClientCodesToCloud()) return;
  const index = products.findIndex((product) => product.id === productId);
  if (index < 0) return;
  const previousProduct = { ...products[index], visibleToCodes: [...(products[index].visibleToCodes || [])] };
  const previousCodes = loadSavedClientCodes();
  products[index].visibleToCodes = parseClientCodes(nextCodes.join(","));
  saveClientCodeCatalog(getAllClientCodes());

  try {
    setSyncStatus("", "Zapisywanie kodów…");
    await saveProductToCloud(products[index], false);
    setSyncStatus("online", "Zsynchronizowano");
    saveProducts();
    renderProductsList();
    renderClientsView();
    if (currentProductId === productId) renderProduct();
    showToast("Zapisano kody klienta dla produktu.");
  } catch (error) {
    saveClientCodeCatalog(previousCodes);
    products[index] = previousProduct;
    renderProductsList();
    setSyncStatus("error", "Błąd zapisu");
    const reason = error?.message ? ` Powód: ${error.message}` : "";
    showToast(`Nie udało się zapisać kodów klienta.${reason}`);
  }
}

async function replaceClientCodeEverywhere() {
  if (!canSaveClientCodesToCloud()) return;
  const oldCode = String(replaceClientCodeFrom.value || "").trim();
  const newCode = String(replaceClientCodeTo.value || "").trim();
  if (oldCode.length < 3 || newCode.length < 3) {
    showToast("Wpisz stary i nowy kod, minimum 3 znaki.");
    return;
  }
  const oldCodeNormalized = normalizeClientCode(oldCode);
  const previousProducts = products.map((product) => ({
    ...product,
    visibleToCodes: Array.isArray(product.visibleToCodes) ? [...product.visibleToCodes] : [],
  }));
  const previousCodes = loadSavedClientCodes();
  let changedProducts = 0;

  products.forEach((product) => {
    const currentCodes = Array.isArray(product.visibleToCodes) ? product.visibleToCodes : [];
    const hadOldCode = currentCodes.some((code) => normalizeClientCode(code) === oldCodeNormalized);
    if (!hadOldCode) return;
    changedProducts += 1;
    product.visibleToCodes = parseClientCodes([
      ...currentCodes.filter((code) => normalizeClientCode(code) !== oldCodeNormalized),
      newCode,
    ].join(","));
  });

  const nextCatalogCodes = parseClientCodes([
    ...previousCodes.filter((code) => normalizeClientCode(code) !== oldCodeNormalized),
    newCode,
  ].join(","));
  saveClientCodeCatalog(nextCatalogCodes);

  try {
    if (changedProducts > 0) {
      setSyncStatus("", "Zamienianie kodu…");
      await Promise.all(products
        .filter((product) => previousProducts.some((previousProduct) =>
          previousProduct.id === product.id
          && JSON.stringify(previousProduct.visibleToCodes || []) !== JSON.stringify(product.visibleToCodes || [])
        ))
        .map((product) => saveProductToCloud(product, false)));
      setSyncStatus("online", "Zsynchronizowano");
    }
    saveProducts();
    replaceClientCodeFrom.value = "";
    replaceClientCodeTo.value = "";
    renderProduct();
    renderProductsList();
    renderClientsView();
    showToast(changedProducts
      ? `Zamieniono kod w ${changedProducts} produktach.`
      : "Starego kodu nie było przy produktach. Wpisz dokładny stary kod albo użyj „Zapisz kody dla wszystkich produktów”."
    );
  } catch (error) {
    products = previousProducts;
    saveClientCodeCatalog(previousCodes);
    renderProductsList();
    renderClientsView();
    setSyncStatus("error", "Błąd zapisu");
    const reason = error?.message ? ` Powód: ${error.message}` : "";
    showToast(`Nie udało się zamienić kodu.${reason}`);
  }
}

async function recordOrderRecipientStatistics(orderedProducts, recipientDetails, orderTitle) {
  const recipientName = String(recipientDetails.recipientName || "").trim();
  if (!recipientName) return;
  const exportDate = new Date().toISOString();
  const changedProducts = [];

  orderedProducts.forEach((product) => {
    let remainingQuantity = Number(product.sent) || 0;
    if (remainingQuantity <= 0) return;
    const unitPrice = Number(product.purchasePrice) || 0;
    const shipments = Array.isArray(product.shipments) ? [...product.shipments] : [];

    for (let index = shipments.length - 1; index >= 0 && remainingQuantity > 0; index -= 1) {
      const shipment = shipments[index];
      const shipmentQuantity = Number(shipment.quantity) || 0;
      if (shipmentQuantity <= 0) continue;
      if (shipment.recipientName) {
        remainingQuantity -= Math.min(remainingQuantity, shipmentQuantity);
        continue;
      }

      const commonDetails = {
        recipientName,
        recipientAddress: recipientDetails.recipientAddress || "",
        contactPerson: recipientDetails.contactPerson || "",
        phoneNumber: recipientDetails.phoneNumber || "",
        orderTitle,
        unitPrice,
      };

      if (shipmentQuantity <= remainingQuantity) {
        shipments[index] = {
          ...shipment,
          ...commonDetails,
          value: Number((shipmentQuantity * unitPrice).toFixed(2)),
        };
        remainingQuantity -= shipmentQuantity;
      } else {
        shipments[index] = {
          ...shipment,
          quantity: shipmentQuantity - remainingQuantity,
        };
        shipments.splice(index + 1, 0, {
          ...shipment,
          ...commonDetails,
          quantity: remainingQuantity,
          value: Number((remainingQuantity * unitPrice).toFixed(2)),
        });
        remainingQuantity = 0;
      }
    }

    if (remainingQuantity > 0) {
      shipments.push({
        quantity: remainingQuantity,
        date: exportDate,
        recipientName,
        recipientAddress: recipientDetails.recipientAddress || "",
        contactPerson: recipientDetails.contactPerson || "",
        phoneNumber: recipientDetails.phoneNumber || "",
        orderTitle,
        unitPrice,
        value: Number((remainingQuantity * unitPrice).toFixed(2)),
        source: "order_export",
      });
    }

    product.shipments = shipments;
    changedProducts.push(product);
  });

  if (!changedProducts.length) return;
  if (currentUser) {
    setSyncStatus("", "Zapisywanie statystyk…");
    await Promise.all(changedProducts.map((product) => saveProductToCloud(product, false)));
    setSyncStatus("online", "Zsynchronizowano");
  }
  saveProducts();
  if (currentView === "statistics") renderStatistics();
}

function renderOrderSummary() {
  ensureCurrentOrderNumberForToday();
  const total = products.reduce((sum, product) => sum + (Number(product.sent) || 0), 0);
  orderHeading.textContent = getOrderTitle();
  orderItemsCount.textContent = total;
  exportOrderButton.disabled = total === 0;
  clearOrderButton.disabled = total === 0;
  createShortageOrderButton.disabled = !products.some((product) => shortageQuantity(product) > 0);
  if (ordersCreateShortageOrderButton) {
    ordersCreateShortageOrderButton.disabled = !products.some((product) => shortageQuantity(product) > 0);
  }
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

function loadOrderRecipientDetails() {
  try {
    const saved = JSON.parse(localStorage.getItem(ORDER_RECIPIENT_KEY));
    return {
      recipientName: saved?.recipientName || "",
      recipientAddress: saved?.recipientAddress || "",
      contactPerson: saved?.contactPerson || "",
      phoneNumber: saved?.phoneNumber || "",
    };
  } catch {
    return {
      recipientName: "",
      recipientAddress: "",
      contactPerson: "",
      phoneNumber: "",
    };
  }
}

function closeOrderRecipientDialog(details = null) {
  orderRecipientModal.hidden = true;
  document.body.style.overflow = "";
  if (pendingOrderRecipientResolver) {
    pendingOrderRecipientResolver(details);
    pendingOrderRecipientResolver = null;
  }
}

function askForOrderRecipientDetails() {
  const saved = loadOrderRecipientDetails();
  orderRecipientForm.elements.recipientName.value = saved.recipientName;
  orderRecipientForm.elements.recipientAddress.value = saved.recipientAddress;
  orderRecipientForm.elements.contactPerson.value = saved.contactPerson;
  orderRecipientForm.elements.phoneNumber.value = saved.phoneNumber;
  orderRecipientModal.hidden = false;
  document.body.style.overflow = "hidden";
  setTimeout(() => orderRecipientForm.elements.recipientName.focus(), 30);
  return new Promise((resolve) => {
    pendingOrderRecipientResolver = resolve;
  });
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
  exportWorkbookToExcel(workbook, `produkty-magazyn-${date}.xlsx`);
  showToast(`Wyeksportowano ${visibleProducts.length} produktów.`);
}

async function exportOrderToExcel() {
  const orderedProducts = products.filter((product) => Number(product.sent) > 0);
  if (!orderedProducts.length) {
    showToast("Lista zamówienia jest pusta.");
    return;
  }
  if (!window.XLSX) {
    showToast("Nie udało się załadować modułu eksportu Excel.");
    return;
  }
  const recipientDetails = await askForOrderRecipientDetails();
  if (!recipientDetails) return;

  const rows = orderedProducts.map((product) => {
    const warehouseNumber = getWarehouseNumber(product);
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
  const orderTitle = getOrderTitle(recipientDetails.recipientName);
  const worksheet = window.XLSX.utils.aoa_to_sheet([
    [orderTitle],
    ["Nazwa odbiorcy", "Adres odbiorcy", "", "Osoba kontaktowa", "Nr telefonu", "", ""],
    [
      recipientDetails.recipientName,
      recipientDetails.recipientAddress,
      "",
      recipientDetails.contactPerson,
      recipientDetails.phoneNumber,
      "",
      "",
    ],
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
  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
    { s: { r: 1, c: 1 }, e: { r: 1, c: 2 } },
    { s: { r: 2, c: 1 }, e: { r: 2, c: 2 } },
  ];
  worksheet["!cols"] = [
    { wch: 18 }, { wch: 34 }, { wch: 24 }, { wch: 26 },
    { wch: 21 }, { wch: 23 }, { wch: 27 },
  ];
  worksheet["!rows"] = [
    { hpt: 24 },
    { hpt: 20 },
    { hpt: 34 },
    { hpt: 8 },
  ];
  worksheet["!autofilter"] = { ref: `A5:G${rows.length + 5}` };
  if (worksheet.A1) {
    worksheet.A1.s = {
      font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "486EE8" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }
  ["A2", "B2", "D2", "E2"].forEach((address) => {
    if (!worksheet[address]) return;
    worksheet[address].s = {
      font: { bold: true, color: { rgb: "17243F" } },
      fill: { patternType: "solid", fgColor: { rgb: "EAF0FF" } },
      alignment: { vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "B9C7F5" } },
        bottom: { style: "thin", color: { rgb: "B9C7F5" } },
        left: { style: "thin", color: { rgb: "B9C7F5" } },
        right: { style: "thin", color: { rgb: "B9C7F5" } },
      },
    };
  });
  ["A3", "B3", "D3", "E3"].forEach((address) => {
    if (!worksheet[address]) return;
    worksheet[address].s = {
      alignment: { vertical: "top", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "CCD5EA" } },
        bottom: { style: "thin", color: { rgb: "CCD5EA" } },
        left: { style: "thin", color: { rgb: "CCD5EA" } },
        right: { style: "thin", color: { rgb: "CCD5EA" } },
      },
    };
  });
  ["A5", "B5", "C5", "D5", "E5", "F5", "G5"].forEach((address) => {
    if (!worksheet[address]) return;
    worksheet[address].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "17243F" } },
    };
  });
  rows.forEach((_row, index) => {
    const excelRow = index + 6;
    if (worksheet[`F${excelRow}`]) worksheet[`F${excelRow}`].z = '#,##0.00 "zł"';
    if (worksheet[`G${excelRow}`]) worksheet[`G${excelRow}`].z = '#,##0.00 "zł"';
  });
  const workbook = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(workbook, worksheet, "Zamówienie");
  exportWorkbookToExcel(workbook, `${safeFileName(orderTitle)}.xlsx`);
  let statisticsSaved = true;
  try {
    await recordOrderRecipientStatistics(orderedProducts, recipientDetails, orderTitle);
  } catch (error) {
    statisticsSaved = false;
    setSyncStatus("error", "Błąd zapisu statystyk");
    console.warn("Nie udało się zapisać statystyk odbiorcy.", error);
  }
  currentOrderNumber += 1;
  saveCurrentOrderNumber();
  renderOrderSummary();
  showToast(statisticsSaved
    ? `Wyeksportowano zamówienie i zapisano statystyki firmy: ${orderedProducts.length} pozycji.`
    : `Wyeksportowano zamówienie, ale nie udało się zapisać statystyk firmy.`
  );
}

function numberFromExcel(value) {
  if (typeof value === "number") return Math.max(0, value);
  const normalized = String(value ?? "").replace(/\s/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function normalizeImportText(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pl");
}

function findHeaderIndex(headers, possibleNames) {
  const normalized = headers.map(normalizeImportText);
  return possibleNames
    .map(normalizeImportText)
    .map((name) => normalized.findIndex((header) => header === name))
    .find((index) => index >= 0) ?? -1;
}

function getSheetMetaValue(rows, labels) {
  const normalizedLabels = labels.map(normalizeImportText);
  for (const row of rows.slice(0, 8)) {
    const label = normalizeImportText(row[0]);
    if (normalizedLabels.includes(label)) return String(row[1] || "").trim();
  }
  return "";
}

function findProductForClientOrderItem(name, machineType, manufacturer) {
  const normalizedName = normalizeImportText(name);
  const normalizedMachine = normalizeImportText(machineType);
  const normalizedManufacturer = normalizeImportText(manufacturer);
  const sameName = products.filter((product) => normalizeImportText(product.name) === normalizedName);
  if (!sameName.length) return null;
  if (sameName.length === 1) return sameName[0];
  return sameName.find((product) =>
    (!normalizedMachine || normalizeImportText(product.machineType) === normalizedMachine)
    && (!normalizedManufacturer || normalizeImportText(product.manufacturer) === normalizedManufacturer)
  ) || sameName[0];
}

async function importClientOrderFromExcel(file) {
  if (!window.InnoAimClientImport) throw new Error("Brak modułu importu zamówień. Wgraj client-order-import.js i index.html.");
  if (!currentUser || !supabaseClient) throw new Error("Zaloguj się do chmury przed realizacją zamówienia.");
  localImportBusy = true;
  cloudSyncGeneration += 1;
  try {
    return await window.InnoAimClientImport.open(file, {
      getProducts: () => products,
      getUser: () => currentUser,
      getClient: () => supabaseClient,
      onCommitted: async (result) => {
        if (!result.alreadyProcessed) {
          for (const row of result.updatedProducts || []) {
            const product = products.find(p => p.id === row.id);
            if (!product) continue;
            product.stock = Number(row.stock);
            product.sent = Number(row.sent);
            const history = Array.isArray(product.shipments) ? product.shipments : [];
            product.shipments = history.some(entry => entry.orderId === result.orderId)
              ? history : [...history, row.shipment];
          }
          saveProducts();
          renderProduct();
          renderProductsList();
          renderStatistics();
          renderOrderSummary();
        }
        setSyncStatus("online", "Zsynchronizowano");
        showToast(result.alreadyProcessed ? "Zamówienie było już zrealizowane — bez ponownego odjęcia." : "Zapisano wysyłkę, zmniejszono stany i uzupełniono statystyki.");
      },
    });
  } finally {
    localImportBusy = false;
    cloudSyncGeneration += 1;
  }
}

function productFromExcelRow(row, existingProduct) {
  const location = normalizeLocation(row["Lokalizacja"] || existingProduct?.location || "A/1/1");
  const importedCategory = String(row["Kategoria"] || existingProduct?.category || "Inne").trim();
  return {
    id: existingProduct?.id || String(row["ID produktu"] || "").trim() || crypto.randomUUID(),
    warehouseNumber: positiveWarehouseNumber(existingProduct?.warehouseNumber),
    name: String(row["Nazwa produktu"] || existingProduct?.name || "").trim(),
    category: importedCategory || "Inne",
    machineType: String(row["Rodzaj maszyny"] || existingProduct?.machineType || "").trim(),
    manufacturer: String(row["Producent części"] || existingProduct?.manufacturer || "").trim(),
    visibleToEmails: Array.isArray(existingProduct?.visibleToEmails) ? existingProduct.visibleToEmails : [],
    visibleToCodes: Array.isArray(existingProduct?.visibleToCodes) ? existingProduct.visibleToCodes : [],
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
  products = nextProducts.sort(compareWarehouseProducts);
  currentProductId = products.some((product) => product.id === currentProductId)
    ? currentProductId
    : products[0].id;
  protectLocalProductsFromCloud();
  saveProducts();
  renderProduct();
  renderProductsList();
  try {
    const cloudResult = await replaceCloudProducts(products);
    if (cloudResult?.synced && cloudResult.cloudCount >= products.length) {
      allowCloudProductsAgain();
    } else {
      protectLocalProductsFromCloud();
    }
    showToast(cloudResult?.synced && cloudResult.cloudCount >= products.length
      ? `Import zakończony i zapisany w chmurze: ${cloudResult.cloudCount} produktów.`
      : `Import zakończony lokalnie: ${products.length} produktów. Chmura nadal ma ${cloudResult?.cloudCount ?? "brak"} produktów.`
    );
  } catch (error) {
    protectLocalProductsFromCloud();
    const reason = error?.message ? ` Powód: ${error.message}` : "";
    setSyncStatus("error", "Nie zapisano chmury");
    showToast(`Import zapisany lokalnie, ale nie w chmurze.${reason}`);
  }
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
  showToast("Wczytuję kopię zapasową…");
  let backup;
  try {
    backup = JSON.parse(await file.text());
  } catch {
    throw new Error("Nie udało się odczytać kopii. Wybierz plik .json pobrany z tej aplikacji, nie plik .zip ani Excel.");
  }
  if (backup?.format !== "stockly-backup" || !Array.isArray(backup.products) || !backup.products.length) {
    throw new Error("To nie jest prawidłowa kopia zapasowa aplikacji.");
  }
  if (!window.confirm(`Wczytać kopię zawierającą ${backup.products.length} produktów? Obecna lista zostanie zastąpiona.`)) return;

  const restored = backup.products.slice(0, PRODUCT_LIMIT).map((product) => ({
    id: product.id || crypto.randomUUID(),
    warehouseNumber: positiveWarehouseNumber(product.warehouseNumber),
    name: String(product.name || "Produkt"),
    category: String(product.category || "Inne").trim() || "Inne",
    machineType: typeof product.machineType === "string" ? product.machineType : "",
    manufacturer: String(product.manufacturer || ""),
    visibleToEmails: Array.isArray(product.visibleToEmails) ? product.visibleToEmails : [],
    visibleToCodes: Array.isArray(product.visibleToCodes) ? product.visibleToCodes : [],
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
  products = restored.sort(compareWarehouseProducts);
  currentProductId = products[0].id;
  protectLocalProductsFromCloud();
  saveProducts();
  renderProduct();
  renderProductsList();
  let imageWarning = "";
  try {
    await saveAllProductImages(restored);
  } catch (error) {
    imageWarning = " Zdjęcia mogły nie zmieścić się w pamięci tej przeglądarki.";
  }

  try {
    const cloudResult = await replaceCloudProducts(restored);
    if (cloudResult?.synced && cloudResult.cloudCount >= restored.length) {
      allowCloudProductsAgain();
    } else {
      protectLocalProductsFromCloud();
    }
    showToast(cloudResult?.synced && cloudResult.cloudCount >= restored.length
      ? `Kopia zapasowa przywrócona w chmurze: ${cloudResult.cloudCount} produktów.${imageWarning}`
      : `Kopia zapasowa przywrócona lokalnie: ${restored.length} produktów.${imageWarning} Chmura nadal ma ${cloudResult?.cloudCount ?? "brak"} produktów.`
    );
  } catch (error) {
    protectLocalProductsFromCloud();
    const reason = error?.message ? ` Powód: ${error.message}` : "";
    setSyncStatus("error", "Nie zapisano chmury");
    showToast(`Kopia przywrócona lokalnie, ale nie w chmurze.${imageWarning}${reason}`);
  }
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
clientsNavButton.addEventListener("click", (event) => {
  event.preventDefault();
  setView("clients");
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
exportShipmentsButton.addEventListener("click", exportShipmentsToExcel);
clientPreviewCodeSelect.addEventListener("change", renderClientsView);
addClientCodesCatalogButton.addEventListener("click", addClientCodesToCatalogOnly);
saveGlobalClientCodesButton.addEventListener("click", saveGlobalClientCodesForAllProducts);
downloadClientCodesSqlButton.addEventListener("click", downloadClientCodesRepairSql);
checkClientCodeCloudButton.addEventListener("click", checkSelectedClientCodeInCloud);
clearGlobalClientCodesButton.addEventListener("click", () => {
  globalClientCodesInput.value = "";
  saveGlobalClientCodesForAllProducts();
});
replaceClientCodeButton.addEventListener("click", replaceClientCodeEverywhere);
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
importExcelInput.addEventListener("click", () => pauseAutomaticCloudSync(120000));
importExcelInput.addEventListener("change", async () => {
  const file = importExcelInput.files[0];
  if (!file) return;
  localImportBusy = true;
  pauseAutomaticCloudSync(300000);
  setSyncStatus("", "Wczytywanie importu…");
  try {
    await importProductsFromExcel(file);
  } catch (error) {
    showToast(error.message);
  } finally {
    localImportBusy = false;
    pauseAutomaticCloudSync(300000);
    importExcelInput.value = "";
  }
});
clientOrderImportInput.addEventListener("click", () => pauseAutomaticCloudSync(120000));
clientOrderImportInput.addEventListener("change", async () => {
  const file = clientOrderImportInput.files[0];
  if (!file) return;
  pauseAutomaticCloudSync(300000);
  try {
    await importClientOrderFromExcel(file);
  } catch (error) {
    showToast(error.message);
  } finally {
    pauseAutomaticCloudSync(300000);
    clientOrderImportInput.value = "";
  }
});
restoreBackupInput.addEventListener("click", () => pauseAutomaticCloudSync(120000));
restoreBackupInput.addEventListener("change", async () => {
  const file = restoreBackupInput.files[0];
  if (!file) return;
  localImportBusy = true;
  pauseAutomaticCloudSync(300000);
  setSyncStatus("", "Wczytywanie kopii…");
  try {
    await restoreBackup(file);
  } catch (error) {
    showToast(error.message);
  } finally {
    localImportBusy = false;
    pauseAutomaticCloudSync(300000);
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
    showToast("Wylogowano. Zaloguj ponownie, żeby zapisywać w chmurze.");
    return;
  }
  if (!supabaseClient) {
    showToast("Nie załadowano połączenia Supabase. Odśwież stronę albo sprawdź plik vendor/supabase.min.js na GitHub.");
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

closeOrderRecipientModal.addEventListener("click", () => closeOrderRecipientDialog(null));
document.querySelectorAll("[data-close-order-recipient]").forEach((button) => {
  button.addEventListener("click", () => closeOrderRecipientDialog(null));
});
orderRecipientModal.addEventListener("click", (event) => {
  if (event.target === orderRecipientModal) closeOrderRecipientDialog(null);
});
orderRecipientForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const details = {
    recipientName: orderRecipientForm.elements.recipientName.value.trim(),
    recipientAddress: orderRecipientForm.elements.recipientAddress.value.trim(),
    contactPerson: orderRecipientForm.elements.contactPerson.value.trim(),
    phoneNumber: orderRecipientForm.elements.phoneNumber.value.trim(),
  };
  localStorage.setItem(ORDER_RECIPIENT_KEY, JSON.stringify(details));
  closeOrderRecipientDialog(details);
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseClient) {
    showToast("Brak połączenia Supabase. Odśwież stronę i sprawdź, czy wgrano folder vendor.");
    return;
  }
  const email = authForm.elements.email.value.trim();
  const password = authForm.elements.password.value;
  const button = authForm.querySelector("button[type='submit']");
  button.disabled = true;
  button.textContent = password ? "Logowanie…" : "Wysyłanie…";
  let error = null;
  if (password) {
    const result = await supabaseClient.auth.signInWithPassword({ email, password });
    error = result.error;
  } else {
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    const result = await supabaseClient.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    error = result.error;
  }
  button.disabled = false;
  button.textContent = "Zaloguj / wyślij link";
  if (error) {
    showToast(password
      ? `Nie udało się zalogować: ${error.message}`
      : `Nie udało się wysłać linku: ${error.message}`
    );
    return;
  }
  authModal.hidden = true;
  document.body.style.overflow = "";
  showToast(password ? "Zalogowano do chmury." : "Link do logowania został wysłany na e-mail.");
});

productsList.addEventListener("click", (event) => {
  if (event.target.closest(".row-client-code-select")) {
    event.stopPropagation();
    return;
  }
  const removeClientCodeButton = event.target.closest("[data-remove-client-code]");
  if (removeClientCodeButton) {
    event.stopPropagation();
    const product = products.find((item) => item.id === removeClientCodeButton.dataset.clientCodeProduct);
    if (!product) return;
    const codeToRemove = normalizeClientCode(removeClientCodeButton.dataset.removeClientCode);
    const nextCodes = (Array.isArray(product.visibleToCodes) ? product.visibleToCodes : [])
      .filter((code) => normalizeClientCode(code) !== codeToRemove);
    updateProductClientCodes(product.id, nextCodes);
    return;
  }
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

productsList.addEventListener("change", (event) => {
  const select = event.target.closest("[data-client-code-product]");
  if (!select) return;
  event.stopPropagation();
  const product = products.find((item) => item.id === select.dataset.clientCodeProduct);
  const code = select.value;
  if (!product || !code) return;
  const currentCodes = Array.isArray(product.visibleToCodes) ? product.visibleToCodes : [];
  if (currentCodes.some((item) => normalizeClientCode(item) === normalizeClientCode(code))) return;
  updateProductClientCodes(product.id, [...currentCodes, code]);
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
    if (!orderRecipientModal.hidden) closeOrderRecipientDialog(null);
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
    visibleToEmails: formMode === "new"
      ? []
      : (Array.isArray(getCurrentProduct().visibleToEmails) ? getCurrentProduct().visibleToEmails : []),
    visibleToCodes: parseClientCodes(data.get("clientCodes")),
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
  if (currentView === "clients") renderClientsView();
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
  if (currentUser && document.visibilityState === "visible" && canRunAutomaticCloudSync()) {
    loadCloudProducts({ quiet: true });
  }
}, 30000);
