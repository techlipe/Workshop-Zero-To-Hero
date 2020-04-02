(function (angular) {
    'use strict';
    angular.module('cm').service('CMService', ['BASE_URL_BACK', '$http', function (BASE_URL_BACK, $http) {
        var service = this,
            endPointService = BASE_URL_BACK,
            headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
        
        service.sumPointsWeek = function (weekNum) {
            return $http.get(endPointService + 'points/week/' + (weekNum || ''), {
                data: '',
                headers: headers
            })
        };

        service.addPoint = function (registro) {
            return $http.post(endPointService + 'points', registro, {
                headers: headers
            });
        };
        
        service.listMembers = function () {
            return $http.get(endPointService + 'members', {
                data: '',
                headers: headers
            });
        };
        
        service.listMembersPoints = function (memberNameOrID, weekNum) {
            return $http.get(endPointService + 'members/' + memberNameOrID + '/week/' + weekNum, {
                headers: headers
            });
        };

        service.addMember = function (member) {
            return $http.post(endPointService + 'members', member, {
                headers: headers
            });
        };

        return service;
    }]);
}(window.angular));
