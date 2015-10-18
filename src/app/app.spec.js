describe('application', function() {

  beforeEach(module('gugCZ.webAdmin'));

  it('should have defined module', function() {
    expect(angular.module('gugCZ.webAdmin')).toBeDefined();
  });
});
