const component = {
  templateUrl: 'app/chapter/add/orgs-chips/orgs-chips.html',
  controller: OrgsChipsController,
  controllerAs: 'vm',
  bindings: {
    contactOrganizers: '='
  }
};

function OrgsChipsController(firebaseData) {
  const vm = this;
  const organizersPromise = firebaseData.getAllOrganizers().then(loadContactsProfilePicture);

  vm.filterSelected = true;

  vm.delayedQuerySearch = function (criteria) {
    return organizersPromise.then(function (organizers) {
      return organizers.filter(createFilterFor(criteria));
    });
  };

  vm.organizers = [];

  vm.updateOrgsIDS = function () {
    vm.contactOrganizers = organizers.map(function (org) {
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
        // TODO Add email or slack nick, profile picture
        name: org.name,
        id: org.$id,
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

angular.module('gugCZ.webAdmin.chapters.add.orgsChips', [])
  .component('orgsChips', component);
