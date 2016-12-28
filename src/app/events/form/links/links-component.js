(function() {
  'use strict';

  var component = {
    templateUrl: 'app/events/form/links/links.html',
    controller: LinksController,
    controllerAs: 'vm',
    bindings: {
      links: '='
    }
  };

  function LinksController() {

    this.linkTypes = [
      {
        type: "facebook",
        re: /facebook.com/i
      },
      {
        type: "google-plus",
        re: /plus.google.com/i
      },
      {
        type: "youtube",
        re: /youtube.com/i
      },
      {
        type: "srazy",
        re: /srazy.info/i
      },
      {
        type: "web",
        re: /srazy.info/i
      }
    ];

    function isLinkBlank(link) {
      return link.url === "";
    }

    this.removeLink = function(index) {
      if (index > -1 && !isLinkBlank(this.links[index])) {
        this.links.splice(index, 1);
      }
    };

    this.checkLastItem = function(index) {
      var isLast = this.links.length - index;
      if (!isLast) {
        return;
      }

      var lastItem = this.links[this.links.length - 1];

      if (lastItem.url.length > 0) {
        this.links.push({url: ''});
      }
    };

    this.updateType = function(index) {
      var currentItem = this.links[index];

      var passedTypes = this.linkTypes.filter(function(type) {
        return type.re.test(currentItem.url);
      });

      if (passedTypes.length > 0) {
        currentItem.type = passedTypes[0].type;
      } else {
        currentItem.type = null;
      }
    };

    this.onLinkUpdate = function(index) {
      this.updateType(index);
      this.checkLastItem(index);
    };

    this.$onInit = function() {
      this.onLinkUpdate(0); // TODO remove or init all?
    };

  }

  angular.module('gugCZ.webAdmin.events.form.links', [])
    .component('links', component);

})();
