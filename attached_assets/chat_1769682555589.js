const LANGUAGES = {
  ru: {
    code: 'ru',
    messages_not_yet: "Сообщений пока нет",
    messages_appear_here: "Как только вы получите сообщение, оно появится здесь.",
    if_you_sell: "Если вы что-то продаёте или оказываете услуги, начните с публикации объявления",
    if_you_buy: "Если вы что-то покупаете, начните с поиска интересующих объявлений",
    cart_empty: "Корзина пуста",
    deleted_messages_here: "Удалённые сообщения будут отображаться здесь.",
    recover_from_cart: "Чтобы восстановить сообщение — верните его из корзины"
  },
  kz: {
    code: 'kz',
    messages_not_yet: "Әзірге хабарламалар жоқ",
    messages_appear_here: "Хабарлама алған кезде, ол осында пайда болады.",
    if_you_sell: "Егер сіз бірдеңе сатсаңыз немесе қызмет көрсетсеңіз, хабарландыруды жариялаудан бастаңыз",
    if_you_buy: "Егер сіз бірдеңе сатып алсаңыз, қызықтыратын хабарландыруларды іздеуден бастаңыз",
    cart_empty: "Себет бос",
    deleted_messages_here: "Жойылған хабарламалар осында көрсетіледі.",
    recover_from_cart: "Хабарламаны қалпына келтіру үшін — оны себеттен қайтарыңыз"
  }
};

let currentLang = localStorage.getItem('ftcspectrum_lang') || 'ru';
function getLang() {
  return LANGUAGES[currentLang];
}

function updateContent() {
  const lang = getLang();
  const buyBtn = document.getElementById('buyBtn');
  const sellBtn = document.getElementById('sellBtn');
  const chatEmptyTitle = document.querySelector('.chat-empty-title');
  const chatEmptyDesc = document.querySelector('.chat-empty-desc');

  if (buyBtn.classList.contains('active')) {
    chatEmptyTitle.textContent = lang.messages_not_yet;
    chatEmptyDesc.innerHTML = `${lang.messages_appear_here}<br><br>${lang.if_you_sell}`;
  } else if (sellBtn.classList.contains('active')) {
    chatEmptyTitle.textContent = lang.messages_not_yet;
    chatEmptyDesc.innerHTML = `${lang.messages_appear_here}<br><br>${lang.if_you_buy}`;
  }
}

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

let topBtns = document.querySelectorAll('.chat-top-btn');
topBtns.forEach((btn, idx) => {
  btn.addEventListener('click', function() {
    const lang = getLang();
    topBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const chatEmptyTitle = document.querySelector('.chat-empty-title');
    const chatEmptyDesc = document.querySelector('.chat-empty-desc');
    if(idx === 0) {
        if (document.getElementById('buyBtn').classList.contains('active')){
            chatEmptyTitle.textContent = lang.messages_not_yet;
            chatEmptyDesc.innerHTML = `${lang.messages_appear_here}<br><br>${lang.if_you_sell}`;
        } else {
            chatEmptyTitle.textContent = lang.messages_not_yet;
            chatEmptyDesc.innerHTML = `${lang.messages_appear_here}<br><br>${lang.if_you_buy}`;
        }
    } else {
      chatEmptyTitle.textContent = lang.cart_empty;
      chatEmptyDesc.innerHTML = `${lang.deleted_messages_here}<br><br>${lang.recover_from_cart}`;
    }
  });
});

// Initial content update
updateContent();
