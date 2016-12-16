describe('gugCZ.auth.uiRouter', function() {

  beforeEach(module('gugCZ.auth.uiRouter'));

  var stateAuthService;
  var $stateMock, authServiceMock, authLoginModalMock;

  beforeEach(function() {
    $stateMock = {
      go: function() {
      }
    };

    authServiceMock = {
      isAuthenticated: function() { },
      hasSomeRole: function() { },
      login: function() { },
      isPending: function() {
        return false;
      }
    };

    module({
      $state: $stateMock,
      authService: authServiceMock,
      authLoginModal: authLoginModalMock
    });
  });

  beforeEach(inject(function(stateAuth) {
    stateAuthService = stateAuth;
  }));

  it('should be defined as module', function() {
    expect(angular.module('gugCZ.auth.uiRouter')).toBeDefined();
  });

  it('should contains cz.angular.auth services', inject(function($injector) {
    expect($injector.has('authLoginModal')).toBe(true);
    expect($injector.has('authService')).toBe(true);
  }));

  describe('public visibility check', function() {

    it('should indicate user has permission if state has no data attribute', inject(function() {
      var state = {};
      expect(stateAuthService.isPublicVisible(state)).toBe(true);
    }));

    it('should indicate user has permission if data attribute does not contain auth properties', inject(function() {
      var state = {
        data: {
          a: true,
          b: false
        }
      };

      expect(stateAuthService.isPublicVisible(state)).toBe(true);
    }));

    it('should indicate user has permission if data.authLogged is false', inject(function() {
      var state = {
        data: {
          authLogged: false
        }
      };

      expect(stateAuthService.isPublicVisible(state)).toBe(true);
    }));

    it('should indicate user has permission if data.authRoles is empty', inject(function() {
      var state = {
        data: {
          authRoles: []
        }
      };

      expect(stateAuthService.isPublicVisible(state)).toBe(true);
    }));

    it('should indicate user has not permission if data.authLogged is true and user is not logged', inject(function() {
      var state = {
        data: {
          authLogged: true
        }
      };

      expect(stateAuthService.isPublicVisible(state)).toBe(false);
    }));

    it('should indicate user has not permission if data.authRoles is not empty and user is not logged', inject(function() {
      var state = {
        data: {
          authRoles: ['some_role']
        }
      };

      expect(stateAuthService.isPublicVisible(state)).toBe(false);
    }));

  });

  describe('check if route is visible for user', function() {
    var eventMock;

    beforeEach(function() {

      eventMock = {
        preventDefault: function() {
        }
      };
      spyOn(eventMock, 'preventDefault');

    });

    it('should not stop event, if state is public visible', inject(function() {
      var state = {};

      stateAuthService.checkPermissionWhenStateChangeStarted(eventMock, state);

      expect(eventMock.preventDefault).not.toHaveBeenCalled();
    }));

    it('should not stop event, if state need authentication and user is logger', inject(function() {
      var state = {
        data: {
          authLogged: true
        }
      };

      spyOn(authServiceMock, 'isAuthenticated').and
        .callFake(function() {
          return true;
        });

      stateAuthService.checkPermissionWhenStateChangeStarted(eventMock, state);

      expect(eventMock.preventDefault).not.toHaveBeenCalled();
      expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
    }));

    it('should not stop event, if state need authentication and user has roles', inject(function() {
      var state = {
        data: {
          authRoles: ['some_role']
        }
      };

      spyOn(authServiceMock, 'isAuthenticated').and.callFake(function() {
        return true;
      });

      spyOn(authServiceMock, 'hasSomeRole')
        .and
        .callFake(function() {
          return true;
        });

      stateAuthService.checkPermissionWhenStateChangeStarted(eventMock, state);

      expect(eventMock.preventDefault).not.toHaveBeenCalled();
      expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
      expect(authServiceMock.hasSomeRole).toHaveBeenCalled();
    }));

    it('should stop event and broadcast permissionError, if state need authentication and user has not roles', inject(function($rootScope) {
      var calledFlag = false;
      var state = {
        data: {
          authLogged: true,
          authRoles: ['someRole']
        }
      };

      spyOn(authServiceMock, 'isAuthenticated')
        .and
        .callFake(function() {
          return true;
        });

      spyOn(authServiceMock, 'hasSomeRole')
        .and
        .callFake(function() {
          return false;
        });

      $rootScope.$on('cz.angular.auth:permissionError', function() {
        calledFlag = true;
      });

      stateAuthService.checkPermissionWhenStateChangeStarted(eventMock, state);

      expect(eventMock.preventDefault).toHaveBeenCalled();
      expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
      expect(authServiceMock.hasSomeRole).toHaveBeenCalled();

      expect(calledFlag).toBe(true);

    }));

    it('should stop event and open modal window, if user is not authenticated', inject(function($q) {
      var state = {
        data: {
          authLogged: true
        }
      };

      spyOn(authServiceMock, 'isAuthenticated')
        .and
        .callFake(function() {
          return false;
        });

      spyOn(authServiceMock, 'login')
        .and
        .callFake(function() {
          return $q.defer().promise;
        });

      stateAuthService.checkPermissionWhenStateChangeStarted(eventMock, state);

      expect(eventMock.preventDefault).toHaveBeenCalled();
      expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
      expect(authServiceMock.login).toHaveBeenCalled();

    }));

    it('should stop event if auth is pending', inject(function($q, $rootScope) {
      var calledFlag = false;
      var state = {
        data: {
          authRoles: ['some_role']
        }
      };

      spyOn(authServiceMock, 'isPending')
        .and
        .callFake(function() {
          return true;
        });

      authServiceMock.firebaseAuthReadyPromise = $q.defer().promise;

      stateAuthService.checkPermissionWhenStateChangeStarted(eventMock, state);
      $rootScope.$apply();

      expect(eventMock.preventDefault).toHaveBeenCalled();

    }));

    it('should broadcast loginCanceled, if modal is rejected', inject(function($q, $rootScope) {
      var calledFlag = false;
      var state = {
        data: {
          authLogged: true
        }
      };

      spyOn($stateMock, 'go');

      spyOn(authServiceMock, 'isAuthenticated')
        .and
        .callFake(function() {
          return false;
        });

      spyOn(authServiceMock, 'login')
        .and
        .callFake(function() {
          return $q.reject();
        });

      $rootScope.$on('auth:loginCanceled', function() {
        calledFlag = true;
      });

      stateAuthService.checkPermissionWhenStateChangeStarted(eventMock, state);
      $rootScope.$apply();

      expect($stateMock.go).not.toHaveBeenCalled();
      expect(calledFlag).toBe(true);

    }));

  });

});
