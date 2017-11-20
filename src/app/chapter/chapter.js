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
      controller: ChaptersController,
      controllerAs: 'vm',
      data: {
        title: 'Správa chapterů'  // TODO Add translation
      }
    });

  });

function ChaptersController(firebaseData, $mdDialog, $document) {
  this.chapters = firebaseData.getAllChapters();
  this.showChapterDialog = function (chapter) {
    $mdDialog.show({   // TODO how to set dialog width?
      controller: 'ChapterFormController',
      controllerAs: 'vm',
      locals: {
        chapter: chapter
      },
      templateUrl: 'app/chapter/form/form.html',
      parent: angular.element($document.body),
      clickOutsideToClose: true
    })
  };
}
