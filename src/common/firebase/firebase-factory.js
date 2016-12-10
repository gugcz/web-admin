(function() {
  'use strict';

  function firebaseDB() {
    // TODO - Add authentication with token

	  var config = {
		  apiKey: "AIzaSyAkP1lF6Y4k7F1lTNA_tXufK0YQX7I72uo",
		  authDomain: "gugcz.firebaseapp.com",
		  databaseURL: "https://gugcz.firebaseio.com",
		  storageBucket: "firebase-gugcz.appspot.com",
		  messagingSenderId: "31582256095"
	  };
    firebase.initializeApp(config);
   /* firebase.auth().signInWithCustomToken();
    firebase.database().ref('orgs/' + firebase.auth().currentUser.uid + '/name').push('Ahojda');*/
    return firebase.database();
  }

  angular.module('gugCZ.webAdmin.common.firebase', [
        'firebase'
      ]
  )
      .service('firebaseDB', firebaseDB);

})();