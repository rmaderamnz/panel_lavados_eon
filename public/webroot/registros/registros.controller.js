//'/ventas/get_list'
angular.module('panel').controller('RegistrosController',['$http','$mdDialog', function($http,$mdDialog){
    var vm = this;
    vm.fecha = 0;
    
    vm.listado_ventas = function(){
        var condiciones = {date : vm.fecha};
        $http.post('/ventas/get_list', {conditions : condiciones } ).success(function(response) {
            vm.ventas = response.items;
        });
    }
    
    vm.consultar_venta = function(){
        
    }
    
}]);