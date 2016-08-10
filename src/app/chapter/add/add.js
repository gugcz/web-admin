function AddChapterCtrl($q, $timeout, FirebaseData) {
    var self = this;
    var pendingSearch, cancelSearch = angular.noop;
    var cachedQuery, lastSearch;
    var organizers = loadContactsProfilePicture(FirebaseData.getAllOrganizers());

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


    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(organizer) {
            return (organizer._lowername.indexOf(lowercaseQuery) != -1);
        };

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
                image: gravatar(org.mail),
                _lowername: org.name.toLowerCase()
            };
            return organizer;
        });
    }
    
    self.add = function () {
        FirebaseData.addChapterWithOwnID(self.chapter)
    }
}

function Orgnizer(name, mail) {
    this.name = name;
    this.mail = mail;
}





