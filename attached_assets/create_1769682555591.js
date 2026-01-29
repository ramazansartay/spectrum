const LANGUAGES = {
  ru: {
    code: 'ru',
    max_5_photos: "Максимум 5 фото",
    ad_published: "Объявление опубликовано!",
    error_too_many_photos: "Ошибка: Слишком много фото. Очистите старые объявления или добавьте меньше фото."
  },
  kz: {
    code: 'kz',
    max_5_photos: "Ең көбі 5 фото",
    ad_published: "Хабарландыру жарияланды!",
    error_too_many_photos: "Қате: Фотосуреттер тым көп. Ескі хабарландыруларды өшіріңіз немесе азырақ фотосуреттер қосыңыз."
  }
};

let currentLang = localStorage.getItem('ftcspectrum_lang') || 'ru';
function getLang() {
  return LANGUAGES[currentLang];
}

const photoList = document.getElementById('photoList');
const fileInput = document.getElementById('fileInput');
let filesArr = [];

function renderPhotos() {
  document.querySelectorAll('.photo-thumb').forEach(e => e.remove());
  filesArr.forEach((img, idx) => {
    const d = document.createElement('div');
    d.className = 'photo-thumb';
    d.innerHTML = `<img src="${img.data}"><button type="button" class="remove-btn">×</button>`;
    d.querySelector('.remove-btn').onclick = () => { filesArr.splice(idx,1); renderPhotos(); };
    photoList.appendChild(d);
  });
}

function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve({ data: canvas.toDataURL('image/jpeg', 0.7), name: file.name });
      };
    };
  });
}

fileInput.onchange = async (e) => {
  const files = Array.from(e.target.files);
  for (let file of files) {
    if(filesArr.length >= 5) break;
    const compressed = await compressImage(file);
    filesArr.push(compressed);
  }
  renderPhotos();
  fileInput.value = '';
};

document.querySelector('.photo-add').onclick = () => {
  const lang = getLang();
  if(filesArr.length < 5) fileInput.click();
  else alert(lang.max_5_photos);
};

document.getElementById('adForm').onsubmit = (e) => {
  e.preventDefault();
  const lang = getLang();
  const fd = new FormData(e.target);
  
  const newPost = {
    id: Date.now(),
    name: fd.get('name'),
    cat: fd.get('cat'),
    desc: fd.get('desc'),
    price: fd.get('price'),
    location: fd.get('location'),
    user: fd.get('user'),
    images: filesArr.map(f => f.data),
    date: new Date().toLocaleDateString()
  };

  try {
    const posts = JSON.parse(localStorage.getItem('spectrum_posts')) || [];
    posts.push(newPost);
    localStorage.setItem('spectrum_posts', JSON.stringify(posts));
    alert(lang.ad_published);
    window.location.href = 'index.html';
  } catch (err) {
    alert(lang.error_too_many_photos);
    console.error(err);
  }
};