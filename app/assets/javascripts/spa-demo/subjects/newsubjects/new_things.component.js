(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .component("sdNewThings", {
      templateUrl: thingsTemplateUrl,
      controller: CurrentThingsController,
      require: {
         areas: "^sdAreas"
      }
    })
    .component("sdCurrentThingInfo", {
      templateUrl: thingInfoTemplateUrl,
      controller: CurrentThingInfoController,
    })
    ;

  thingsTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function thingsTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.current_things_html;
  }
  thingInfoTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function thingInfoTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.current_thing_info_html;
  }

  CurrentThingsController.$inject = ["$scope",
                                     "spa-demo.subjects.currentSubjects",
                                     "spa-demo.subjects.ImageThing"];
  function CurrentThingsController($scope,currentSubjects, ImageThing) {
    var vm=this;
    vm.thingClicked = thingClicked;
    vm.isCurrentThing = currentSubjects.isCurrentThingIndex;

    vm.$onInit = function() {
      console.log("CurrentThingsController",$scope);
    }
    vm.$postLink = function() {
      $scope.$watch(
        function() { return currentSubjects.getCurrentImageIndex(); },
        function(image_id) {
          if (image_id) {
            vm.things = ImageThing.query({ image_id: image_id });
          } else {
            vm.things = null;
          }
        }
      );
    }
    return;
    //////////////
    function thingClicked(index) {
      currentSubjects.setCurrentThing(index);
    }
  }

  CurrentThingInfoController.$inject = ["$scope",
                                        "spa-demo.subjects.currentSubjects",
                                        "spa-demo.subjects.Thing",
                                        "spa-demo.authz.Authz"];
  function CurrentThingInfoController($scope,currentSubjects, Thing, Authz) {
    var vm=this;
    vm.nextThing = currentSubjects.nextThing;
    vm.previousThing = currentSubjects.previousThing;

    vm.$onInit = function() {
      console.log("CurrentThingInfoController",$scope);
    }
    vm.$postLink = function() {
      $scope.$watch(
        function() { return currentSubjects.getCurrentThing(); },
        newThing
      );
      $scope.$watch(
        function() { return Authz.getAuthorizedUserId(); },
        function() { newThing(currentSubjects.getCurrentThing()); }
      );
    }
    return;
    //////////////
    function newThing(link) {
      vm.link = link;
      vm.thing = null;
      if (link && link.thing_id) {
        vm.thing=Thing.get({id:link.thing_id});
      }
    }







  }
})();
