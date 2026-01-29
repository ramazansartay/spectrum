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
          btnProfile: "Профиль",
          btnChat: "Чат",
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
