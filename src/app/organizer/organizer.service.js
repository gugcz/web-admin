const getValueFromSnapshot = function (snapshot) {
  const value = snapshot.val();
  if (value) {
    value.$id = snapshot.key;
  }
  return value;
};

angular.module('gugCZ.webAdmin.organizers')
    .service('organizerService', function ($q, firebaseDB, $firebaseArray, $firebaseObject, firebaseSTORAGE) {
      this.currentChapter_ = null;
      this.currentUser_ = null;

      this.getCurrentUser = function () {
        const userRef = firebaseDB.ref('auth/' + firebase.auth().currentUser.uid);
        // TODO update when fb user change

        return userRef.once('value')
            .then(getValueFromSnapshot)
            .then(user => firebaseDB.ref('organizers/' + user.organizerId).once('value'))
            .then(getValueFromSnapshot)
            .then(function (organizer) {
              if (!organizer || !organizer.chapters) {
                return {};
              }

              const chapterPromises = Object.keys(organizer.chapters)
                  .reduce(function (acc, key) {
                    acc[key] = firebaseDB.ref('chapters/' + key)
                        .once('value')
                        .then(getValueFromSnapshot);

                    return acc;
                  }, {});

              return $q.all(chapterPromises)
                  .then(function (chapters) {
                    organizer.chapters = chapters;

                    this.currentUser_ = organizer;
                    return organizer;
                  }.bind(this));

            }.bind(this));

      };

      this.isCurrentUserAdmin = function () {


        if (this.currentUser_.roles) {

          return (this.currentUser_.roles.admin);
        }
        return false;
      };

      this.getAllOrganizers = function () {
        return $firebaseArray(firebaseDB.ref('organizers'));
      };

      this.setCurrentChapter = function (chapterId) {
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

      this.loadOrganizer = function (orgId) {
        return $firebaseObject(firebaseDB.ref('organizers/' + orgId)).$loaded().then(organizer => {
          return organizer;
        });
      };

      function isUploadedNewPicture(organizer) {
        return organizer.profilePicture && !organizer.profilePicture.isPath;
      }

      // TODO Extract and refactor
      this.saveOrganizer = function (organizer) {

        organizer.links = organizer.links.filter(link => link.url.length > 0);

        if (isUploadedNewPicture(organizer)) {
          let profilePicRef = firebaseSTORAGE.ref('profilepics/' + organizer.$id + '.png');

          profilePicRef.putString(organizer.profilePicture.src.substring(organizer.profilePicture.src.indexOf(',') + 1), 'base64').then(snapshot => {
            profilePicRef.getDownloadURL().then(url => {
              organizer.profilePicture = url;
              return organizer.$save();
            });

          });

        }
        else {

          if (organizer.profilePicture) {
            organizer.profilePicture = organizer.profilePicture.src;
          }
          return organizer.$save();
        }

      };

    });

