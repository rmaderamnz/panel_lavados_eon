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
                
                $http.post('/servicios/get_active', {} ).success(function(response) {
                    $scope.servicios = response.items;
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
                    console.log($scope.paquete);
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
    
}]);