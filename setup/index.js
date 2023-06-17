let postsData = [];
let visiblePosts = 4;
const postsPerLoad = 4;

async function fetchPosts() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    // Add 'liked' property to each post object
    const postsWithLikes = data.map(post => ({ ...post, liked: false }));
    return postsWithLikes;
  } catch (error) {
    console.error('Error:', error);
  }
}

// render posts
function showPosts(data) {
  if (!data || !Array.isArray(data)) {
    return;
  }

  const cardHolder = document.getElementById('card-holder');
  cardHolder.innerHTML = ''; 

  const visiblePostsData = data.slice(0, visiblePosts);

  visiblePostsData.forEach(function (obj) {
    const div = document.createElement('div');
    div.className = 'post grid-item';

    div.innerHTML =
      '<div class="card-container">' +
      '<div class="card-padding">' +
      '<div class="card-top">' +
      '<div class="profile">' +
      '<div class="profile_image"><img src="' + obj.profile_image + '" alt=""></div>' +
      '<div class="profile-info">' +
      '<h4 class="namestyle">' + obj.name + '</h4>' +
      '<p class="datestyle">' + obj.date + '</p>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="card-img">' +
      '<img class="card__image" src="' + obj.image + '"/>' +
      '</a>' +
      '</div>' +
      '<div class="card__inner">' +
      '<p class="innerstyle" style="height:150px">' + obj.caption + '</p>' +
      '<hr class="u-no-margin--bottom">' +
      '<div class="card__inner2">' +
      '<svg class="likebtn" width="17" height="17" viewBox="0 0 17 17" fill="black" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M14.7617 3.26543C14.3999 2.90347 13.9703 2.61634 13.4976 2.42045C13.0248 2.22455 12.518 2.12372 12.0063 2.12372C11.4945 2.12372 10.9877 2.22455 10.5149 2.42045C10.0422 2.61634 9.61259 2.90347 9.25082 3.26543L8.50082 4.01543L7.75082 3.26543C7.09673 2.61134 6.15555 2.12399 5.15625 2.12399C4.15695 2.12399 3.21578 2.61134 2.5617 3.26543C1.90761 3.91951 1.42025 4.86068 1.42025 5.85999C1.42025 6.85929 1.90761 7.80047 2.5617 8.45455L3.3117 9.20455L8.50082 14.3937L13.6899 9.20455L14.4399 8.45455C14.8025 8.09179 15.0896 7.6622 15.2855 7.18946C15.4814 6.71672 15.5823 6.20989 15.5823 5.69818C15.5823 5.18647 15.4814 4.67965 15.2855 4.20692C15.0896 3.73418 14.8025 3.30459 14.4399 2.94182V2.94182V2.94182Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
      '<span class="likesvalue">' + obj.likes + '</span>' +
      '</div>' +
      '</div>' +
      '</div>';

    cardHolder.appendChild(div);
    attachLikeEvent(div, obj);
  });

  //LIGHTBOX 
  const imageLinks = document.querySelectorAll('.card__image');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const closeBtn = document.getElementById('close-btn');

  function openLightbox(e) {
    e.preventDefault();
    const imageURL = this.getAttribute('src');
    lightboxImage.setAttribute('src', imageURL);
    lightbox.style.display = 'block';
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
  }

  imageLinks.forEach(function (imageLink) {
    imageLink.addEventListener('click', openLightbox);
  });

  closeBtn.addEventListener('click', closeLightbox);

  //LOAD MORE BTN
  const layout = document.getElementsByClassName('layout-container')[0];
  const loadMoreBtnId = 'load-more-btn';

  function createLoadMoreButton() {
    const loadMoreDiv = document.createElement('div');
    loadMoreDiv.className = 'loadmoredivstyle';
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.id = loadMoreBtnId;
    loadMoreBtn.className = 'loadmorestyle';
    loadMoreBtn.textContent = 'Load More';

    loadMoreBtn.addEventListener('click', function () {
      visiblePosts += postsPerLoad; 
      showPosts(postsData); 
    });

    loadMoreDiv.appendChild(loadMoreBtn);
    layout.appendChild(loadMoreDiv);
  }

  function checkLoadMoreButton() {
    const loadMoreBtn = document.getElementById(loadMoreBtnId);
    if (visiblePosts < data.length) {
      if (!loadMoreBtn) {
        createLoadMoreButton();
      }
    } else {
      if (loadMoreBtn) {
        loadMoreBtn.parentNode.remove();
      }
    }
  }

  checkLoadMoreButton();

  //dark theme 
  const header = document.getElementsByClassName('header-container')[0];
  const checkbox = document.getElementById('theme-checkbox');
  const cardContainers = document.getElementsByClassName('card-container');
  const profileNames = document.getElementsByClassName('namestyle');
  const likeIcons = document.getElementsByClassName('likebtn');
  const mainContainer = document.getElementsByClassName('layout-container')[0];
  const slider = document.getElementsByClassName('slider')[0];

  function toggleDarkTheme() {
    const isDarkTheme = checkbox.checked;

    if (isDarkTheme) {
      for (let i = 0; i < cardContainers.length; i++) {
        cardContainers[i].style.border = 'solid 1px white';
        profileNames[i].style.color = 'white';
        likeIcons[i].style.fill = 'white';
        checkLikedPosts(data);
      }
      mainContainer.style.background = 'black';
      mainContainer.style.color = 'white';
      header.style.background = 'black';
      slider.style.background = '#ffbe0b';
    } else {
      checkLikedPosts(data);
      for (let i = 0; i < cardContainers.length; i++) {
        cardContainers[i].style.border = 'solid 1px rgba(0, 0, 0, 0.26)';
        profileNames[i].style.color = 'black';
        likeIcons[i].style.fill = 'black';
      }
      mainContainer.style.background = 'white';
      mainContainer.style.color = 'black';
      header.style.background = 'white';

    }
  }

  checkbox.addEventListener('click', toggleDarkTheme);
  toggleDarkTheme();

  //like btn
  checkLikedPosts(data);
}

// Function to check if any posts are already liked
function checkLikedPosts(data) {
  const cardContainers = document.getElementsByClassName('card-container');
  for (let i = 0; i < cardContainers.length; i++) {
    const likeBtn = cardContainers[i].querySelector('.likebtn');
    const isLiked = data[i].liked;

    if (isLiked) {
      likeBtn.style.fill = 'red';
    } else {
      likeBtn.style.fill = 'black';
    }
  }
}

// Attach like event to each post
function attachLikeEvent(element, post) {
  const likeBtn = element.querySelector('.likebtn');
  const likeValue = element.querySelector('.likesvalue');

  likeBtn.addEventListener('click', () => {
    if (!post.liked) {
      likeBtn.style.fill = 'red';
      likeValue.textContent = parseInt(likeValue.textContent) + 1;
      post.liked = true;
    } else {
      likeBtn.style.fill = 'black';
      likeValue.textContent = parseInt(likeValue.textContent) - 1;
      post.liked = false;
    }
  });
}


fetchPosts()
  .then(data => {
    postsData = data; 
    showPosts(postsData); 
  });



