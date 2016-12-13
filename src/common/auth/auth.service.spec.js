describe('gugCZ.auth.service', function() {

  beforeEach(module('gugCZ.auth.service'));

  beforeEach(module({
    API_URL: 'API_URL'
  }));

  it('should be defined as module', function() {
    expect(angular.module('gugCZ.auth.service')).toBeDefined();
  });

  it('should contains cz.angular.auth services', inject(function($injector) {
    expect($injector.has('authService')).toBe(true);
  }));

});
