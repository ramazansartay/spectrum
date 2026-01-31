
import './App.css';

function App() {
  return (
    <>
      <header className="main-header">
        <span className="logo" style={{ cursor: 'pointer' }}>FTC Spectrum</span>
        <button className="burger" id="burgerBtn"><span></span><span></span><span></span></button>
        <nav id="mainNav" className="nav">
          <button className="nav-btn" id="langBtn">Рус</button>
          <button className="nav-btn" id="msgBtn">Чат</button>
          <button className="nav-btn" id="profileBtn">Профиль</button>
          <button className="post-ad" id="adBtn">Подать объявление</button>
        </nav>
      </header>

      <section className="search-section">
        <form className="search-form" id="searchForm" autoComplete="off" role="search" aria-label="Поиск">
          <input type="text" className="search-box" id="searchInput" placeholder="Поиск детали" aria-label="Поиск детали" defaultValue="" />
          <button className="search-btn" type="submit" id="searchSubmitBtn">Поиск</button>
        </form>
      </section>

      <main>
        <div id="categoriesView">
          <h2 className="sections-title">Категории запчастей FTC</h2>
          <section>
            <div className="categories" id="categories" role="listbox" aria-label="Категории"></div>
          </section>

          <section className="posts-section">
            <h3 className="posts-title">Новые объявления</h3>
            <div className="posts-list" id="postsList"></div>
          </section>
        </div>

        <div id="searchView" style={{ display: 'none' }}>
          <div className="search-page">
            <div className="search-filters">
              <h3 className="filters-title">Фильтры</h3>

              <div className="filter-group">
                <label className="filter-label">Категория</label>
                <select id="categoryFilter" className="filter-select">
                  <option value="">Все категории</option>
                  <option value="Hubs & Electronics">Hubs & Electronics</option>
                  <option value="Моторы">Моторы</option>
                  <option value="Сервоприводы">Сервоприводы</option>
                  <option value="Structure (GoBilda)">Structure (GoBilda)</option>
                  <option value="Structure (REV)">Structure (REV)</option>
                  <option value="Колеса">Колеса</option>
                  <option value="Датчики">Датчики</option>
                  <option value="Провода / Кабели">Провода / Кабели</option>
                  <option value="Инструменты">Инструменты</option>
                  <option value="Комплекты (Kits)">Комплекты (Kits)</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Сортировка</label>
                <select id="sortFilter" className="filter-select">
                  <option value="recent">По новизне</option>
                  <option value="price-asc">Цена: возрастание</option>
                  <option value="price-desc">Цена: убывание</option>
                  <option value="popular">Популярное</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Цена (₸)</label>
                <div className="price-range">
                  <input type="number" id="minPrice" className="price-input" placeholder="От" min="0" />
                  <input type="number" id="maxPrice" className="price-input" placeholder="До" min="0" />
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Город</label>
                <select id="cityFilter" className="filter-select">
                  <option value="">Все города</option>
                  <option value="Алматы">Алматы</option>
                  <option value="Астана">Астана</option>
                  <option value="Актау">Актау</option>
                  <option value="Актобе">Актобе</option>
                  <option value="Атырау">Атырау</option>
                  <option value="Байконур">Байконур</option>
                  <option value="Караганда">Караганда</option>
                  <option value="Кокшетау">Кокшетау</option>
                  <option value="Костанай">Костанай</option>
                  <option value="Кызылорда">Кызылорда</option>
                  <option value="Лисаковск">Лисаковск</option>
                  <option value="Павлодар">Павлодар</option>
                  <option value="Петропавловск">Петропавловск</option>
                  <option value="Рудный">Рудный</option>
                  <option value="Семей">Семей</option>
                  <option value="Талдыкорган">Талдыкорган</option>
                  <option value="Тараз">Тараз</option>
                  <option value="Туркестан">Туркестан</option>
                  <option value="Уральск">Уральск</option>
                  <option value="Усть-Каменогорск">Усть-Каменогорск</option>
                  <option value="Шымкент">Шымкент</option>
                  <option value="Экибастуз">Экибастуз</option>
                </select>
                <div className="city-selected" id="citySelected" style={{ display: 'none', marginTop: '8px', padding: '6px 10px', background: '#e3f1ff', borderRadius: '6px', fontSize: '0.9em', color: '#0066cc' }}>
                  Выбран город: <strong id="citySelectedText"></strong>
                </div>
              </div>

              <button type="button" className="search-btn apply-filters-btn" id="applyFiltersBtn" style={{ width: '100%', marginTop: '20px' }}>Применить фильтры</button>
              <button type="button" className="search-btn reset-filters-btn" id="resetFiltersBtn" style={{ width: '100%', marginTop: '8px' }}>Очистить</button>
              <button type="button" className="search-btn back-btn" id="backToCategoriesBtn" style={{ width: '100%', marginTop: '8px' }}>← Вернуться</button>
            </div>

            <div className="search-results">
              <div className="results-header">
                <h2 id="resultsTitle">Результаты поиска</h2>
                <span className="results-count" id="resultsCount">0 результатов</span>
              </div>
              <div className="posts-list" id="searchPostsList"></div>
              <div className="no-posts" id="noResultsMsg" style={{ display: 'none' }}>
                По вашему запросу ничего не найдено. Попробуйте изменить критерии поиска.
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
