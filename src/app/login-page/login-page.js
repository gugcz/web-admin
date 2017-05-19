angular.module('gugCZ.webAdmin.loginPage',
  [
    'ui.router'
  ])
  .config(function ($stateProvider) {

    $stateProvider.state('loginPage', {
      url: '/login',
      controller: function () { },
      controllerAs: '$ctrl',
      templateUrl: 'app/login-page/login-page.html'
    });
  });
