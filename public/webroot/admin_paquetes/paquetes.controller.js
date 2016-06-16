angular.module('panel').controller('PaquetesController',['$http','$mdDialog', function($http,$mdDialog){
    var vm = this;
    
    vm.lista_paquetes = function(){
        $http.post('/paquetes/get_list', {} ).success(function(response) {
            vm.paquetes = response.items;
        });
    }
    
    vm.modal_paquetes = function(ev, data){
        $mdDialog.show({
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            title: 'Crear un nuevo servicio',
            controller: function($scope,$http){
                $scope.costo = 0;
                $scope.paquete = {};
                
                if(data != undefined){
                    $scope.paquete = data;
                }
                
                $http.post('/servicios/get_active', {} ).success(function(response) {
                    $scope.servicios = response.items;
                    $scope.costo = 0;
                    for(var k in $scope.servicios){
                        for(var y in $scope.paquete.servicios){
                            if($scope.paquete.servicios[y].id == $scope.servicios[k]['_id']){
                                $scope.costo += $scope.servicios[k].precio;
                                $scope.servicios[k].paquete = true;
                                break;
                            }
                        }
                    } 
                });
                
                $scope.toggle_servicio = function(){
                    $scope.paquete.servicios = [];
                    $scope.costo = 0;
                    for(var k in $scope.servicios){
                        if($scope.servicios[k].paquete){
                            $scope.costo += $scope.servicios[k].precio;
                            $scope.paquete.servicios.push({
                                id : $scope.servicios[k]['_id'],
                                precio : $scope.servicios[k].precio,
                                nombre : $scope.servicios[k].nombre
                            });
                        }   
                    }
                }
                
                $scope.nuevo_paquete = function(){
                    $http.post('/paquetes/create', {conditions : $scope.paquete} ).success(function(response) {
//                        console.log(response);
                        $mdDialog.hide();
                    });
                }
                                
                $scope.cerrar = function(){
                    $mdDialog.hide();
                }
            },
            templateUrl : 'webroot/admin_paquetes/submodules/form_paquetes.html',
        }).then(function() {
            
        }, function() {
            vm.lista_paquetes();
        }); 
    }
    
    vm.borrar_paquete = function(ev, paquete){
        var confirm = $mdDialog.confirm();
            confirm.title('Borrar servicio');
            confirm.textContent('¿Esta seguro que desea borrar el paquete?, Esta acción es permanente');
            confirm.ok('Aceptar');
            confirm.cancel('Cancelar');
            confirm.targetEvent(ev);
            confirm.clickOutsideToClose(true);
        $mdDialog.show(confirm).then(function() {
            $http.post('/paquetes/delete', {conditions : {id : paquete['_id']}} ).success(function(response) {
                console.log(response);
                vm.lista_paquetes();
            });
        }, function() {
            //Cancel
        });
    }
    
}]);