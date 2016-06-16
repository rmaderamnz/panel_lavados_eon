angular.module('panel').controller('ServiciosController',['$http','$scope','$mdDialog', function($http,$scope,$mdDialog){
    var vm = this;
    
    vm.lista_servicios = function(){
        $http.post('/servicios/get_list', {} ).success(function(response) {
            vm.servicios = response.items;
        });
    }
    
    vm.modal_servicio = function(ev, data){
        $mdDialog.show({
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            title: 'Crear un nuevo servicio',
            controller: function($scope,$http){
                
                if(data != undefined){
                    $scope.servicio = data;    
                } 
                
                $scope.nuevo_servicio = function(){
                    $http.post('/servicios/create', {conditions : $scope.servicio} ).success(function(response) {
//                        console.log(response);
                        $mdDialog.hide();
                    });
                }
                
                $scope.cerrar = function(){
                    $mdDialog.hide();
                }
            },
            templateUrl : 'webroot/admin_servicios/submodules/form_servicio.html',
        }).then(function() {
            vm.lista_servicios();
        }, function() {
//            vm.lista_servicios();
        }); 
    }
    
    vm.toggle_activo = function(ev, servicio){
//        console.log(servicio);
        var msg = '¿Esta seguro que desea desactivar el servicio?';
        var md_title = 'Desactivar servicio';
        if(!servicio.activo){
            msg = '¿Esta seguro que desea reactivar el servicio?';
            md_title = 'Reactivar servicio';
        }
        servicio.activo = !servicio.activo;
        var confirm = $mdDialog.confirm()
            confirm.title(md_title);
            confirm.textContent(msg);
            confirm.ok('Aceptar');
            confirm.cancel('Cancelar');
            confirm.targetEvent(ev);
            confirm.clickOutsideToClose(true);
        
        $mdDialog.show(confirm).then(function() {
            $http.post('/servicios/toogle', {conditions : {id : servicio['_id']}} ).success(function(response) {
                console.log(response);
                vm.lista_servicios();
            });
        }, function() {
            //Cancel
        });
    }
    
    vm.borrar_servicio = function(ev, servicio){
        var confirm = $mdDialog.confirm();
            confirm.title('Borrar servicio');
            confirm.textContent('¿Esta seguro que desea borrar el servicio?, Esta accion es permanente');
            confirm.ok('Aceptar');
            confirm.cancel('Cancelar');
            confirm.targetEvent(ev);
            confirm.clickOutsideToClose(true);
        $mdDialog.show(confirm).then(function() {
            $http.post('/servicios/delete', {conditions : {id : servicio['_id']}} ).success(function(response) {
                console.log(response);
                vm.lista_servicios();
            });
        }, function() {
            //Cancel
        });
    }
    
}]);