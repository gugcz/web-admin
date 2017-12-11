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

function ChaptersController(firebaseData, $state) {

  this.chapters = firebaseData.getAllChapters();


  this.showChapterDialog = function (chapter) {
    const stateParams = {urlID: chapter.section + '-' + chapter.urlId};
    $state.go('chapters.edit', stateParams);
  };
  this.addChapter = function () {
    $state.go('chapters.add');
  };
}
