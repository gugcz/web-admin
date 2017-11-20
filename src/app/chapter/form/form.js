function ChapterFormCtrl(firebaseData, $log) {
  const vm = this;
  const organizersPromise = firebaseData.getAllOrganizers().then(loadContactsProfilePicture);

  vm.filterSelected = true;

  vm.delayedQuerySearch = function (criteria) {
    return organizersPromise.then(function (organizers) {
      $log.debug(organizers);
      return organizers.filter(createFilterFor(criteria));
    });
  };

  vm.organizers = [];

  // TODO
  vm.isAdmin = true;

  vm.chapter = {
    section: '',
    name: 'Brno',
    description: '',
    profilePicture: '',
    organizers: [],
    email: '',
    coordinates: '',
    links: [
      {url: ''}
    ]
  };

  vm.organizers = [];

  vm.updateOrgsIDS = function () {
    $log.debug('change');
    vm.chapter.organizers = vm.organizers.map(function (org) {
      const orgID = {};
      orgID[org.id] = true;

      return orgID;

    });
  };

  function createFilterFor(query) {
    const lowercaseQuery = angular.lowercase(query);

    return function filterFn(org) {
      return (org._lowername.indexOf(lowercaseQuery) !== -1);
    };
  }

  function loadContactsProfilePicture(organizers) {

    return organizers.map(function (org) {
      return {
        name: org.name,
        chapters: org.chapters,
        email: org.email,
        image: gravatar(org.email),
        _lowername: org.name.toLowerCase()
      };

    });
  }

  vm.add = function () {
    firebaseData.setChapterID(vm.chapter);
    firebaseData.addChapter(vm.chapter);
    firebaseData.addChapterToOrganizers(vm.organizers);
  };
}


angular.module('gugCZ.webAdmin.chapter.form', [
  'gugCZ.webAdmin.chapter.services',
  'gugCZ.webAdmin.components.links'
])
  .controller('ChapterFormController', ChapterFormCtrl);
