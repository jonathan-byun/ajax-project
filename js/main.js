/* global filmData */
var ghibliMovies = [];
var ghibliVehiclesList = [];
var ghibliCharacters = [];
var filmsListUrl = 'https://ghibliapi.herokuapp.com/films';
const $vehiclesList = document.querySelector('#vehicles-list');
var xhr = new XMLHttpRequest();
xhr.open('GET', filmsListUrl);
xhr.responseType = 'json';
xhr.addEventListener('load', function () {
  ghibliMovies = xhr.response;
  startCarousel();
  populateFilmsList();
});
xhr.send();

var xhrVehicles = new XMLHttpRequest();
xhrVehicles.open('GET', 'https://ghibliapi.herokuapp.com/vehicles');
xhrVehicles.responseType = 'json';
xhrVehicles.addEventListener('load', function () {
  ghibliVehiclesList = xhrVehicles.response;
  populateVehiclesList();
});
xhrVehicles.send();

var xhrCharacters = new XMLHttpRequest();
xhrCharacters.open('GET', 'https://ghibliapi.herokuapp.com/people');
xhrCharacters.responseType = 'json';
xhrCharacters.addEventListener('load', function () {
  ghibliCharacters = xhrCharacters.response;
});
xhrCharacters.send();

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

function populateVehiclesList() {
  for (let i = 0; i < ghibliVehiclesList.length; i++) {
    var newVehicleRow = document.createElement('div');
    newVehicleRow.className = 'margin-25px-0';
    newVehicleRow.textContent = ghibliVehiclesList[i].name + ' - ' + ghibliVehiclesList[i].description;
    $vehiclesList.appendChild(newVehicleRow);
  }
}

var $filmsPage = document.querySelector('[data-view="films-page"]');
var $filmsContainer = document.querySelector('#films-container');
$filmsContainer.addEventListener('click', goToFilm);

function goToFilm(e) {
  if (e.target.getAttribute('data-film-title') !== null || e.target.getAttribute('data-film-image') !== null) {
    hideCurrentPage();
    showSingleFilmsPage();
    var targetContainer = e.target.closest('[data-index-order]');
    var movieNumber = targetContainer.getAttribute('data-index-order');
    var movie = ghibliMovies[movieNumber];
    populateSingleFilm(movie, movieNumber);
  }
}

var $homePageLinksContainer = document.querySelector('#home-page-links-container');
var $navbar = document.querySelector('[data-view="navbar"]');
var $introPage = document.querySelector('.intro-page');
var $singlePageCharacters = document.querySelector('#single-page-characters');
var $singlePageLocations = document.querySelector('#single-page-locations');
var $singlePageComments = document.querySelector('#single-page-comments');
var $singlePage = document.querySelector('#single-page');

function populateSingleFilm(film, index) {
  stopCarousel();
  $singlePage.setAttribute('data-single-index', index);
  var $singlePageTitle = document.querySelector('#single-page-title');
  $singlePageTitle.textContent = film.title;
  var $singlePagePoster = document.querySelector('#single-page-poster');
  $singlePagePoster.src = film.image;
  var $singlePageDescription = document.querySelector('#single-page-description');
  $singlePageDescription.textContent = film.description;
  removeAllChildNodes($singlePageCharacters);
  removeAllChildNodes($singlePageLocations);
  removeAllChildNodes($singlePageComments);
  $commentText.value = '';
  var filmUrl = film.url;
  for (let i = 0; i < film.people.length; i++) {
    pushCharacterNames(film.people[i], filmUrl);
  }
  for (let i = 0; i < film.locations.length; i++) {
    pushLocations(film.locations[i], filmUrl);
  }
  getMovieRating(index);
  getComments(index);
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

function getMovieRating(index) {
  var ratingText = document.querySelector('#rating-text');
  var ratingAtIndex = filmData.ratings[index];
  if (ratingAtIndex !== undefined) {
    ratingText.textContent = filmData.ratings[index] + '/10';
  } else {
    ratingText.textContent = '/10';
  }
}

function getComments(index) {
  var commentsArray = filmData.comments;
  if (commentsArray[index] !== undefined) {
    for (let i = 0; i < commentsArray[index].storedComments.length; i++) {
      var newCommentDiv = document.createElement('div');
      newCommentDiv.className = 'background-color-light-grey margin-right-2rem border-radius-1rem row justify-between align-center margin-25px-0 comment';
      newCommentDiv.setAttribute('data-comment-number', commentsArray[index].storedComments[i].commentNumber);
      var newCommentP = document.createElement('p');
      newCommentP.className = 'padding-2-3 width-100 overflow-wrap-anywhere';
      newCommentP.textContent = commentsArray[index].storedComments[i].text;
      newCommentDiv.appendChild(newCommentP);
      var newDeleteIcon = document.createElement('i');
      newDeleteIcon.className = 'fa-solid fa-circle-minus fa-lg margin-right-2rem cursor-pointer';
      newCommentDiv.appendChild(newDeleteIcon);
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
  var currentDataIndex = document.querySelector('#single-page').getAttribute('data-single-index');
  if (!Number.isNaN(ratingNumber) && ratingNumber <= 10 && ratingNumber >= 0) {
    updateRating(currentDataIndex, ratingNumber);
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

function updateRating(index, rating) {
  var ratings = filmData.ratings;
  ratings[index] = rating;
  var ratingText = document.querySelector('#rating-text');
  ratingText.textContent = rating + '/10';
}

var $commentButton = document.querySelector('#comment-button');
$commentButton.addEventListener('click', submitComment);
var $commentText = document.querySelector('#comment-text');

function submitComment() {
  var currentDataIndex = document.querySelector('#single-page').getAttribute('data-single-index');
  updateComment(currentDataIndex);
  $commentText.value = '';
}

function updateComment(index) {
  var commentsArray = filmData.comments;
  if (commentsArray[index] !== undefined) {
    var arrayOfObjects = commentsArray[index].storedComments;
    var newObject = {
      commentNumber: commentsArray[index].numberOfComments,
      text: $commentText.value
    };
    arrayOfObjects.unshift(newObject);
    commentsArray[index].numberOfComments += 1;
  } else {
    var newCommentObject = {
      numberOfComments: 1,
      storedComments: [{
        commentNumber: 0,
        text: $commentText.value
      }]
    };
    commentsArray[index] = newCommentObject;
  }
  var newComment = document.createElement('div');
  var currentCommentNumber = commentsArray[index].numberOfComments - 1;
  newComment.className = 'background-color-light-grey margin-right-2rem border-radius-1rem row justify-between align-center margin-25px-0 comment';
  newComment.setAttribute('data-comment-number', currentCommentNumber);
  var newCommentText = document.createElement('p');
  newCommentText.textContent = $commentText.value;
  newCommentText.className = 'padding-2-3 width-100 overflow-wrap-anywhere';
  var newDeleteIcon = document.createElement('i');
  newDeleteIcon.className = 'fa-solid fa-circle-minus fa-lg margin-right-2rem cursor-pointer';
  newComment.appendChild(newCommentText);
  newComment.appendChild(newDeleteIcon);
  $singlePageComments.insertBefore(newComment, $singlePageComments.firstChild);
}

$singlePageComments.addEventListener('click', deleteButtonisClicked);
function deleteButtonisClicked(e) {
  if (e.target.classList.contains('fa-circle-minus')) {
    var currentDataIndex = document.querySelector('#single-page').getAttribute('data-single-index');
    var targetElement = e.target.parentElement;
    var currentCommentIndex = targetElement.getAttribute('data-comment-number');
    deleteCommentData(currentDataIndex, currentCommentIndex);
    targetElement.remove();
  }
}

function deleteCommentData(index, commentIndex) {
  var commentsObject = filmData.comments[index];
  var commentsLength = commentsObject.storedComments.length;
  var deleteIndex = commentsLength - commentIndex - 1;
  commentsObject.storedComments.splice(deleteIndex, 1);
}

var $navbarLinks = document.querySelector('[data-link="navbar-links"]');
$navbarLinks.addEventListener('click', linkClicked);
$homePageLinksContainer.addEventListener('click', homePageLinkClicked);

function linkClicked(e) {
  if (e.target.localName === 'a') {
    hideCurrentPage();
    var clickedLinkId = e.target.id;
    switch (clickedLinkId) {
      case 'homepage-link':
        showHomePage();
        break;
      case 'films-link':
        showFilmsPage();
        break;
      case 'vehicles-link':
        showVehiclesPage();
        break;
      case 'characters-link':
        showFilmsPage();
        break;
      case 'locations-link':
        showFilmsPage();
        break;
    }
  }
}

function homePageLinkClicked(e) {
  if (e.target.localName === 'a') {
    toggleLinkBar();
    hideCurrentPage();
    var clickedLinkId = e.target.id;
    switch (clickedLinkId) {
      case 'intro-films-link':
        showFilmsPage();
        break;
      case 'intro-characters-link':
        showFilmsPage();
        break;
      case 'intro-vehicles-link':
        showFilmsPage();
        break;
      case 'intro-locations-link':
        showFilmsPage();
        break;
    }
  }
}

function hideCurrentPage() {
  var $currentPage = document.querySelector('.active');
  $currentPage.classList.toggle('hidden');
  $currentPage.classList.toggle('active');
}

function showFilmsPage() {
  $filmsPage.classList.remove('hidden');
  $filmsPage.classList.add('active');
}

function showSingleFilmsPage() {
  $singlePage.classList.remove('hidden');
  $singlePage.classList.add('active');
  window.scroll(0, 0);
}

function showHomePage() {
  $introPage.classList.remove('hidden');
  $introPage.classList.add('active');
  toggleLinkBar();
}

function showVehiclesPage() {
  var $vehiclesPage = document.querySelector('[data-view="vehicles-page"]');
  $vehiclesPage.classList.remove('hidden');
  $vehiclesPage.classList.add('active');
}

function toggleLinkBar() {
  $navbar.classList.toggle('hidden');
}
