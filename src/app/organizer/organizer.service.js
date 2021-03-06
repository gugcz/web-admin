const getValueFromSnapshot = function (snapshot) {
  const value = snapshot.val();
  if (value) {
    value.$id = snapshot.key;
  }
  return value;
};

angular.module('gugCZ.webAdmin.organizers')
    .service('organizerService', function ($q, firebaseDB, $firebaseArray, $firebaseObject, $mdToast, firebaseSTORAGE) {
      this.currentChapter_ = null;
      this.currentUser_ = null;

      this.getCurrentUser = function () {
        const userRef = firebaseDB.ref('auth/' + firebase.auth().currentUser.uid);
        // TODO update when fb user change

        return userRef.once('value')
            .then(getValueFromSnapshot)
            .then(user => {
              if (user.organizerId) {
                return user;
              }

              const e = new Error('Auth problem');
              e.data = user ? 'auth: ' + user.$id : 'no auth';
              throw e;
            })
            .then(user => firebaseDB.ref('organizers/' + user.organizerId).once('value'))
            .then(getValueFromSnapshot)
            .then(function (organizer) {
              if (!organizer) {
                throw new Error('User data/pairing problem');
              }

              if (!organizer.chapters) {
                // TODO hotfix - uživatelé mohou existovat i bez chapterů
                organizer.chapters = {};
                $mdToast.show(
                    $mdToast.simple() // TODO zapouzdřit?
                        .textContent('Váš účet není přiřazen do chapteru, vyplňte si svůj profil a požádejte administrátory o přiřazení.')
                        .position('bottom right')
                        .toastClass('md-warn')
                        .hideDelay(30000)
                );
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

            }.bind(this))
            .catch(e => {
              alert(`Došlo k chybě, nahlašte prosím následující problém:\n ${e.message} \n ${e.stack} \n ${angular.toJson(e.data)}`);
              $state.go('error.500');
            });

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

      function isUploadedNewPicture(picture) {
        return picture && !isValidURL(picture);
      }

      function isValidURL(str) {
        return str.includes('http');
      }

      function getOrganizersRealtimeArray() {
        return $firebaseArray(firebaseDB.ref('organizers'));
      }

      function getRealtimeOrgAndSaveWithPicture(ref, profilePicture) {

        let realtimeOrg = $firebaseObject(ref);

        return realtimeOrg.$loaded().then(() => {
          realtimeOrg.profilePicture = profilePicture;
          return saveOrganizerChanges(realtimeOrg);
        });


      }

      function addNewOrganizer(organizer) {
        let profilePicture = organizer.profilePicture;
        organizer.profilePicture = null;
        organizer.createdAt = (new Date()).toISOString()

        return getOrganizersRealtimeArray().$add(organizer).then(ref => getRealtimeOrgAndSaveWithPicture(ref, profilePicture));
      }

      function getProfilePictureReference(organizerId) {
        return firebaseSTORAGE.ref('profilepics/' + organizerId + '.jpg');
      }

      function uploadOrganizerProfilePicture(organizer) {
        return getProfilePictureReference(organizer.$id).putString(organizer.profilePicture, 'base64');
      }

      function saveOrganizerWithProfilePictureURL(snapshot, organizer) {

        organizer.profilePicture = snapshot.downloadURL;
        return organizer.$save();
      }

      function saveOrganizerChanges(organizer) {
        if (isUploadedNewPicture(organizer.profilePicture)) { // TODO What about deleting profilepic

          return uploadOrganizerProfilePicture(organizer).then(snapshot => saveOrganizerWithProfilePictureURL(snapshot, organizer));
        }

        return organizer.$save();
      }


      this.saveOrganizer = function (organizer, isOrganizerAddition) {
        organizer.links = organizer.links.filter(link => link.url.length > 0);

        if (isOrganizerAddition) {

          return addNewOrganizer(organizer);
        }
        else {
          return saveOrganizerChanges(organizer);

        }
      };

    });

