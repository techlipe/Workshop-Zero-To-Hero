(function (angular) {
    'use strict';
    angular.module('cm').controller('NewMemberController', ['$mdDialog', 'CMService', 'NotificacaoService', function ($mdDialog, CMService, NotificacaoService) {
        var controller = this;

        controller.members = [];
        controller.member = {
            nicknames: []
        };

        CMService.listMembers().then(function (response) {
            controller.members = response.data;
        });
        
        controller.cancel = function () {
            $mdDialog.cancel();
        };
        
        controller.select = function (name) {
            $mdDialog.hide(name);
        };

        controller.validateAndSend = function () {
            if (controller.member.name) {
                if (!controller.member.nicknames) {
                    controller.member.nicknames = [];
                }
                CMService.addMember(controller.member).then(function () {
                    $mdDialog.hide(controller.member.name);
                }, function (error) {
                    NotificacaoService.novaMensagem({
                        message: 'Erro ao adicionar membro: ' + error,
                        type: 'error'
                    });
                });
            }
        };

        return controller;
    }]);
}(window.angular));
