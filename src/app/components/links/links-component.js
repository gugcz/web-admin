const component = {
  templateUrl: 'app/components/links/links.html',
  controller: LinksController,
  controllerAs: 'vm',
  bindings: {
    links: '=',
    context: '@'
  }
};

function LinksController() {

  this.linkTypes = [
    {
      type: 'facebook',
      re: /facebook.com/i
    },
    {
      type: 'google-plus',
      re: /plus.google.com/i
    },
    {
      type: 'youtube',
      re: /youtube.com/i
    },
    {
      type: 'srazy',
      re: /srazy.info/i
    },
    {
      type: 'web',
      re: /srazy.info/i
    }
  ];

  function isLinkBlank(link) {
    return link.url === '';
  }

  this.removeLink = function (index) {
    if (index > -1 && !isLinkBlank(this.links[index])) {
      this.links.splice(index, 1);
    }
  };

  this.checkLastItem = function (index) {
    var isLast = this.links.length - index;
    if (!isLast) {
      return;
    }

    const lastItem = this.links[this.links.length - 1];

    if (lastItem.url.length > 0) {
      this.links.push({url: ''});
    }
  };

  this.updateType = function (index) {
    const currentItem = this.links[index];

    const passedTypes = this.linkTypes.filter(function (type) {
      return type.re.test(currentItem.url);
    });

    if (passedTypes.length > 0) {
      currentItem.type = passedTypes[0].type;
    } else {
      currentItem.type = null;
    }
  };

  this.onLinkUpdate = function (index) {
    this.updateType(index);
    this.checkLastItem(index);
  };

  this.$onInit = function () {
    if (!this.links) {
      this.links = [
        {url: ''}
      ];
    }
    this.onLinkUpdate(0); // TODO remove or init all?
  };

}

angular.module('gugCZ.webAdmin.components.links', [])
  .component('links', component);
