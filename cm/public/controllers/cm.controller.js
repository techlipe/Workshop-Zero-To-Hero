(function (angular, moment) {
    'use strict';
    angular.module('cm').controller('CMController', ['$stateParams', '$rootScope', '$state', '$log', 'sumPointsThisWeek', 'sumPointsLastWeek', function ($stateParams, $rootScope, $state, $log, sumPointsThisWeek, sumPointsLastWeek) {
        var controller = this;

        controller.sumPointsThisWeek = sumPointsThisWeek;
        controller.sumPointsLastWeek = sumPointsLastWeek;

        controller.thisWeek = moment().utc().week();
        controller.lastWeek = moment().utc().week() - 1;

        return controller;
    }]);
}(window.angular, window.moment));
