/* global filmData */
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

var IntroIntervalID;

var $introImg = document.querySelector('#intro-img');
var $introImg2 = document.querySelector('#intro-img-2');
function startCarousel() {
  var IntroIntervalID = setInterval(switchImage, 3000);
  return IntroIntervalID;
}

function stopCarousel() {
  clearInterval(IntroIntervalID);
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
  movieColumn.className = 'column-one-fifth transition-scale-1s';
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
  moviePoster.className = 'fit-to-container cursor-pointer ';
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

var $singlePageCharacters = document.querySelector('#single-page-characters');
var $singlePageLocations = document.querySelector('#single-page-locations');
var $singlePageComments = document.querySelector('#single-page-comments');

function populateSingleFilm(film) {
  stopCarousel();
  var $singlePageTitle = document.querySelector('#single-page-title');
  $singlePageTitle.textContent = film.title;
  var $singlePagePoster = document.querySelector('#single-page-poster');
  $singlePagePoster.src = film.image;
  var $singlePageDescription = document.querySelector('#single-page-description');
  $singlePageDescription.textContent = film.description;
  removeAllChildNodes($singlePageCharacters);
  removeAllChildNodes($singlePageLocations);
  removeAllChildNodes($singlePageComments);
  var filmUrl = film.url;
  for (let i = 0; i < film.people.length; i++) {
    pushCharacterNames(film.people[i], filmUrl);
  }
  for (let i = 0; i < film.locations.length; i++) {
    pushLocations(film.locations[i], filmUrl);
  }
  getMovieRating(film.title);
  getComments(film.title);
}

function pushLocations(link, url) {
  var xhr3 = new XMLHttpRequest();
  xhr3.open('Get', link);
  xhr3.responseType = 'json';
  xhr3.addEventListener('load', function () {
    var response = xhr3.response;
    if (Array.isArray(response)) {
      for (let i = 0; i < response.length; i++) {
        var locationUrl = response[i].films[0];
        if (locationUrl === url) {
          var newLocationText = document.createElement('div');
          newLocationText.className = 'column-fourth margin-bottom-5';
          newLocationText.textContent = response[i].name;
          $singlePageLocations.appendChild(newLocationText);
        }
      }
      if (!$singlePageLocations.hasChildNodes()) {
        var noLocations = document.createElement('div');
        noLocations.className = 'justify-self-center font-size-3rem column-full';
        noLocations.textContent = "Don't see any locations...";
        var noLocationsGif = document.createElement('img');
        noLocationsGif.src = 'https://66.media.tumblr.com/e79fca60b7e45ebc2ff25c8fa2d1306d/2553a1be7ff3b928-b4/s540x810/c8c5af2b5773af62aa42c2a1b503468d08f39a90.gif';
        $singlePageLocations.appendChild(noLocations);
        $singlePageLocations.appendChild(noLocationsGif);
      }
    }
  });
  xhr3.send();
}

function pushCharacterNames(link, url) {
  var xhr2 = new XMLHttpRequest();
  xhr2.open('GET', link);
  xhr2.responseType = 'json';
  xhr2.addEventListener('load', function () {
    var ajaxResponse = xhr2.response;
    if (Array.isArray(ajaxResponse)) {
      for (let i = 0; i < ajaxResponse.length; i++) {
        var characterUrl = ajaxResponse[i].films[0];
        if (characterUrl === url) {
          var newCharacterNameText = document.createElement('div');
          newCharacterNameText.className = 'column-fourth margin-bottom-5';
          newCharacterNameText.textContent = ajaxResponse[i].name;
          $singlePageCharacters.appendChild(newCharacterNameText);
        }
      }
      if (!$singlePageCharacters.hasChildNodes()) {
        var noCharacters = document.createElement('div');
        noCharacters.className = 'justify-self-center font-size-3rem';
        noCharacters.textContent = 'Seems someone took the names away...';
        var noCharactersGif = document.createElement('img');
        noCharactersGif.src = 'https://i.stack.imgur.com/2rWkC.gif';
        $singlePageCharacters.appendChild(noCharacters);
        $singlePageCharacters.appendChild(noCharactersGif);
      }
    } else {
      var newCharacterNameText2 = document.createElement('div');
      newCharacterNameText2.className = 'column-fourth margin-bottom-5';
      newCharacterNameText2.textContent = ajaxResponse.name;
      $singlePageCharacters.appendChild(newCharacterNameText2);
    }
  });
  xhr2.send();
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function getMovieRating(name) {
  var alreadyExists = filmData.storedRatings;
  var filmPlace = alreadyExists.indexOf(name);
  var ratingText = document.querySelector('#rating-text');
  if (filmPlace !== -1) {
    ratingText.textContent = filmData.ratings[filmPlace] + '/10';
  } else {
    ratingText.textContent = '/10';
  }
}

function getComments(name) {
  var storedComments = filmData.storedComments;
  var commentsArray = filmData.comments;
  var commentLocation = storedComments.indexOf(name);
  if (commentLocation !== -1) {
    for (let i = 0; i < commentsArray[commentLocation].length; i++) {
      var newCommentDiv = document.createElement('div');
      newCommentDiv.className = 'background-color-light-grey margin-right-2rem border-radius-1rem';
      var newCommentP = document.createElement('p');
      newCommentP.className = 'padding-2-3';
      newCommentP.textContent = commentsArray[commentLocation][i];
      newCommentDiv.appendChild(newCommentP);
      $singlePageComments.appendChild(newCommentDiv);
    }
  }
}

var $ratingButton = document.querySelector('#rating-button');
var $ratingModal = document.querySelector('.rating-modal');
$ratingButton.addEventListener('click', showRatingModal);
$ratingModal.addEventListener('click', clickOutOfModal);

function clickOutOfModal(e) {
  if (e.target === $ratingModal) {
    $ratingModal.classList.add('hidden');
  }
}

function closeModal() {
  $ratingModal.classList.add('hidden');
}

function showRatingModal() {
  $ratingModal.classList.remove('hidden');
}

var $modalButton = document.querySelector('.modal-button');
$modalButton.addEventListener('click', submitRating);

function submitRating() {
  var $userRating = document.querySelector('#user-rating').value;
  var ratingNumber = Number($userRating);
  var currentTitle = document.querySelector('#single-page-title').textContent;
  if (!Number.isNaN(ratingNumber) && ratingNumber <= 10 && ratingNumber >= 0) {
    updateRating(currentTitle, ratingNumber);
    closeModal();
  } else {
    var newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.id = 'user-rating';
    newInput.value = 'Number/10 please';
    var targetElement = document.querySelector('#user-rating');
    targetElement.after(newInput);
    targetElement.remove();
  }
}

function updateRating(name, rating) {
  var alreadyExists = filmData.storedRatings;
  var ratings = filmData.ratings;
  if (alreadyExists.indexOf(name) !== -1) {
    ratings[alreadyExists.indexOf(name)] = rating;

  } else {
    alreadyExists.push(name);
    ratings.push(rating);
  }
  var ratingText = document.querySelector('#rating-text');
  ratingText.textContent = rating + '/10';
}

var $commentButton = document.querySelector('#comment-button');
$commentButton.addEventListener('click', submitComment);
var $commentText = document.querySelector('#comment-text');

function submitComment() {
  var currentTitle = document.querySelector('#single-page-title');
  updateComment(currentTitle.textContent);
  $commentText.value = '';
}

function updateComment(name) {
  var storedComments = filmData.storedComments;
  var commentsArray = filmData.comments;
  if (storedComments.indexOf(name) !== -1) {
    commentsArray[storedComments.indexOf(name)].push($commentText.value);
  } else {
    var newEntry = [];
    newEntry.push($commentText.value);
    storedComments.push(name);
    commentsArray.push(newEntry);
  }
}
