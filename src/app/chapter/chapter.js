angular.module('gugCZ.webAdmin.chapter', [
  'ui.router',
  'gugCZ.webAdmin.chapter.add'
])
  .config(function ($stateProvider) {

    $stateProvider.state('chapter', {
      url: '/chapter/form',
      templateUrl: 'app/chapter/add/add.html',
      controller: 'AddChapterController',
      controllerAs: 'vm'
    });

  });

