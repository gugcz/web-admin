(function () {
    'use strict';

    function firebaseFactory(firebaseDB, $q, $firebaseArray) {
        var self = this;
        self.chapters = null;

        self.getAllOrganizers = function () {
            var organizers = [];
            var ref = firebaseDB.ref('orgs/');
            return $q.when(ref.once("value").then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    organizers.push(childSnapshot.val());
                });
                return organizers;
            }));

        };

        self.addChapter = function (chapter) {
            var ref = new Firebase(FIREBASE_URL + '/chapters');
            var chapters = $firebaseArray(ref);
            chapters.$add(chapter)
        };

        self.addChapterWithOwnID = function (chapter) {
            var chaptersRef = firebaseDB.ref('chapters/');
            chaptersRef.child(getChapterID(chapter)).set(chapter);
        };

        function getChapterID(chapter) {
            return chapter.section.toLowerCase() + '_' + chapter.name.replace(' ', '_').toLowerCase();
        }

    }


    angular.module('gugCZ.webAdmin.chapter.services', [
            'gugCZ.webAdmin.common.firebase'
        ]
    )
        .service('firebaseData', firebaseFactory)

})();