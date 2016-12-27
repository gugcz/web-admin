(function () {
	'use strict';

	var component = {
		templateUrl: 'app/events/form/links/links.html',
		controller: LinksController,
		controllerAs: 'vm',
    bindings: {
		  linksArray: '='
    }
	};

	function LinksController() {
    // TODO repair binding
	  this.links = [
      {url: 'www.facebook.com'}
    ];

    function isLinkBlank(link) {
      return link.url === "";
    }

    this.removeLink = function(index) {
      if (index > -1 && !isLinkBlank(this.links[index])) {
        this.links.splice(index, 1);
      }
    }

    this.checkEmptyItem = function() {

      var lastItem = this.links[this.links.length - 1];

      if (lastItem.url.length > 0) {
        this.links.push({url: ''});
      }
    };

    this.checkEmptyItem();
	}

	angular.module('gugCZ.webAdmin.events.form.links', [ ])
	.component('links', component);

})();
