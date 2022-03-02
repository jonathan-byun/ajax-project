
var ghibliMovies = [];
var filmsListUrl = 'https://ghibliapi.herokuapp.com/films';

var xhr = new XMLHttpRequest();
xhr.open('GET', filmsListUrl);
xhr.responseType = 'json';
xhr.addEventListener('load', function () {
  ghibliMovies = xhr.response;
});
xhr.send();

xhr.addEventListener('load', startCarousel);
var $introImg = document.querySelector('#intro-img');
var $introImg2 = document.querySelector('#intro-img-2');
function startCarousel() {
  var IntroIntervalID = setInterval(switchImage, 3000);
}

var currentImageNumber = 0;
function switchImage() {
  if (currentImageNumber % 2 === 0) {
    $introImg.src = ghibliMovies[currentImageNumber].image;
    $introImg2.classList.add('opacity-0');
    $introImg.classList.remove('opacity-0');
  } else {
    $introImg2.src = ghibliMovies[currentImageNumber].image;
    $introImg.classList.add('opacity-0');
    $introImg2.classList.remove('opacity-0');
  }
  currentImageNumber++;
  if (currentImageNumber === ghibliMovies.length) {
    currentImageNumber = 0;
  }
}
