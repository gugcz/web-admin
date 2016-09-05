(function () {
    'use strict';

    function firebaseFactory(firebaseDB, $q, $firebaseArray) {
        var self = this;
        var chapterName = null;

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

        self.addChapter = function (chapter, organizers) {
            chapterName = getChapterID(chapter)
            var chaptersRef = firebaseDB.ref('chapters/');
            chaptersRef.child(getChapterID(chapter)).set(chapter);
            self.addChapterToOrganizers(organizers)
        };

        function getChapterID(chapter) {
            return chapter.section.toLowerCase() + '_' + chapter.name.replace(' ', '_').toLowerCase();
        }

        self.addChapterToOrganizers = function (organizers) {
            organizers.forEach(function (org) {
                addChapterToOrganizer(org.email);
            })
        };

        function addChapterToOrganizer(orgMail) {
            firebaseDB.ref('orgs/').orderByChild('mail').equalTo(orgMail).once('value', function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    var orgID = childSnapshot.key;
                    var updates = getOrgObjectWhichHasAddedChapter();
                    firebaseDB.ref('orgs/' + orgID + '/chapters').update(updates);
                });
            });
        }

        function getOrgObjectWhichHasAddedChapter() {
            var organizerObject = {};
            organizerObject[chapterName] = true;
            return organizerObject;
        }

    }


    angular.module('gugCZ.webAdmin.chapter.services', [
            'gugCZ.webAdmin.common.firebase'
        ]
    )
        .service('firebaseData', firebaseFactory)

})();