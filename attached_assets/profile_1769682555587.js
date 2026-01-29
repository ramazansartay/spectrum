const LANGUAGES = {
  ru: {
    code: 'ru',
    name: 'Рус',
    mainTitle: "Категории запчастей FTC",
    newPosts: "Новые объявления",
    searchPlaceholder: "Поиск детали",
    btnProfile: "Профиль",
    btnChat: "Чат",
    btnPost: "Подать объявление",
    profilePage: 'profile.html',
    chatPage: 'chat.html',
    createPage: 'create.html'
  },
  kz: {
    code: 'kz',
    name: 'Қаз',
    mainTitle: "FTC бөлшектері категориялары",
    newPosts: "Жаңа хабарламалар",
    searchPlaceholder: "Бөлшекті іздеу",
    btnProfile: "Профиль (KZ)",
    btnChat: "Чат (KZ)",
    btnPost: "Хабарландыру беру",
    profilePage: 'profile.kz.html',
    chatPage: 'chat.kz.html',
    createPage: 'create.kz.html'
  }
};

let currentLang = localStorage.getItem('ftcspectrum_lang') || 'ru';
function getLang() {
  return LANGUAGES[currentLang];
}

const categories = [
  { name: {ru: "Hubs & Electronics", kz: "Hubs & Electronics"}, icon: "⚡️", sub: {ru:"Контроллеры и электроника", kz:"Электроника"} },
  { name: {ru: "Моторы", kz: "Моторлар"}, icon: "🌀", sub: {ru:"Двигатели FTC", kz:"FTC қозғалтқыштары"} }
];

function setLang(lang){
  currentLang = lang;
  localStorage.setItem('ftcspectrum_lang', lang);
  renderAll();
}

function renderAll() {
  document.getElementById("langBtn").textContent = getLang().name;
  document.getElementById("profileBtn").textContent = getLang().btnProfile;
  document.getElementById("msgBtn").textContent = getLang().btnChat;
  document.getElementById("adBtn").textContent = getLang().btnPost;
  document.getElementById("sectionTitle").textContent = getLang().mainTitle;
  document.getElementById("postsTitle").textContent = getLang().newPosts;
  document.getElementById("searchInput").placeholder = getLang().searchPlaceholder;
  document.getElementById("profileBtn").onclick = function() { window.location.href = getLang().profilePage; };
  document.getElementById("msgBtn").onclick = function() { window.location.href = getLang().chatPage; };
  document.getElementById("adBtn").onclick = function() { window.location.href = getLang().createPage; };
  document.getElementById("langBtn").onclick = function() { setLang(currentLang === 'ru' ? 'kz' : 'ru'); };

  let categoriesBox = document.getElementById("categories");
  if(categoriesBox){
    categoriesBox.innerHTML = `<button class="category category-all selected" type="button" data-cat="Все"><div class="icon-wrap">🔎</div><div class="cat-name">Все</div><div class="cat-sub">${getLang().mainTitle}</div></button>`;
    categories.forEach(cat => {
      categoriesBox.insertAdjacentHTML("beforeend", `
        <button class="category" type="button" data-cat="${cat.name[currentLang]}">
          <div class="icon-wrap">${cat.icon}</div>
          <div class="cat-name">${cat.name[currentLang]}</div>
          <div class="cat-sub">${cat.sub[currentLang]}</div>
        </button>
      `);
    });
  }
}

document.addEventListener("DOMContentLoaded", function() {
  renderAll();
}); 