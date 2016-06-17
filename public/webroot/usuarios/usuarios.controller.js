angular.module('panel').controller('UsuariosController',['$http','$mdDialog', function($http,$mdDialog){
    var vm = this;
    
    vm.listado_usuarios = function(){
        $http.post('/usuarios/list', {} ).success(function(response) {
            vm.usuarios = response.items;
        });
    }
    
    vm.borrar_usuario = function(ev, usuario_id){
        console.log(usuario_id);
        var confirm = $mdDialog.confirm();
            confirm.title('Borrar servicio');
            confirm.textContent('¿Esta seguro que desea borrar el usuario?, Esta acción es permanente');
            confirm.ok('Aceptar');
            confirm.cancel('Cancelar');
            confirm.targetEvent(ev);
            confirm.clickOutsideToClose(true);
        $mdDialog.show(confirm).then(function() {
            $http.post('/usuarios/delete', {conditions : {id : usuario_id}} ).success(function(response) {
                console.log(response);
                vm.listado_usuarios();
            });
        }, function() {
            //Cancel
        });
    }
    
}]);