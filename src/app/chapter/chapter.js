angular.module('gugCZ.webAdmin.chapter', [
  'ui.router',
  'gugCZ.webAdmin.chapter.form'
])
  .config(function ($stateProvider) {

    $stateProvider.state('chapter', {
      url: 'chapter/form',
      parent: 'base',
      templateUrl: 'app/chapter/form/form.html',
      controller: 'ChapterFormController',
      controllerAs: 'vm'
    });

  });

