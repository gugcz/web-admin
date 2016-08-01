/**
 * Created by horm on 1.8.16.
 */
'use strict';
angular.module('AddChapterApp', ['ngMaterial', 'ngMessages'])
    .controller('AddChapterCtrl', AddChapterCtrl)
    .config(function ($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();
    });

function AddChapterCtrl($q, $timeout) {
    var self = this;
    var pendingSearch, cancelSearch = angular.noop;
    var cachedQuery, lastSearch;

    self.allContacts = loadContacts();
    self.contacts = [self.allContacts[0]];
    self.asyncContacts = [];
    self.filterSelected = true;

    self.querySearch = function (criteria) {
        cachedQuery = cachedQuery || criteria;
        return cachedQuery ? self.allContacts.filter(createFilterFor(cachedQuery)) : [];
    };

    self.delayedQuerySearch = function (criteria) {
        cachedQuery = criteria;
        if ( !pendingSearch || !debounceSearch() )  {
            cancelSearch();

            // htttp get
            return pendingSearch = $q(function(resolve, reject) {
                // Simulate async search... (after debouncing)
                cancelSearch = reject;
                $timeout(function() {

                    resolve( self.querySearch() );

                    refreshDebounce();
                }, Math.random() * 500, true)
            });
        }

        return pendingSearch;
    };

    self.chapter = {
        section: 'GDG',
        name: 'Prague',
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

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(contact) {
            return (contact._lowername.indexOf(lowercaseQuery) != -1);;
        };

    }

    function loadContacts() {
        var contacts = [
            'Marina Augustine',
            'Oddr Sarno',
            'Nick Giannopoulos',
            'Narayana Garner',
            'Anita Gros',
            'Megan Smith',
            'Tsvetko Metzger',
            'Hector Simek',
            'Some-guy withalongalastaname'
        ];

        return contacts.map(function (c, index) {
            var cParts = c.split(' ');
            var contact = {
                name: c,
                email: cParts[0][0].toLowerCase() + '.' + cParts[1].toLowerCase() + '@example.com',
                image: 'http://lorempixel.com/50/50/people?' + index
            };
            contact._lowername = contact.name.toLowerCase();
            return contact;
        });
    }
}



