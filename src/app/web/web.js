angular.module('gugCZ.webAdmin.web', [
  'ui.router',
  'gugCZ.webAdmin.web.form'
])
  .config(function ($stateProvider) {

    $stateProvider.state('web-content', {
      url: 'web/form',
      parent: 'base',
      templateUrl: 'app/web/form/form.html',
      controller: 'WebFormController',
      controllerAs: 'vm',
      data: {
        title: 'Obsah webu'  // TODO Add translation
      }
    });

  });
