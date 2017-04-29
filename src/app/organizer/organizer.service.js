(function () {
  'use strict';

  var getValueFromSnapshot = function (snapshot) {
    return snapshot.val();
  };

  angular.module('gugCZ.webAdmin.organizers')
    .service('organizerService', function ($q, firebaseDB) {
      this.currentChapter_ = null;
      this.currentUser_ = null;

      this.getCurrentUser = function () {
        var userRef = firebaseDB.ref('organizers/-Kiq0zwfvevwW87mwwY_');
        //  TODO firebase.auth().currentUser.uid
        // TODO update when fb user change

        return userRef.once("value")
          .then(getValueFromSnapshot)
          .then(function (user) {

            var chapterPromises = Object.keys(user.chapters)
              .reduce(function (acc, key) {
                acc[key] = firebaseDB.ref('chapters/' + key)
                  .once("value")
                  .then(getValueFromSnapshot);

                return acc;
              }, {});

            return $q.all(chapterPromises)
              .then(function (chapters) {
                user.chapters = chapters;

                this.currentUser_ = user;
                return user;
              }.bind(this));

          }.bind(this));

      };

      this.setCurrentChapter = function (chapterId) {
        console.log(chapterId)
        this.currentChapter_ = chapterId;
      };

      this.getCurrentChapter = function () {
        if (this.currentChapter_) {
          return this.currentChapter_;
        } else if (this.currentUser_) {
          return this.currentChapter_ = Object.keys(this.currentUser_.chapters)[0];
        }

        return null;
      };

    });

})();
