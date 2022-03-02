
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

function startCarousel() {
  var IntroIntervalID = setInterval(switchImage, 1000);
}

var currentImageNumber = 0;
function switchImage() {
  $introImg.src = ghibliMovies[currentImageNumber].image;
  currentImageNumber++;
  if (currentImageNumber === ghibliMovies.length) {
    currentImageNumber = 0;
  }
}
