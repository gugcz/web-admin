(function () {
    'use strict';

    function AddChapterCtrl(firebaseData) {
        var vm = this;
        var organizersPromise = firebaseData.getAllOrganizers().then(loadContactsProfilePicture);

        vm.filterSelected = true;

        vm.delayedQuerySearch = function (criteria) {
            return organizersPromise.then(function (organizers) {
                return organizers.filter(createFilterFor(criteria));
            });
        };

        vm.chapter = {
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

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(organizer) {
                return (organizer._lowername.indexOf(lowercaseQuery) != -1);
            };
        }

        function loadContactsProfilePicture(organizers) {

            return organizers.map(function (org) {
                return {
                    name: org.name,
                    email: org.mail,
                    image: gravatar(org.mail),
                    _lowername: org.name.toLowerCase()
                };

            });
        }

        vm.add = function () {
            firebaseData.addChapterWithOwnID(vm.chapter)
        }
    }


    angular.module('gugCZ.webAdmin.chapter.add', [
            'gugCZ.webAdmin.chapter.services'
        ]
    )
        .controller("AddChapterCtrl", AddChapterCtrl)

})();






