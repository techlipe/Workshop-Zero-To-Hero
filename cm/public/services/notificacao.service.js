(function (angular) {
    'use strict';
    angular.module('cm').service('NotificacaoService', ['$timeout', function ($timeout) {
        var service = this;

        service.mensagensAtivas = [];

        service.novaMensagem = function (options) {
            options.timeout = options.timeout || 3000;
            options.type = options.type || 'info';
            service.mensagensAtivas.push(options);
            if (options.timeout > 0) {
                options.timeoutId = $timeout(function () {
                    service.mensagensAtivas.splice(service.mensagensAtivas.indexOf(options), 1);
                }, options.timeout);
            }
        };

        service.removerMensagem = function (options) {
            if (options.timeoutId) {
                $timeout.cancel(options.timeoutId);
            }
            service.mensagensAtivas.splice(service.mensagensAtivas.indexOf(options), 1);
        };

        return service;
    }]);
}(window.angular));
