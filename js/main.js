
var ghibliMovies = [];
var filmsListUrl = 'https://ghibliapi.herokuapp.com/films';

var xhr = new XMLHttpRequest();
xhr.open('GET', filmsListUrl);
xhr.responseType = 'json';
xhr.addEventListener('load', function () {
  ghibliMovies = xhr.response;
  startCarousel();
  populateFilmsList();
});
xhr.send();

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

function makeNewMovieRow() {
  var newMovieRow = document.createElement('div');
  newMovieRow.className = 'row justify-around';
  return newMovieRow;
}

function makeMoviePosterBlock(movie) {
  var movieColumn = document.createElement('div');
  movieColumn.className = 'column-one-fifth';
  var posterContainer = document.createElement('div');
  posterContainer.className = 'row align-center justify-between height-2rem';
  movieColumn.appendChild(posterContainer);
  var movieTitle = document.createElement('h2');
  movieTitle.textContent = movie.title;
  movieTitle.className = 'cursor-pointer';
  movieTitle.dataset.filmTitle = movie.title;
  posterContainer.appendChild(movieTitle);
  var rating = document.createElement('h3');
  posterContainer.appendChild(rating);
  var imageContainer = document.createElement('div');
  imageContainer.className = 'row justify-center';
  movieColumn.appendChild(imageContainer);
  var moviePoster = document.createElement('img');
  moviePoster.className = 'fit-to-container cursor-pointer';
  moviePoster.src = movie.image;
  moviePoster.dataset.filmImage = movie.image;
  imageContainer.appendChild(moviePoster);
  return movieColumn;
}

function populateFilmsList() {
  var rowCounter = 0;
  var movieCounter = 0;
  var $filmsContainer = document.querySelector('#films-container');
  for (let i = 0; i < ghibliMovies.length; i++) {
    if (rowCounter === 0) {
      var newRow = makeNewMovieRow();
    }
    var newMovieColumn = makeMoviePosterBlock(ghibliMovies[i]);
    newMovieColumn.dataset.indexOrder = movieCounter;
    movieCounter++;
    newRow.appendChild(newMovieColumn);
    rowCounter++;
    if (rowCounter === 4) {
      $filmsContainer.appendChild(newRow);
      rowCounter = 0;
    }
  }
}

var $filmsContainer = document.querySelector('#films-container');
$filmsContainer.addEventListener('click', goToFilm);

function goToFilm(e) {
  if (e.target.getAttribute('data-film-title') !== null || e.target.getAttribute('data-film-image') !== null) {
    var targetContainer = e.target.closest('[data-index-order]');
    var movieNumber = targetContainer.getAttribute('data-index-order');
    var movie = ghibliMovies[movieNumber];
    populateSingleFilm(movie);
  }
}

function populateSingleFilm(film) {
  var $singlePageTitle = document.querySelector('#single-page-title');
  $singlePageTitle.textContent = film.title;
  var $singlePagePoster = document.querySelector('#single-page-poster');
  $singlePagePoster.src = film.image;
  var $singlePageDescription = document.querySelector('#single-page-description');
  $singlePageDescription.textContent = film.description;
}
