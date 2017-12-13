angular.module('gugCZ.firebase', [
  'firebase'
])
  .factory('firebaseDB', function () {
    return firebase.database();
  })

  .factory('firebaseSTORE', function () {
    return firebase.firestore();
  })

  .factory('firebaseSTORAGE', function () {
    return firebase.storage();
  })
  .factory('firebaseAuth', function ($firebaseAuth) {
    return $firebaseAuth();
  });
