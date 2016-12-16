(function() {
  'use strict';

  angular.module('gugCZ.webAdmin.chapter', [
      'ui.router',
      'gugCZ.webAdmin.chapter.add'

    ]
  )
    .config(function($stateProvider) {

      $stateProvider.state('chapter-add', {
        url: '/chapter/form',
        templateUrl: 'app/chapter/form/form.html',
        controller: "AddChapterController",
        controllerAs: 'vm'
      });

    });


})();
