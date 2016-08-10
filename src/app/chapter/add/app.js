/**
 * Created by horm on 1.8.16.
 */
'use strict';
angular.module('AddChapterApp', ['ngMaterial', 'ngMessages', 'FIREBASE_URL'])
    .constant('FIREBASE_URL', 'https://helloworld-ee64c.firebaseio.com/')// Testing project for
    .service('firebaseData', ['firebase', 'FIREBASE_URL', FirebaseFactory])
    .controller('AddChapterCtrl', AddChapterCtrl)
    .config(function ($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();
    });

function AddChapterCtrl(firebaseData) {
    var self = this;
    var pendingSearch, cancelSearch = angular.noop;
    var cachedQuery, lastSearch;
    var organizers = loadContactsProfilePicture(firebaseData.getAllOrganizers());

    self.asyncContacts = [];
    self.filterSelected = true;

    self.querySearch = function (criteria) {
        cachedQuery = cachedQuery || criteria;
        return cachedQuery ? organizers.filter(createFilterFor(cachedQuery)) : [];
    };

    self.delayedQuerySearch = function (criteria) {
        cachedQuery = criteria;
        if ( !pendingSearch || !debounceSearch() )  {
            cancelSearch();

            // http get
            return pendingSearch = $q(function (resolve, reject) {

                cancelSearch = reject;
                // Now, it shows all contacts
                refreshDebounce();
                resolve(self.querySearch());
            })
        }

        return pendingSearch;
    };

    self.chapter = {
        section: 'GDG',
        name: '',
        description: '',
        profilePicture: '',
        orgs: [],
        email: '',
        googlePlusLink: '',
        facebookLink: '',
        twitterLink: '',
        meetupID: '',
        meetupURL: '',
        coordinates: ''

    };

    function refreshDebounce() {
        lastSearch = 0;
        pendingSearch = null;
        cancelSearch = angular.noop;
    }

    function debounceSearch() {
        var now = new Date().getMilliseconds();
        lastSearch = lastSearch || now;

        return ((now - lastSearch) < 300);
    }

    function loadContactsProfilePicture(organizers) {

        return organizers.map(function (org, index) {
            var organizer = {
                name: org.name,
                email: org.mail,
                image: gravatar(org.mail)
            };
            return organizer;
        });
    }
}

function FirebaseFactory(FIREBASE_URL, $firebaseArray) {
    var self = this;
    self.chapters = null;

    self.getAllOrganizers = function () {
        var ref = new Firebase(FIREBASE_URL  + '/orgs');
        var organizers = $firebaseArray(ref);
        return organizers;
    };

    self.addChapter = function (chapter) {
        var ref = new Firebase(FIREBASE_URL  + '/chapters');
        var chapters = $firebaseArray(ref);
        chapters.$add(chapter)
    };

    self.addChapterWithOwnID = function (chapter) {
        var chaptersRef = new Firebase(FIREBASE_URL + 'chapters/');
        chaptersRef.child(getChapterID(chapter)).set(self.chapter);
    };

    self.getOrganizersByQuery = function (name) {

    };

    function getChapterID(chapter) {
        return chapter.section.toLowerCase() + '_' + chapter.name.replace(' ', '_').toLowerCase();
    }


}



