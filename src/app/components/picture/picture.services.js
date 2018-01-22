angular.module('gugCZ.webAdmin.components.picture')
    .service('pictureService', function (firebaseSTORAGE, $q) {
      this.saveImage = function (base64String, pathWithName) {
        let picRef = firebaseSTORAGE.ref(pathWithName);

        return picRef.putString(base64String, 'base64');
      };

      this.saveImageAndGetUrlPromise = function (base64String, pathWithName) {
        return this.saveImage(base64String, pathWithName).then(snapshot => {return snapshot.downloadURL})
      };
    });