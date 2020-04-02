(function (angular, moment) {
    'use strict';
    angular.module('cm', ['ui.router', 'ngMaterial', 'ngMessages', 'ngSanitize'])
        .constant('BASE_URL_BACK', '/cm/')
        .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$mdThemingProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, $mdThemingProvider) {
            $mdThemingProvider.theme('default').primaryPalette('blue').accentPalette('indigo');
            $urlRouterProvider.otherwise('/');
            $httpProvider.interceptors.push(['$rootScope', '$q', function ($rootScope, $q) {
                return {
                    'request': function (config) {
                        if ($rootScope.estaCarregando) {
                            $rootScope.estaCarregando = $rootScope.estaCarregando + 1;
                        } else {
                            $rootScope.estaCarregando = 1;
                        }
                        return config;
                    },
                    'response': function (config) {
                        $rootScope.estaCarregando = $rootScope.estaCarregando - 1;
                        return config;
                    },
                    'responseError': function (rejection) {
                        $rootScope.estaCarregando = $rootScope.estaCarregando - 1;
                        return $q.reject(rejection);
                    }
                };
            }]);
            $stateProvider.state('/', {
                url: '/',
                controller: 'CMController',
                controllerAs: 'cmCtrl',
                templateUrl: 'templates/cm.html',
                resolve: {
                    sumPointsThisWeek: ['CMService', function (CMService) {
                        return CMService.sumPointsWeek().then(function (response) {
                            return response.data;
                        });
                    }],
                    sumPointsLastWeek: ['CMService', function (CMService) {
                        return CMService.sumPointsWeek(moment().utc().week() - 1).then(function (response) {
                            return response.data;
                        });
                    }]
                }
            });
            $stateProvider.state('member-points', {
                url: '/member/:memberName/week/:numWeek',
                controller: 'MemberWeekController',
                controllerAs: 'memberWeekCtrl',
                templateUrl: 'templates/memberWeek.html',
                resolve: {
                    memberPoints: ['CMService', '$stateParams', function (CMService, $stateParams) {
                        return CMService.listMembersPoints($stateParams.memberName, $stateParams.numWeek).then(function (response) {
                            return response.data;
                        });
                    }]
                }
            });
            $stateProvider.state('register-points', {
                url: '/register-points',
                controller: 'RegisterPointsController',
                controllerAs: 'rpCtrl',
                templateUrl: 'templates/register.points.html',
                resolve: {
                    sumPointsThisWeek: ['CMService', function (CMService) {
                        return CMService.sumPointsWeek().then(function (response) {
                            return response.data;
                        });
                    }],
                    sumPointsLastWeek: ['CMService', function (CMService) {
                        return CMService.sumPointsWeek(moment().utc().week() - 1).then(function (response) {
                            return response.data;
                        });
                    }]
                }
            });

        }]);
}(window.angular, window.moment));
