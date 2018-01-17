const component = {
  templateUrl: 'app/components/picture/picture.html',
  controller: PictureController,
  controllerAs: 'vm',
  bindings: {
    pictureString: '=',
    note: '@'
  }
};

function PictureController() {
  this.removePicture = function () {
    this.pictureString = null;
  };

  this.updatePictureString = function () {
    this.pictureString = this.picture.src.substring(this.picture.src.indexOf(',') + 1);
  };
}

angular.module('gugCZ.webAdmin.components.picture', [])
    .component('pictureUpload', component);