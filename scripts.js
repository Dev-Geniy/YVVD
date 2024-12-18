// Добавление видео
function addVideo() {
  const videoUrl = document.getElementById('video-url').value;
  const videoId = getVideoId(videoUrl);

  if (videoId) {
    const videoList = JSON.parse(localStorage.getItem('videos')) || [];
    if (!videoList.some(video => video.id === videoId)) {
      videoList.push({ id: videoId, url: videoUrl, title: `Video ${videoId}` });
      localStorage.setItem('videos', JSON.stringify(videoList));
      displayVideos();
    } else {
      alert('This video is already added.');
    }
    document.getElementById('video-url').value = ''; // Очистить поле ввода
  } else {
    alert('Invalid Video URL');
  }
}

// Получаем ID видео из URL
function getVideoId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(youtube\.com\/(?:watch\?v=|embed\/)([a-zA-Z0-9_-]{11}))/;
  const match = url.match(regex);
  return match ? match[2] : null;
}

// Отображение видео
function displayVideos() {
  const videoList = JSON.parse(localStorage.getItem('videos')) || [];
  const videoListContainer = document.getElementById('video-list');
  videoListContainer.innerHTML = '';

  videoList.forEach(video => {
    const li = document.createElement('li');
    const thumbnail = `https://img.youtube.com/vi/${video.id}/0.jpg`;
    const title = video.title;

    li.innerHTML = ` 
      <div style="display: flex; align-items: center;">
        <img src="${thumbnail}" class="video-thumbnail" />
        <span>${title}</span>
        <button class="edit-btn" onclick="editTitle('${video.id}')"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" onclick="removeVideo('${video.id}')"><i class="fas fa-trash-alt"></i></button>
        <button class="download-btn" onclick="downloadVideo('${video.url}')"><i class="fas fa-download"></i></button>
        <button class="play-btn" onclick="playVideo('${video.id}')"><i class="fas fa-play"></i></button>
      </div>
    `;

    li.onclick = function() {
      // Не открываем видео при клике на элемент, только при нажатии кнопки play
    };

    videoListContainer.appendChild(li);
  });
}

// Скачивание видео
function downloadVideo(url) {
  const downloadUrl = url.replace('youtube.com', 'ssyoutube.com');
  window.open(downloadUrl, '_blank');
}

// Удаление видео
function removeVideo(videoId) {
  let videoList = JSON.parse(localStorage.getItem('videos')) || [];
  videoList = videoList.filter(video => video.id !== videoId);
  localStorage.setItem('videos', JSON.stringify(videoList));
  displayVideos();
}

// Редактирование заголовка
function editTitle(videoId) {
  const newTitle = prompt('Enter new title:');
  if (newTitle) {
    let videoList = JSON.parse(localStorage.getItem('videos')) || [];
    const video = videoList.find(video => video.id === videoId);
    if (video) {
      video.title = newTitle;
      localStorage.setItem('videos', JSON.stringify(videoList));
      displayVideos();
    }
  }
}

// Воспроизведение видео
function playVideo(videoId) {
  document.getElementById('video-frame').src = `https://www.youtube.com/embed/${videoId}`;
}

// Переключение темы
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const themeButton = document.querySelector('.theme-toggle');
  themeButton.innerHTML = document.body.classList.contains('dark-mode') ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

// Вставка последней скопированной ссылки из буфера обмена
window.onload = function() {
  displayVideos();
  navigator.clipboard.readText().then(text => {
    const videoUrl = getVideoId(text);
    if (videoUrl) {
      document.getElementById('video-url').value = text;
    }
  });
}
