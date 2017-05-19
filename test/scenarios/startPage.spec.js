'use strict';

describe('starting page', function() {

  beforeEach(function() {

    browser.get('index.html');

  });

  it('should contain base template', function() {
    var body = element(by.tagName('body'));
    expect(body.getText()).toContain("Base Angular template");
  });

  it('should contain base template', function() {
    var versionInfo = element(by.binding('ngVersion.full'));

    expect(versionInfo.getText()).toMatch(/Use AngularJS 1.\d{1,2}.\d{1,2}/);
  });

});
