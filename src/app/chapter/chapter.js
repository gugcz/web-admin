angular.module('gugCZ.webAdmin.chapter', [
  'ui.router',
  'gugCZ.webAdmin.chapter.form',
  'gugCZ.webAdmin.chapter.services'
])
  .config(function ($stateProvider) {

    $stateProvider.state('chapters', {
      url: 'chapters',
      parent: 'base',

      templateUrl: 'app/chapter/chapters.html',
      controller: function (firebaseData) {
        this.chapters = firebaseData.getAllChapters();
      },
      controllerAs: 'vm',
      data: {
        title: 'Správa chapterů'  // TODO Add translation
      }
    });

  });

