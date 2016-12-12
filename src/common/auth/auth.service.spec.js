describe('cz.angular.common.auth.service', function() {

  beforeEach(module('cz.angular.common.auth.service'));

  beforeEach(module({
    API_URL: 'API_URL'
  }));

  it('should be defined as module', function() {
    expect(angular.module('cz.angular.common.auth.service')).toBeDefined();
  });

  it('should contains cz.angular.auth services', inject(function($injector) {
    expect($injector.has('authService')).toBe(true);
  }));

  describe('authService', function() {

    beforeEach(inject(function(authService) {
      this.authService = authService;
    }));

    it('should mark recoverable request ', function() {

      var response = {
        config: {
          url: 'someUrl'
        },
        status: 401
      };

      expect(this.authService.isRequestRecoverable(response)).toBe(true);
    });

    it('should mark request to login as unrecoverable', function() {

      var response = {
        config: {
          url: this.authService.LOGIN_URL
        },
        status: 401
      };

      expect(this.authService.isRequestRecoverable(response)).toBe(false);
    });

    it('should mark request with  status 403 as unrecoverable', function() {

      var response = {
        config: {
          url: 'someUrl'
        },
        status: 403
      };

      expect(this.authService.isRequestRecoverable(response)).toBe(false);
    });

  });
});
