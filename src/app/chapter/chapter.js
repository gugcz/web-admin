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

  this.allChapters = firebaseData.getAllChapters();
  this.allChapters.$loaded((data) => {
    this.chapters = data.sort(compare);
  });

  this.selectedSections = [];
  this.sections = ['GBG', 'GDG', 'GEG', 'GXG'];

  this.chipSelected = function (chip) {
    this.chapters = this.chapters.filter(chapter => {
      return this.selectedSections.length === 0 || this.selectedSections.indexOf(chapter.section.toUpperCase()) !== -1;
    }).sort(compare);
  };

  this.inputChanged = function() {
    this.chapters = this.allChapters;
    this.selectedSections.forEach(section => this.chipSelected(section));
    this.chapters = this.chapters.filter(chapter => chapter.name.toLowerCase().includes(this.searchedName.toLowerCase()));
  };

  this.querySectionSearch = function (searchText) {
    return this.sections.filter((section) => {
      return section.toLowerCase().indexOf(searchText.toLowerCase()) === 0;
    });
  };

  this.showChapterDialog = function (chapter) {
    const stateParams = {urlID: chapter.section + '-' + chapter.urlId};
    $state.go('chapters.edit', stateParams);
  };

  this.addChapter = function () {
    $state.go('chapters.add');
  };

  function compare(a, b) {
    return a.name < b.name ? -1 : 1;
  }

}
