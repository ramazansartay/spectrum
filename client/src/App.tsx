
import './App.css';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ru' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <>
      <header className="main-header">
        <span className="logo" style={{ cursor: 'pointer' }}>{t('ftcMarketplace')}</span>
        <button className="burger" id="burgerBtn"><span></span><span></span><span></span></button>
        <nav id="mainNav" className="nav">
          <button className="nav-btn" id="langBtn" onClick={changeLanguage}>{i18n.language === 'en' ? 'Рус' : 'Eng'}</button>
          <button className="nav-btn" id="msgBtn">{t('messages')}</button>
          <button className="nav-btn" id="profileBtn">{t('profile')}</button>
          <button className="post-ad" id="adBtn">{t('postAd')}</button>
        </nav>
      </header>

      <section className="search-section">
        <form className="search-form" id="searchForm" autoComplete="off" role="search" aria-label={t('search')}>
          <input type="text" className="search-box" id="searchInput" placeholder={t('searchPlaceholder')} aria-label={t('searchPlaceholder')} defaultValue="" />
          <button className="search-btn" type="submit" id="searchSubmitBtn">{t('search')}</button>
        </form>
      </section>

      <main>
        <div id="categoriesView">
          <h2 className="sections-title">{t('categoriesTitle')}</h2>
          <section>
            <div className="categories" id="categories" role="listbox" aria-label={t('categoriesTitle')}></div>
          </section>

          <section className="posts-section">
            <h3 className="posts-title">{t('newAd')}</h3>
            <div className="posts-list" id="postsList"></div>
          </section>
        </div>

        <div id="searchView" style={{ display: 'none' }}>
          <div className="search-page">
            <div className="search-filters">
              <h3 className="filters-title">{t('filters')}</h3>

              <div className="filter-group">
                <label className="filter-label">{t('category')}</label>
                <select id="categoryFilter" className="filter-select">
                  <option value="">{t('allCategories')}</option>
                  <option value="Hubs & Electronics">{t('hubsAndElectronics')}</option>
                  <option value="Моторы">{t('motors')}</option>
                  <option value="Сервоприводы">{t('servos')}</option>
                  <option value="Structure (GoBilda)">{t('structureGoBilda')}</option>
                  <option value="Structure (REV)">{t('structureRev')}</option>
                  <option value="Колеса">{t('wheels')}</option>
                  <option value="Датчики">{t('sensors')}</option>
                  <option value="Провода / Кабели">{t('wiresCables')}</option>
                  <option value="Инструменты">{t('tools')}</option>
                  <option value="Комплекты (Kits)">{t('kits')}</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">{t('sortBy')}</label>
                <select id="sortFilter" className="filter-select">
                  <option value="recent">{t('newestFirst')}</option>
                  <option value="price-asc">{t('priceAsc')}</option>
                  <option value="price-desc">{t('priceDesc')}</option>
                  <option value="popular">{t('popular')}</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">{t('priceRange')}</label>
                <div className="price-range">
                  <input type="number" id="minPrice" className="price-input" placeholder={t('minPrice')} min="0" />
                  <input type="number" id="maxPrice" className="price-input" placeholder={t('maxPrice')} min="0" />
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">{t('city')}</label>
                <select id="cityFilter" className="filter-select">
                  <option value="">{t('allCities')}</option>
                  <option value="Алматы">{t('almaty')}</option>
                  <option value="Астана">{t('astana')}</option>
                  <option value="Актау">{t('aktau')}</option>
                  <option value="Актобе">{t('aktobe')}</option>
                  <option value="Атырау">{t('atyrau')}</option>
                  <option value="Байконур">{t('baikonur')}</option>
                  <option value="Караганда">{t('karaganda')}</option>
                  <option value="Кокшетау">{t('kokshetau')}</option>
                  <option value="Костанай">{t('kostanay')}</option>
                  <option value="Кызылорда">{t('kyzylorda')}</option>
                  <option value="Лисаковск">{t('lisakovsk')}</option>
                  <option value="Павлодар">{t('pavlodar')}</option>
                  <option value="Петропавловск">{t('petropavlovsk')}</option>
                  <option value="Рудный">{t('rudny')}</option>
                  <option value="Семей">{t('semei')}</option>
                  <option value="Талдыкорган">{t('taldykorgan')}</option>
                  <option value="Тараз">{t('taraz')}</option>
                  <option value="Туркестан">{t('turkestan')}</option>
                  <option value="Уральск">{t('uralsk')}</option>
                  <option value="Усть-Каменогорск">{t('ustKamenogorsk')}</option>
                  <option value="Шымкент">{t('shymkent')}</option>
                  <option value="Экибастуз">{t('ekibastuz')}</option>
                </select>
                <div className="city-selected" id="citySelected" style={{ display: 'none', marginTop: '8px', padding: '6px 10px', background: '#e3f1ff', borderRadius: '6px', fontSize: '0.9em', color: '#0066cc' }}>
                  <span id="citySelectedText"></span>
                </div>
              </div>

              <button type="button" className="search-btn apply-filters-btn" id="applyFiltersBtn" style={{ width: '100%', marginTop: '20px' }}>{t('applyFilters')}</button>
              <button type="button" className="search-btn reset-filters-btn" id="resetFiltersBtn" style={{ width: '100%', marginTop: '8px' }}>{t('resetFilters')}</button>
              <button type="button" className="search-btn back-btn" id="backToCategoriesBtn" style={{ width: '100%', marginTop: '8px' }}>{t('backToCategories')}</button>
            </div>

            <div className="search-results">
              <div className="results-header">
                <h2 id="resultsTitle">{t('searchListings')}</h2>
                <span className="results-count" id="resultsCount">{t('resultsFound', { count: 0 })}</span>
              </div>
              <div className="posts-list" id="searchPostsList"></div>
              <div className="no-posts" id="noResultsMsg" style={{ display: 'none' }}>
                {t('noListingsMatch')}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
