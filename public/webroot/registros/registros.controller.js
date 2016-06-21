//'/ventas/get_list'
angular.module('panel').controller('RegistrosController',['$http','$mdDialog', function($http,$mdDialog){
    var vm = this;
    vm.fecha = 0;
    
    vm.listado_ventas = function(){
        var condiciones = {date : vm.fecha};
        $http.post('/ventas/get_list', {conditions : condiciones } ).success(function(response) {
//            vm.ventas = response.items;
            vm.pendientes = [];
            vm.ventas = [];
            vm.total = 0;
            for(var k in response.items){
                if(response.items[k].pagado){
                    vm.total += response.items[k].costo;
                    vm.ventas.push(response.items[k]);
                }else{
                    vm.pendientes.push(response.items[k]);
                }
//                console.log(vm.ventas[k])
            }
            console.log(vm.pendientes);
            console.log(vm.ventas);
            
        });
    }
    
    vm.confirmar_venta = function(ev, data){
        var confirm = $mdDialog.confirm();
            confirm.title('Borrar servicio');
            confirm.textContent('¿Esta seguro que desea borrar el servicio?, Esta accion es permanente');
            confirm.ok('Aceptar');
            confirm.cancel('Cancelar');
            confirm.targetEvent(ev);
            confirm.clickOutsideToClose(true);
        $mdDialog.show(confirm).then(function() {
            var condiciones = {venta_id : vm.fecha, operacion : 'confirm'};
            $http.post('/ventas/confirm', {conditions : condiciones } ).success(function(response) {
                vm.listado_ventas();
            });
        }, function() {
            //Cancel
        });
            
        /*
        venta_id
operacion
        */
    }
    
    vm.cancelar_venta = function(ev, data){
        
    }
    
    vm.consultar_venta = function(ev, data){
        $mdDialog.show({
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            title: 'Consultar compra',
            controller: function($scope,$http){
                $scope.venta = data;
                
                $scope.cerrar = function(){
                    $mdDialog.hide();
                }
            },
            templateUrl : 'webroot/registros/submodules/form_registro.html',
        }).then(function() {
            
        }, function() {
//            vm.lista_paquetes();
        }); 
    }
    
}]);