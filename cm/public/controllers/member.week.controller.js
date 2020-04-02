(function (angular) {
    'use strict';
    angular.module('cm').controller('MemberWeekController', ['$stateParams', '$rootScope', '$state', '$log', 'memberPoints', function ($stateParams, $rootScope, $state, $log, memberPoints) {
        var controller = this;

        controller.points = memberPoints;

        return controller;
    }]);
}(window.angular));
