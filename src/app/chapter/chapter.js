(function() {
  'use strict';

  angular.module('gugCZ.webAdmin.chapter', [
        'ui.router',
        'gugCZ.webAdmin.chapter.add'

      ]
  )
      .config(function($stateProvider) {

        $stateProvider.state('chapter-add', {
          url: '/chapter/add',
          templateUrl: 'app/chapter/add/add.html',
          controller: "AddChapterController",
          controllerAs: 'vm'
        });

      });


})();
