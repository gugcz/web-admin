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
        
        vm.organizers = [];

        vm.chapter = {
            section: 'GDG',
            name: '',
            description: '',
            profilePicture: '',
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

            return function filterFn(org) {
                return (org._lowername.indexOf(lowercaseQuery) != -1);
            };
        }

        function loadContactsProfilePicture(organizers) {
            console.log(organizers);

            return organizers.map(function (org) {
                return {
                    name: org.name,
                    chapters: org.chapters,
                    email: org.mail,
                    image: gravatar(org.mail),
                    _lowername: org.name.toLowerCase()
                };

            });
        }

        vm.add = function () {
            firebaseData.setChapterID(vm.chapter);
            firebaseData.addChapter(vm.chapter);
            firebaseData.addChapterToOrganizers(vm.organizers);
        }
    }


    angular.module('gugCZ.webAdmin.chapter.add', [
            'gugCZ.webAdmin.chapter.services'
        ]
    )
        .controller("AddChapterCtrl", AddChapterCtrl)

})();






