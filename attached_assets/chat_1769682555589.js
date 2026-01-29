document.getElementById('buyBtn').addEventListener('click', function() {
  document.getElementById('buyBtn').classList.add('active');
  document.getElementById('sellBtn').classList.remove('active');
  document.querySelector('.chat-empty-title').textContent = "Сообщений пока нет";
  document.querySelector('.chat-empty-desc').innerHTML = `Как только вы получите сообщение, оно появится здесь.<br><br>
    Если вы что-то продаёте или оказываете услуги,<br>начните с публикации объявления`;
});

document.getElementById('sellBtn').addEventListener('click', function() {
  document.getElementById('sellBtn').classList.add('active');
  document.getElementById('buyBtn').classList.remove('active');
  document.querySelector('.chat-empty-title').textContent = "Сообщений пока нет";
  document.querySelector('.chat-empty-desc').innerHTML = `Как только вы получите сообщение, оно появится здесь.<br><br>
    Если вы что-то покупаете, начните с поиска интересующих объявлений`;
});

let topBtns = document.querySelectorAll('.chat-top-btn');
topBtns.forEach((btn, idx) => {
  btn.addEventListener('click', function() {
    topBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if(idx === 0) {
      document.querySelector('.chat-empty-title').textContent = "Сообщений пока нет";
      document.querySelector('.chat-empty-desc').innerHTML = `Как только вы получите сообщение, оно появится здесь.<br><br>
      Если вы что-то продаёте или оказываете услуги,<br>начните с публикации объявления`;
    } else {
      document.querySelector('.chat-empty-title').textContent = "Корзина пуста";
      document.querySelector('.chat-empty-desc').innerHTML = `Удалённые сообщения будут отображаться здесь.<br><br>
      Чтобы восстановить сообщение — верните его из корзины`;
    }
  });
});