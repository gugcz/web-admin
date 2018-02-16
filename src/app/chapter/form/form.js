angular.module('gugCZ.webAdmin.chapter.form', [
  'gugCZ.webAdmin.chapter.services',
  'gugCZ.webAdmin.components.links'
])

  .config(function ($stateProvider) {

    $stateProvider.state('chapters.this', {
      url: 'chapters/edit/this',
      parent: 'base',
      templateUrl: 'app/chapter/form/form.html',
      controller: ChapterFormCtrl,
      controllerAs: 'vm',
      resolve: {
        chapter: function ($stateParams, firebaseData, organizerService) {
          return firebaseData.getChapterByID(organizerService.getCurrentChapter());
        }
      },
      data: {
        title: 'TITLES.EDIT_CHAPTER'
      }
    }).state('chapters.edit', {
      url: 'chapters/edit/:urlID',
      parent: 'base',
      templateUrl: 'app/chapter/form/form.html',
      controller: ChapterFormCtrl,
      controllerAs: 'vm',
      resolve: {
        chapter: function ($stateParams, firebaseData) {
          return firebaseData.getChapterByID($stateParams.urlID);
        }
      },
      data: {
        title: 'TITLES.EDIT_CHAPTER'
      }
    }).state('chapters.add', {
      url: 'chapters/add',
      parent: 'base',
      templateUrl: 'app/chapter/form/form.html',
      controller: ChapterFormCtrl,
      controllerAs: 'vm',
      resolve: {
        chapter: function() {
          return {};
        }
      },
      data: {
        title: 'TITLES.ADD_CHAPTER'
      }
    });

  });


function ChapterFormCtrl(firebaseData, chapter, $log, organizerService, $state, $mdToast, $translate) {

  this.savingChapter = false;
  const organizersPromise = firebaseData.getAllOrganizers().then(loadContactsProfilePicture);

  this.$onInit = function () {
    this.filterSelected = true;
    organizersPromise.then();
    firebaseData.getChapterOrgs(chapter.$id)
        .then(loadContactsProfilePicture)
        .then((data) => {
          this.organizers = data;
        });
    // TODO
    this.isAdmin = organizerService.isCurrentUserAdmin();

    this.chapter = chapter;
  };


  this.delayedQuerySearch = function (criteria) {
    return organizersPromise.then(function (organizers) {
      return organizers.filter(createFilterFor(criteria));
    });
  };

  this.updateOrgsIDS = function () {
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
        image: org.profilePicture || '/images/non_profilepic.png',
        _lowername: org.name.toLowerCase()
      };

    });
  }

  this.saveChapter = function () {

    this.savingChapter = true;
    if ($state.is('chapters.edit') || $state.is('chapters.this')) {

      Promise.all([firebaseData.addChapter(this.chapter), firebaseData.addChapterToOrganizers(this.organizers)]).then(() => {
        this.savingChapter = false;
        $mdToast.show(
            $mdToast.simple() // TODO zapouzdřit?
                .textContent($translate.instant('CHAPTERS.FORM.CHAPTER_SAVED'))
                .position('bottom right')
                .hideDelay(3000)
        );
      });


    }
    else {
      // TODO - Implement
    }
    //firebaseData.setChapterID(this.chapter);

  };
}
