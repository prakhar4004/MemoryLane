let currentImage = 0;
let allImages;

const showPopup = (item) => {
  let popup = document.querySelector('.image-popup');
  // const downloadBtn = document.querySelector('.download-btn');
  const closeBtn = document.querySelector('.close-btn');
  const image = document.querySelector('.large-img');
  const backdrop = document.querySelector('.backdrop')

  popup.classList.remove('hide');
  backdrop.classList.remove('hide');

  // downloadBtn.href = item.links.html;
  image.src = item.src.medium;

  closeBtn.addEventListener('click', () => {
      popup.classList.add('hide');
      backdrop.classList.add('hide');
  })

}

class PhotoGallery {
  constructor() {
    this.API_KEY = 'wKYUegpaHUipeMu90OnpmRZMQIlc5omDIgYTylpf5VRkhyX7U3pKoijM';
    this.galleryDIv = document.querySelector('.gallery');
    this.searchForm = document.querySelector('.header form');
    this.loadMore = document.querySelector('.load-more');
    this.logo = document.querySelector('.logo')
    this.pageIndex = 1;
    this.searchValueGlobal = '';
    this.eventHandle();
  }
  eventHandle() {
    document.addEventListener('DOMContentLoaded', () => {
      this.getImg(1);
    });
    this.searchForm.addEventListener('submit', (e) => {
      this.pageIndex = 1;
      this.getSearchedImages(e);
    });
    this.loadMore.addEventListener('click', (e) => {
      this.loadMoreImages(e);
    })
    this.logo.addEventListener('click', () => {
      this.pageIndex = 1;
      this.galleryDIv.innerHTML = '';
      this.getImg(this.pageIndex);
    })
  }
  async getImg(index) {
    this.loadMore.setAttribute('data-img', 'curated');
    const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=12`;
    const data = await this.fetchImages(baseURL);
    this.GenerateHTML(data.photos)
    console.log(data)
  }
  async fetchImages(baseURL) {
    const response = await fetch(baseURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: this.API_KEY
      }
    });
    const data = await response.json();
    return data;
  }
  GenerateHTML(photos) {
    allImages = photos;
    photos.forEach((photo, index) => {
      const item = document.createElement('div');
      item.classList.add('item');
      let img = document.createElement('img');
      img.src = photo.src.medium;
      img.addEventListener('click', () => {
        currentImage = index;
        showPopup(photo);
      })
      let h3 = document.createElement('h3');
      h3.innerText = `${photo.photographer}`;
      item.appendChild(img)
      item.appendChild(h3)
      this.galleryDIv.appendChild(item)
    })
  }

  async getSearchedImages(e) {
    this.loadMore.setAttribute('data-img', 'search');
    e.preventDefault();
    this.galleryDIv.innerHTML = '';
    const searchValue = e.target.querySelector('input').value;
    this.searchValueGlobal = searchValue;
    const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=12`
    const data = await this.fetchImages(baseURL);
    this.GenerateHTML(data.photos);
    e.target.reset();
  }
  async getMoreSearchedImages(index) {
    // console.log(searchValue)
    const baseURL = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=12`
    const data = await this.fetchImages(baseURL);
    console.log(data)
    this.GenerateHTML(data.photos);
  }
  loadMoreImages(e) {
    let index = ++this.pageIndex;
    const loadMoreData = e.target.getAttribute('data-img');
    if (loadMoreData === 'curated') {
      // load next page for curated]
      this.getImg(index)
    } else {
      // load next page for search
      this.getMoreSearchedImages(index);
    }
  }
}


const preBtns = document.querySelector('.pre-btn');
const nxtBtns = document.querySelector('.nxt-btn');

preBtns.addEventListener('click', () => {
    if(currentImage > 0){
        currentImage--;
        showPopup(allImages[currentImage]);
    }
})

nxtBtns.addEventListener('click', () => {
    if(currentImage < allImages.length - 1){
        currentImage++;
        showPopup(allImages[currentImage]);
    }
})

const gallery = new PhotoGallery;