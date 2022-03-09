/* exported filmData */
var filmData = {
  storedRatings: [],
  ratings: [],
  storedComments: [],
  comments: []
};
var window = document.querySelector('window');
window.addEventListener('beforeunload', function () {
  var filmDataJSON = JSON.stringify(filmData);
  localStorage.setItem('ghibli-film-data', filmDataJSON);
});

// var previousFilmDataJSON = localStorage.getItem('ghibli-film-data');
// if (previousFilmDataJSON !== null) {
//   filmData = JSON.parse(previousFilmDataJSON);
// }
