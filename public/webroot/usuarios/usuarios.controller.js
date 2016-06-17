angular.module('panel').controller('UsuariosController',['$http','$mdDialog', function($http,$mdDialog){
    var vm = this;
    
    vm.listado_usuarios = function(){
        $http.post('/usuarios/list', {} ).success(function(response) {
            vm.usuarios = response.items;
        });
    }
    
}]);