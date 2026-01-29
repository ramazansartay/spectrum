document.addEventListener('DOMContentLoaded', () => {
  const posts = JSON.parse(localStorage.getItem('spectrum_posts')) || [];
  const params = new URLSearchParams(window.location.search);
  
  const searchView = document.getElementById('searchView');
  const catView = document.getElementById('categoriesView');
  const resultsList = document.getElementById('searchPostsList');
  const inputs = {
    q: document.getElementById('searchInput'),
    cat: document.getElementById('categoryFilter'),
    city: document.getElementById('cityFilter'),
    priceMin: document.getElementById('minPrice'),
    priceMax: document.getElementById('maxPrice')
  };

  const query = params.get('q');
  const category = params.get('cat');

  if (query || category) {
    if(catView) catView.style.display = 'none';
    if(searchView) searchView.style.display = 'block';
    
    if(query) inputs.q.value = query;
    if(category) inputs.cat.value = category;
    
    performSearch();
  } else {
    if(window.renderCategories) window.renderCategories();
  }

  document.getElementById('applyFiltersBtn').onclick = performSearch;
  
  document.getElementById('resetFiltersBtn').onclick = () => {
    inputs.q.value = '';
    inputs.cat.value = '';
    inputs.city.value = '';
    inputs.priceMin.value = '';
    inputs.priceMax.value = '';
    performSearch();
  };
  
  document.getElementById('backToCategoriesBtn').onclick = () => {
    window.location.href = 'search.html';
  };

  function performSearch() {
    const q = inputs.q.value.toLowerCase();
    const cat = inputs.cat.value;
    const city = inputs.city.value.toLowerCase();
    const min = parseFloat(inputs.priceMin.value) || 0;
    const max = parseFloat(inputs.priceMax.value) || Infinity;

    const filtered = posts.filter(p => {
      const pPrice = parseFloat(p.price.replace(/[^\d]/g, '')) || 0;
      const matchText = !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      const matchCat = !cat || p.cat === cat;
      const matchCity = !city || p.location.toLowerCase().includes(city);
      const matchPrice = pPrice >= min && pPrice <= max;
      
      return matchText && matchCat && matchCity && matchPrice;
    });

    renderResults(filtered);
  }

  function renderResults(arr) {
    document.getElementById('resultsCount').textContent = `${arr.length} результатов`;
    
    if(arr.length === 0) {
      resultsList.innerHTML = '';
      document.getElementById('noResultsMsg').style.display = 'block';
      return;
    }
    
    document.getElementById('noResultsMsg').style.display = 'none';
    resultsList.innerHTML = arr.map(post => `
      <div class="post-card">
        <div style="display:flex; gap:15px;">
           ${post.images[0] ? `<img src="${post.images[0]}" style="width:100px; height:80px; object-fit:cover; border-radius:6px;">` : ''}
           <div>
             <h3 class="post-title" style="font-size:16px; margin-bottom:4px;">${post.name}</h3>
             <div class="post-price">${post.price}</div>
             <div style="font-size:12px; color:#666;">${post.location} • ${post.cat}</div>
           </div>
        </div>
      </div>
    `).join('');
  }
});