angular.module('gugCZ.webAdmin.messages', [])

.service('messagesService', function ($mdToast) {
  this.showPositiveMessage = function () {
    $mdToast.show({
      hideDelay   : 3000,
      position    : 'bottom right',
      controller  : 'ToastCtrl',
      controllerAs: 'ts',
      templateUrl : 'common/messages/message-positive.html'
    });
  };
  this.showNegativeMessage = function () {
    $mdToast.show({
      hideDelay   : 3000,
      position    : 'bottom right',
      controller  : 'ToastCtrl',
      controllerAs: 'ts',
      templateUrl : 'common/messages/message-negative.html'
    });
  };
})

.controller('ToastCtrl', function ($mdToast) {
  this.close = function () {
    $mdToast.hide();
  }
});