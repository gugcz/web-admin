angular.module('gugCZ.webAdmin.chapter.form', [
  'gugCZ.webAdmin.chapter.services',
  'gugCZ.webAdmin.components.links'
])

  .config(function ($stateProvider) {

    $stateProvider.state('chapters.form', {
      url: 'chapters/form/:urlID',
      parent: 'base',
      templateUrl: 'app/chapter/form/form.html',
      controller: ChapterFormCtrl,
      controllerAs: 'vm',
      resolve: {
        chapter: function ($stateParams, firebaseData) {
          console.log($stateParams);
          return firebaseData.getChapterByID($stateParams.urlID);
        }
      },
      data: {
        title: 'Editace chapteru'  // TODO Add translation
      }
    });

  });


function ChapterFormCtrl(firebaseData, chapter) {
  const organizersPromise = firebaseData.getAllOrganizers().then(loadContactsProfilePicture);

  this.$onInit = function () {
    console.log('hier');
    this.filterSelected = true;
    this.organizers = [];

    // TODO
    this.isAdmin = true;

    this.chapter = chapter;

    this.organizers = [];
  };


  this.delayedQuerySearch = function (criteria) {
    return organizersPromise.then(function (organizers) {
      $log.debug(organizers);
      return organizers.filter(createFilterFor(criteria));
    });
  };

  this.updateOrgsIDS = function () {
    $log.debug('change');
    this.chapter.organizers = this.organizers.map(function (org) {
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

  this.add = function () {
    firebaseData.setChapterID(this.chapter);
    firebaseData.addChapter(this.chapter);
    firebaseData.addChapterToOrganizers(this.organizers);
  };
}
