const component = {
  templateUrl: 'app/events/form/description/description.html',
  controller: DescriptionController,
  controllerAs: 'vm',
  bindings: {
    data: '='
  }
};


function DialogController($mdDialog, description) {
  this.description = description;

  this.hide = function () {
    $mdDialog.hide();
  };

  this.cancel = function () {
    $mdDialog.cancel();
  };

}

function DescriptionController($document, $mdDialog) {

  this.showDescription = function (ev, description) {

    return $mdDialog.show({   // TODO how to set dialog width?
      controller: DialogController,
      controllerAs: 'vm',
      locals: {
        description: description
      },
      templateUrl: 'app/events/form/description/description-dialog.html',
      parent: angular.element($document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  };
}

angular.module('gugCZ.webAdmin.events.form.description', [
])
    .component('description', component);
