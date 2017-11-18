angular.module('gugCZ.webAdmin.messages', [])

.service('messagesService', function ($mdToast) {
  this.showPositiveMessage = function (message) {
    $mdToast.show({
      hideDelay   : 3000,
      position    : 'bottom right',
      controller  : 'ToastCtrl',
      controllerAs: 'ts',
      templateUrl : 'common/messages/message-positive.html',
      locals: {message: message}
    });
  };
  this.showNegativeMessage = function (message) {
    $mdToast.show({
      hideDelay   : 3000,
      position    : 'bottom right',
      controller  : 'ToastCtrl',
      controllerAs: 'ts',
      templateUrl : 'common/messages/message-negative.html',
      locals: {message: message}
    });
  };
})

.controller('ToastCtrl', function (message, $mdToast) {
  this.message = message;
  this.close = function () {
    $mdToast.hide();
  }
});