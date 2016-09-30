(function() {
    'use strict';

    function firebaseDB() {
        // TODO - Add authentication with token

        var config = {
            apiKey: "AIzaSyAdB-QKqwRcZGy_k6FIMEBK5PQhtZrTad4",
            authDomain: "helloworld-ee64c.firebaseapp.com",
            databaseURL: "https://helloworld-ee64c.firebaseio.com",
            storageBucket: "helloworld-ee64c.appspot.com"
        };
        firebase.initializeApp(config);
        return firebase.database();
    }

    angular.module('gugCZ.webAdmin.common.firebase', [
            'firebase'
        ]
    )
        .service('firebaseDB', firebaseDB)

})();