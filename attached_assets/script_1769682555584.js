'use strict';

// ==========================
// Языковые настройки
// ==========================
const LANGUAGES = {
  ru: {
    name: 'Рус',
    mainTitle: "Категории запчастей FTC",
    newPosts: "Новые объявления",
    searchPlaceholder: "Поиск детали",
    btnProfile: "Профиль",
    btnChat: "Чат",
    btnPost: "Подать объявление",
    profilePage: 'profile.html',
    chatPage: 'chat.html',
    createPage: 'create.html',
    all: "Все",
    allSub: "Категории запчастей FTC",
    noPosts: "Объявления не найдены.",
    city: "Город",
    contact: "Контакт",
    resSearch: q => `Результаты поиска: "${q}"`
  },
  kz: {
    name: 'Қаз',
    mainTitle: "FTC бөлшектері категориялары",
    newPosts: "Жаңа хабарламалар",
    searchPlaceholder: "Бөлшекті іздеу",
    btnProfile: "Профиль",
    btnChat: "Чат",
    btnPost: "Хабарландыру беру",
    profilePage: 'profile.kz.html',
    chatPage: 'chat.kz.html',
    createPage: 'create.kz.html',
    all: "Барлығы",
    allSub: "FTC бөлшектері категориялары",
    noPosts: "Хабарландыру табылмады.",
    city: "Қала",
    contact: "Байланыс",
    resSearch: q => `Іздеу нәтижесі: "${q}"`
  }
};

let currentLang = localStorage.getItem('ftcspectrum_lang') || 'ru';
function getL() { return LANGUAGES[currentLang]; }

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('ftcspectrum_lang', lang);
  renderAll();
}

// ==========================
// Категории
const categories = [
  {
    name: { ru: "Hubs & Electronics", kz: "Hubs & Electronics" },
    icon: `⚡`,
    sub: { ru: "Контроллеры и электроника", kz: "Электроника" },
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    name: { ru: "Моторы", kz: "Моторлар" },
    icon: `
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25.3876" cy="29.2749" r="5.8826" fill="#D0CFCE"/>
    <circle cx="27.4098" cy="46.11" r="4.0443" fill="#D0CFCE"/>
    <circle cx="44.3223" cy="36.0232" r="7.8499" fill="#D0CFCE"/>
    <path fill="#FFFFFF" d="M20.75,15.9438c0-1.5947,1.1753-2.8875,2.625-2.8875S26,14.349,26,15.9438"/>
    <path fill="#FFFFFF" d="M28.625,15.9438c0-1.5947,1.1753-2.8875,2.625-2.8875s2.625,1.2928,2.625,2.8875"/>
    <path fill="#FFFFFF" d="M36.5,15.9438c0-1.5947,1.1753-2.8875,2.625-2.8875s2.625,1.2928,2.625,2.8875"/>
    <path fill="#FFFFFF" d="M44.375,15.9438c0-1.5947,1.1753-2.8875,2.625-2.8875s2.625,1.2928,2.625,2.8875"/>
  </g>
  <g id="hair"/>
  <g id="skin"/>
  <g id="skin-shadow"/>
  <g id="line">
    <polygon fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" points="16.5637,17.0645 54.2492,17.0645 57.3744,27.9106 60.1319,27.9106 60.1319,41.9967 56.9608,41.9967 50.3888,56.979 19.2293,56.979 13.2547,42.7701 11.0487,42.7701 11.0487,26.5319 13.2547,26.5319"/>
    <circle cx="25.3876" cy="29.2749" r="5.8826" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
    <circle cx="27.4098" cy="46.11" r="4.0443" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
    <circle cx="44.3223" cy="36.0232" r="7.8499" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
    <line x1="25.3876" x2="44.3223" y1="23.3923" y2="28.1732" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>
    <path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M19.505,29.2749c0,0,2.2519,14.9967,3.8605,18.4436c1.6085,3.4468,4.0443,2.4358,4.0443,2.4358 c4.0443-0.3677,20.9103-7.3842,20.9103-7.3842"/>
    <path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M20.75,15.9438c0-1.5947,1.1753-2.8875,2.625-2.8875S26,14.349,26,15.9438"/>
    <path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M28.625,15.9438c0-1.5947,1.1753-2.8875,2.625-2.8875s2.625,1.2928,2.625,2.8875"/>
    <path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M36.5,15.9438c0-1.5947,1.1753-2.8875,2.625-2.8875s2.625,1.2928,2.625,2.8875"/>
    <path fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M44.375,15.9438c0-1.5947,1.1753-2.8875,2.625-2.8875s2.625,1.2928,2.625,2.8875"/>
  </g>
</svg>
    `,
    sub: { ru: "Двигатели FTC", kz: "FTC қозғалтқыштары" },
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  {
    name: { ru: "Structure (GoBilda)", kz: "Құрылым (GoBilda)" },
    icon: `📐`,
    sub: { ru: "GoBilda", kz: "GoBilda" },
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
  },
  {
    name: { ru: "Structure (REV)", kz: "Құрылым (REV)" },
    icon: `🏗️`,
    sub: { ru: "REV", kz: "REV" },
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
  },
  {
    name: { ru: "Колеса", kz: "Дөңгелектер" },
    icon: `
<svg width="64" height="64" viewBox="0 0 508 508" xmlns="http://www.w3.org/2000/svg">
<path style="fill:#56ACE0;" d="M254,28.3C129.5,28.3,28.2,129.5,28.2,254S129.5,479.8,254,479.8S479.8,378.5,479.8,254
  S378.5,28.3,254,28.3z"/>
<path style="fill:#FFC10D;" d="M254,120.8c-73.4,0-133.2,59.7-133.2,133.2S180.6,387.2,254,387.2S387.2,327.5,387.2,254
  S327.4,120.8,254,120.8z"/>
<path style="fill:#FFFFFF;" d="M254,229.1c-13.8,0-24.9,11.2-24.9,24.9c0,13.8,11.2,24.9,24.9,24.9c13.8,0,24.9-11.2,24.9-24.9
  C278.9,240.3,267.8,229.1,254,229.1z"/>
<g>
  <path style="fill:#194F82;" d="M254,0C113.9,0,0,113.9,0,254s113.9,254,254,254s254-113.9,254-254S394.1,0,254,0z M254,479.8
    C129.5,479.8,28.2,378.5,28.2,254S129.5,28.2,254,28.2S479.8,129.5,479.8,254S378.5,479.8,254,479.8z"/>
  <path style="fill:#194F82;" d="M254,92.6C165,92.6,92.6,165,92.6,254S165,415.4,254,415.4S415.4,343,415.4,254S343,92.6,254,92.6z
     M254,387.2c-73.4,0-133.2-59.7-133.2-133.2S180.6,120.8,254,120.8S387.2,180.6,387.2,254S327.4,387.2,254,387.2z"/>
  <path style="fill:#194F82;" d="M254,200.8c-29.3,0-53.2,23.8-53.2,53.2s23.9,53.2,53.2,53.2s53.2-23.8,53.2-53.2
    S283.3,200.8,254,200.8z M254,278.9c-13.8,0-24.9-11.2-24.9-24.9c0-13.8,11.2-24.9,24.9-24.9c13.8,0,24.9,11.2,24.9,24.9
    C278.9,267.8,267.8,278.9,254,278.9z"/>
  <circle style="fill:#194F82;" cx="254" cy="161.3" r="17.4"/>
  <circle style="fill:#194F82;" cx="254" cy="346.7" r="17.4"/>
  <circle style="fill:#194F82;" cx="346.7" cy="254" r="17.4"/>
  <circle style="fill:#194F82;" cx="161.3" cy="254" r="17.4"/>
  <circle style="fill:#194F82;" cx="319.5" cy="188.5" r="17.4"/>
  <circle style="fill:#194F82;" cx="188.5" cy="319.5" r="17.4"/>
  <circle style="fill:#194F82;" cx="319.5" cy="319.5" r="17.4"/>
  <circle style="fill:#194F82;" cx="188.5" cy="188.5" r="17.4"/>
</g>
</svg>
    `,
    sub: { ru: "Omni / Drive", kz: "Omni / Drive" },
    gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
  },
  {
    name: { ru: "Датчики", kz: "Датчиктер" },
    icon: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
   viewBox="0 0 512 512" xml:space="preserve">
<rect x="222.242" y="227.868" style="fill:#14858A;" width="67.516" height="101.275"/>
<path style="fill:#41BBBE;" d="M512,227.868c0,12.378-10.127,22.505-22.505,22.505H22.505C10.127,250.374,0,240.246,0,227.868
  v-90.022c0-12.378,10.127-22.505,22.505-22.505h466.989c12.378,0,22.505,10.127,22.505,22.505V227.868z"/>
<polygon style="fill:#71CCCE;" points="108.263,396.659 403.737,396.659 403.737,362.901 256,340.396 108.263,362.901 "/>
<polygon style="fill:#41BBBE;" points="175.779,306.637 108.263,362.901 403.737,362.901 336.221,306.637 "/>
<g>
  <circle style="fill:#06484A;" cx="205.363" cy="182.857" r="33.758"/>
  <circle style="fill:#06484A;" cx="306.637" cy="182.857" r="33.758"/>
  <circle style="fill:#06484A;" cx="67.516" cy="182.857" r="33.758"/>
</g>
<circle style="fill:#086063;" cx="136.44" cy="182.857" r="8.44"/>
</svg>`,
    sub: { ru: "IMU / Color", kz: "IMU / Color" },
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  },
  {
    name: { ru: "Провода / Кабели", kz: "Сымдар / Кабельдер" },
    icon: `🔌`,
    sub: { ru: "Кабели", kz: "Кабельдер" },
    gradient: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)"
  },
  {
    name: { ru: "Инструменты", kz: "Құралдар" },
    icon: `🛠️`,
    sub: { ru: "Инструмент", kz: "Құрал" },
    gradient: "linear-gradient(135deg, #2e2e78 0%, #662d8c 100%)"
  },
  {
    name: { ru: "Комплекты (Kits)", kz: "Жинақтар (Kits)" },
    icon: `📦`,
    sub: { ru: "Наборы", kz: "Жинақтар" },
    gradient: "linear-gradient(135deg, #ff6b6b 0%, #ffa94d 100%)"
  }
];

// ==========================
// Универсальная функция для иконок
// ==========================
function createIcon(icon, size = 40) {
  const wrapper = document.createElement("div");
  wrapper.style.display = "inline-flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";

  if (icon.trim().startsWith("<svg")) {
    wrapper.innerHTML = icon;
    const svg = wrapper.querySelector("svg");
    if (svg) {
      svg.setAttribute("width", size);
      svg.setAttribute("height", size);
    }
  } else {
    wrapper.textContent = icon;
    wrapper.style.fontSize = size + "px";
  }

  return wrapper;
}

// ==========================
// Работа с объявлениями
// ==========================
function loadPosts() {
  try {
    return JSON.parse(localStorage.getItem('spectrum_posts')) || [
      { name: "Control Hub V2", cat: "Hubs & Electronics", location: "Алматы", user: "11111", price: "35000₸", desc: "", images: [] }
    ];
  } catch { return []; }
}

function savePosts() { localStorage.setItem('spectrum_posts', JSON.stringify(posts)); }

let posts = loadPosts();
let currentCat = getL().all;
let currentSearch = "";

// ==========================
// Рендеринг
// ==========================
function renderAll() {
  // Кнопки и тексты
  document.getElementById("langBtn").textContent = getL().name;
  document.getElementById("profileBtn").textContent = getL().btnProfile;
  document.getElementById("msgBtn").textContent = getL().btnChat;
  document.getElementById("adBtn").textContent = getL().btnPost;
  document.getElementById("searchInput").placeholder = getL().searchPlaceholder;

  // Навигация
  document.getElementById("profileBtn").onclick = () => window.location.href = getL().profilePage;
  document.getElementById("msgBtn").onclick = () => window.location.href = getL().chatPage;
  document.getElementById("adBtn").onclick = () => window.location.href = getL().createPage;
  document.getElementById("langBtn").onclick = () => setLang(currentLang === 'ru' ? 'kz' : 'ru');

  // Заголовки
  document.getElementById("sectionTitle").textContent = getL().mainTitle;
  document.getElementById("postsTitle").textContent = getL().newPosts;

  // Категории
  const categoriesBox = document.getElementById("categories");
  if(categoriesBox) {
    categoriesBox.innerHTML = `
      <button class="category category-all selected" type="button" data-cat="${getL().all}">
        <div class="icon-wrap">🔎</div>
        <div class="cat-name">${getL().all}</div>
        <div class="cat-sub">${getL().allSub}</div>
      </button>`;
    
    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "category";
      btn.type = "button";
      btn.dataset.cat = cat.name[currentLang];
      btn.innerHTML = `
        <div class="icon-wrap"></div>
        <div class="cat-name">${cat.name[currentLang]}</div>
        <div class="cat-sub">${cat.sub[currentLang]}</div>
      `;
      // Вставляем иконку 
      const iconEl = createIcon(cat.icon, 45);
      btn.querySelector(".icon-wrap").appendChild(iconEl);

      categoriesBox.appendChild(btn);
    });

    // Обработка клика по категории
    categoriesBox.querySelectorAll('.category').forEach(btn => {
      btn.onclick = function() {
        categoriesBox.querySelectorAll('.category').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        currentCat = btn.dataset.cat;
        document.getElementById("sectionTitle").textContent = currentCat === getL().all ? getL().mainTitle : `${getL().mainTitle}: ${currentCat}`;
        document.getElementById("postsTitle").textContent = currentCat === getL().all ? getL().newPosts : `${getL().newPosts}: ${currentCat}`;
        renderPosts();
      };
    });
  }

  renderPosts();
}

function renderPosts() {
  let filtered = posts;
  if(currentCat && currentCat !== getL().all) filtered = filtered.filter(p => p.cat === currentCat);
  if(currentSearch) filtered = filtered.filter(p => p.name.toLowerCase().includes(currentSearch));

  const postsList = document.getElementById("postsList");
  if (!filtered.length) {
    postsList.innerHTML = `<div class="no-posts">${getL().noPosts}</div>`;
    return;
  }

  postsList.innerHTML = filtered.map(post => `
    <div class="post-card">
      ${post.images && post.images.length > 0 ? `<img src="${post.images[0]}" style="max-width:120px;max-height:90px;border-radius:7px;margin-bottom:8px;">` : ''}
      <div class="post-title">${post.name}</div>
      <div class="post-cat">${post.cat}</div>
      <div class="post-info">
        ${post.location ? getL().city + ": " + post.location + " | " : ""}${getL().contact}: ${post.user}
      </div>
      <div class="post-price">${post.price || ""}</div>
      ${post.desc ? `<div class="post-desc" style="margin-top:7px;color:#333;font-size:16px;">${post.desc.replace(/</g,"&lt;")}</div>` : ""}
    </div>
  `).join('');
}

// ==========================
// Инициализация
// ==========================
document.addEventListener("DOMContentLoaded", function() {
  renderAll();

  document.getElementById('searchForm').addEventListener('submit', function(e){
    e.preventDefault();
    currentSearch = document.getElementById('searchInput').value.trim().toLowerCase();
    document.getElementById("sectionTitle").textContent = currentSearch ? getL().resSearch(document.getElementById('searchInput').value.trim()) : getL().mainTitle;
    document.getElementById("postsTitle").textContent = getL().newPosts;
    renderPosts();
  });

  const burgerBtn = document.getElementById("burgerBtn");
  const mainNav = document.getElementById("mainNav");
  if(burgerBtn) burgerBtn.onclick = () => mainNav.classList.toggle('open');
});
