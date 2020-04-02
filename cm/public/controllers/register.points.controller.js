(function (angular) {
    'use strict';
    angular.module('cm').controller('RegisterPointsController', ['$element', '$mdDialog', 'CMService', 'NotificacaoService', function ($element, $mdDialog, CMService, NotificacaoService) {
        var controller = this;

        controller.members = [];
        controller.report = {};

        controller.init = function () {
            CMService.listMembers().then(function (response) {
                controller.members = response.data;
            });
        };

        controller.newMember = function (ev) {
            $mdDialog.show({
                controller: 'NewMemberController',
                controllerAs: 'nmCtrl',
                templateUrl: 'templates/members.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function (answer) {
                controller.report.name = answer;
                controller.init();
            }, function () {

            });
        };

        controller.validateAndSend = function () {
            if (controller.report.name) {
                controller.report.date = new Date().getTime();
                CMService.addPoint(controller.report).then(function () {
                    NotificacaoService.novaMensagem({
                        message: 'Ponto registrado com sucesso',
                        type: 'info'
                    });
                }, function (error) {
                    NotificacaoService.novaMensagem({
                        message: 'Erro ao adicionar registro: ' + error,
                        type: 'error'
                    });
                });
            }
        };

        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });

        controller.init();

        return controller;
    }]);
}(window.angular));
