(function() {
  'use strict';

  function SlackAuth(config, $q, $rootScope, $window, $document) {
    this.config = config;
    this.$window = $window;
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$document = $document;

    this.currentDeferred = null;

    this.boundedAuthCallback = this.authCallback_.bind(this);

  }

  SlackAuth.prototype.requestAuth = function() {
    if (!this.currentDeferred) {
      this.currentDeferred = this.$q.defer();
      this.$window.addEventListener('message', this.boundedAuthCallback, false);

      var screenCenterString = this.calculateWindowCenterOptions_(700, 700);
      this._authWindow = this.$window.open(this.buildAuthUri_(), 'Agnes Auth', screenCenterString, true);

      if (this._authWindow.focus) {
        this._authWindow.focus()
      }
    }

    return this.currentDeferred.promise;
  };

  SlackAuth.prototype.calculateWindowCenterOptions_ = function(width, height) {
    var screen = this.$window.screen;
    var dualScreenLeft = angular.isDefined(this.$window.screenLeft) ? this.$window.screenLeft : screen.left;
    var dualScreenTop = angular.isDefined(this.$window.screenTop) ? this.$window.screenTop : screen.top;
    var screenWidth = this.$window.innerWidth ? this.$window.innerWidth : this.$document.documentElement.clientWidth ? this.$document.documentElement.clientWidth : screen.width;
    var screenHeight = this.$window.innerHeight ? this.$window.innerHeight : this.$document.documentElement.clientHeight ? this.$document.documentElement.clientHeight : screen.height;
    var left = ((screenWidth / 2) - (width / 2)) + dualScreenLeft;
    var top = ((screenHeight / 2) - (height / 2)) + dualScreenTop;

    return 'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;
  };

  SlackAuth.prototype.buildAuthUri_ = function() {
    var base = 'https://slack.com/oauth/authorize';
    base += '?client_id=' + this.config.clientId;
    base += '&scope=' + this.config.scopes.join(',');
    base += '&redirect_uri=' + this.config.redirectUrl;
    if (this.config.state) {
      base += '&state=' + this.config.state;
    }
    if (this.config.teamId) {
      base += '&team=' + this.config.teamId;
    }
    return encodeURI(base);
  };

  SlackAuth.prototype.authCallback_ = function(event) {
    if (event.data.action && event.data.action === 'slack_auth') {

      var resultData = event.data.data;
      if (resultData.result === 'success') {
        this.currentDeferred.resolve(resultData.token);
      } else {
        this.currentDeferred.reject();
      }

      this.currentDeferred = null;

      if (this._authWindow) {
        this._authWindow.close();
        this.$window.removeEventListener('message', this.boundedAuthCallback, false);
      }
    }
  };

  function oauthProvider() {
    this.settings = {
      url: 'https://slack.com/oauth/authorize?scope=identity.basic',
      clientId: '',
      redirectUrl: '',
      teamId: '',
      scopes: ['identity.basic']
    };

    this.setClientId = function(clientId) {
      this.settings.clientId = clientId;
    };

    this.setRedirectUrl = function(redirectUrl) {
      this.settings.redirectUrl = redirectUrl;
    };

    this.$get = function($injector) {
      return $injector.instantiate(SlackAuth, {config: this.settings});
    };

  }

  angular.module('gugCZ.auth.slack', [
    'webStorageModule'
  ])
      .provider('slackAuth', oauthProvider)

})();