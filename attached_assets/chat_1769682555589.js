const LANGUAGES = {
  ru: {
    code: 'ru',
    pageTitle: "Чат",
    buyBtn: "Покупаю",
    sellBtn: "Продаю",
    allBtn: "Все",
    deletedBtn: "Удаленные",
    emptyTitle: "Сообщений пока нет",
    emptyDescSell: "Как только вы получите сообщение, оно появится здесь.<br><br>Если вы что-то продаёте или оказываете услуги,<br>начните с публикации объявления",
    emptyDescBuy: "Как только вы получите сообщение, оно появится здесь.<br><br>Если вы что-то покупаете, начните с поиска интересующих объявлений",
    cartEmptyTitle: "Корзина пуста",
    cartEmptyDesc: "Удалённые сообщения будут отображаться здесь.<br><br>Чтобы восстановить сообщение — верните его из корзины"
  },
  kz: {
    code: 'kz',
    pageTitle: "Чат",
    buyBtn: "Сатып аламын",
    sellBtn: "Сатамын",
    allBtn: "Барлығы",
    deletedBtn: "Жойылғандар",
    emptyTitle: "Әзірге хабарламалар жоқ",
    emptyDescSell: "Хабарлама алған кезде, ол осында пайда болады.<br><br>Егер сіз бірдеңе сатсаңыз немесе қызмет көрсетсеңіз,<br>хабарландыруды жариялаудан бастаңыз",
    emptyDescBuy: "Хабарлама алған кезде, ол осында пайда болады.<br><br>Егер сіз бірдеңе сатып алсаңыз,<br>қызықтыратын хабарландыруларды іздеуден бастаңыз",
    cartEmptyTitle: "Себет бос",
    cartEmptyDesc: "Жойылған хабарламалар осында көрсетіледі.<br><br>Хабарламаны қалпына келтіру үшін — оны себеттен қайтарыңыз"
  }
};

let currentLang = localStorage.getItem('ftcspectrum_lang') || 'ru';

function getLang() {
  return LANGUAGES[currentLang];
}

function updateContent() {
  const lang = getLang();
  
  // Update static content
  document.getElementById('pageTitle').textContent = lang.pageTitle;
  document.getElementById('buyBtn').textContent = lang.buyBtn;
  document.getElementById('sellBtn').textContent = lang.sellBtn;
  document.getElementById('allBtn').textContent = lang.allBtn;
  document.getElementById('deletedBtn').textContent = lang.deletedBtn;

  // Update dynamic content based on active tabs
  const isBuyActive = document.getElementById('buyBtn').classList.contains('active');
  const isAllActive = document.getElementById('allBtn').classList.contains('active');
  const emptyTitleEl = document.getElementById('emptyTitle');
  const emptyDescEl = document.getElementById('emptyDesc');

  if (isAllActive) {
    emptyTitleEl.textContent = lang.emptyTitle;
    if (isBuyActive) {
      emptyDescEl.innerHTML = lang.emptyDescBuy;
    } else {
      emptyDescEl.innerHTML = lang.emptyDescSell;
    }
  } else {
    emptyTitleEl.textContent = lang.cartEmptyTitle;
    emptyDescEl.innerHTML = lang.cartEmptyDesc;
  }
}

function setupEventListeners() {
  document.getElementById('buyBtn').addEventListener('click', function() {
    document.getElementById('buyBtn').classList.add('active');
    document.getElementById('sellBtn').classList.remove('active');
    updateContent();
  });

  document.getElementById('sellBtn').addEventListener('click', function() {
    document.getElementById('sellBtn').classList.add('active');
    document.getElementById('buyBtn').classList.remove('active');
    updateContent();
  });

  document.querySelectorAll('.chat-top-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.chat-top-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateContent();
    });
  });
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateContent();
});
