(function (angular) {
    'use strict';
    angular.module('cm').directive('notificacao', ['NotificacaoService', function (NotificacaoService) {
        return {
            restrict : 'E',
            replace: false,
            templateUrl: 'templates/notificacao.html',
            link : function (scope, element, attrs) {
                scope.align = attrs.align;
                scope.mensagensAtivas = NotificacaoService.mensagensAtivas;

                scope.removerMensagem = function (option) {
                    NotificacaoService.removerMensagem(option);
                };
            }
        };
	}]);
}(window.angular));
