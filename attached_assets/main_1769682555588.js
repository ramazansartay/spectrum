function getUser() {
  let user = JSON.parse(localStorage.getItem('ftc_user'));
  if (!user) {
    user = {
      name: 'Пользователь',
      location: 'Город',
      contact: 'Контакт',
      team: 'Команда'
    };
    localStorage.setItem('ftc_user', JSON.stringify(user));
  }
  return user;
}

const CATEGORIES = [
  { name: 'Hubs & Electronics', icon: '🔌', sub: '4 товара' },
  { name: 'Моторы', icon: '⚙️', sub: '6 товаров' },
  { name: 'Сервоприводы', icon: '🎯', sub: '3 товара' },
  { name: 'Structure (GoBilda)', icon: '🏗️', sub: '15 товаров' },
  { name: 'Structure (REV)', icon: '🏗️', sub: '12 товаров' },
  { name: 'Колеса', icon: '🛞', sub: '8 товаров' },
  { name: 'Датчики', icon: '📡', sub: '5 товаров' },
  { name: 'Провода / Кабели', icon: '🔗', sub: '7 товаров' },
  { name: 'Инструменты', icon: '🔧', sub: '9 товаров' },
  { name: 'Комплекты (Kits)', icon: '📦', sub: '11 товаров' }
];

window.renderCategories = function() {
  const catContainer = document.getElementById('categories');
  if (!catContainer) return;
  
  catContainer.innerHTML = CATEGORIES.map(cat => `
    <div class="category" onclick="selectCategory('${cat.name}')">
      <div class="icon-wrap">${cat.icon}</div>
      <div class="cat-name">${cat.name}</div>
      <div class="cat-sub">${cat.sub}</div>
    </div>
  `).join('');
};

function selectCategory(catName) {
  window.location.href = `search.html?cat=${encodeURIComponent(catName)}`;
}

document.addEventListener('DOMContentLoaded', function() {
  const burger = document.getElementById('burgerBtn');
  const nav = document.getElementById('mainNav');
  
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    
    nav.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-btn') || e.target.classList.contains('post-ad')) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const profileBtn = document.getElementById('profileBtn');
  const msgBtn = document.getElementById('msgBtn');
  const adBtn = document.getElementById('adBtn');
  const langBtn = document.getElementById('langBtn');

  if (profileBtn) profileBtn.onclick = () => window.location.href = 'profile.html';
  if (msgBtn) msgBtn.onclick = () => window.location.href = 'chat.html';
  if (adBtn) adBtn.onclick = () => window.location.href = 'create.html';
  if (langBtn) langBtn.onclick = () => alert('Переключение языка (демо)');

  if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    if (window.renderCategories) window.renderCategories();
  }
});

window.renderPosts = function() {
  const postsList = document.getElementById('postsList');
  if (!postsList) return;

  const posts = JSON.parse(localStorage.getItem('spectrum_posts')) || [];
  const recentPosts = posts.slice(-6).reverse();

  if (recentPosts.length === 0) {
    postsList.innerHTML = '<div class="no-posts">Объявлений пока нет. Будьте первым!</div>';
    return;
  }

  postsList.innerHTML = recentPosts.map(post => `
    <div class="post-card" onclick="viewPost(${post.id})">
      <div style="display:flex; gap:15px;">
        ${post.images && post.images[0] ? `<img src="${post.images[0]}" style="width:100px; height:80px; object-fit:cover; border-radius:6px; flex-shrink:0;">` : ''}
        <div style="flex:1; min-width:0;">
          <h3 class="post-title" style="margin:0 0 4px 0; font-size:16px;">${post.name}</h3>
          <span class="post-cat">${post.cat}</span>
          <div class="post-price" style="margin-top:6px;">${post.price}</div>
          <div style="font-size:12px; color:#666; margin-top:4px;">${post.location} • ${post.date}</div>
        </div>
      </div>
    </div>
  `).join('');
};

function viewPost(id) {
  alert(`Пост #${id} (детали в разработке)`);
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('postsList')) {
    window.renderPosts();
  }
});