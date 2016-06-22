//'/ventas/get_list'
angular.module('panel').controller('RegistrosController',['$http','$mdDialog','uiGmapGoogleMapApi', function($http,$mdDialog,uiGmapGoogleMapApi){
    var vm = this;
    vm.fecha = 0;
    
    vm.listado_ventas = function(){
        var condiciones = {date : vm.fecha};
        $http.post('/ventas/get_list', {conditions : condiciones } ).success(function(response) {
            vm.ventas = [];
            vm.total = 0;
            for(var k in response.items){
                if(response.items[k].descuento){
                    vm.total += response.items[k].costo*0.9;
                }else{
                    vm.total += response.items[k].costo;
                }
                vm.ventas.push(response.items[k]);
            }
            console.log(vm.ventas);
            
        });
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
                
                $scope.map = { center: { latitude : 23.740979865680476,
                    longitude: -104.95682708808589 }, zoom: 8 };
                
                uiGmapGoogleMapApi.then(function (maps){
                    
                    console.log($scope.map);
                })
                
                /*
                uiGmapGoogleMapApi.then(function (maps)
        {
            vm.map = {
                control: {},
                center: {
                    latitude : 23.740979865680476,
                    longitude: -104.95682708808589
                },
                zoom  : 12,
            };
            
            vm.get_info_municipio = function(municipio_named, municipio_id){
                $state.transitionTo(GLOBAL_STATE + ".ficha-municipio", {MunicipioNombre: municipio_named},{ notify: false });
                vm.municipio_id = municipio_id;
                $anchorScroll('municipios');
                vm.loading = true;
                var condiciones = { 'named' : municipio_named };
                $http.post(GLOBAL_PATH + 'api/CompDirMunicipales/api_get_info_municipio', {conditions : condiciones}).success(function(response) {
                    if(vm.municipio_id === response.ResultadoConsulta[0].Id){
                        vm.fotos = [];
                        vm.titulo = response.ResultadoConsulta[0].Nombre;
                        var json = JSON.parse(response.ResultadoConsulta[0].Bounds);
                        vm.cabecera = response.ResultadoConsulta[0].Cabecera;
                        vm.presidente = response.ResultadoConsulta[0].Presidente;
                        vm.poblacion = response.ResultadoConsulta[0].Poblacion;
                        vm.telefono = response.ResultadoConsulta[0].Telefono;
                        vm.tiponomia = response.ResultadoConsulta[0].Tiponomia;
                        vm.infografia = response.ResultadoConsulta[0].Infografia;
                        vm.sitio = response.ResultadoConsulta[0].Sitio;
                        if(response.ResultadoConsulta[0].Fotos != ''){
                            vm.fotos = response.ResultadoConsulta[0].Fotos.split(",");
                        }
                        vm.loading = false; 
                        $timeout(function() {
                            vm.shape = vm.get_poly_shape(JSON.parse(response.ResultadoConsulta[0].Shape));
                            vm.map.bounds = {
                                northeast: {
                                    latitude : json[0].lat,
                                    longitude : json[0].lng
                                },
                                southwest: {
                                    latitude : json[1].lat,
                                    longitude : json[1].lng
                                }
                            };
                            vm.load_map = true;
                        });
                    }
                });
            }
            
            vm.get_listado_municipios = function(){
                var deferred = $q.defer();
                var condiciones = {};
                $http.post(GLOBAL_PATH + 'api/CompDirMunicipales/api_get_lista_municipios', {conditions : condiciones, limit : 100, order : ["named"]}).success(function(response){
                    deferred.resolve(response);            
                });
                return deferred.promise;
            }
            
            vm.get_listado_municipios().then(function(response){
                vm.municipios = response.ResultadoConsulta;
                var param = $stateParams.MunicipioNombre;
                for(var k in vm.municipios){
                    if(vm.municipios[k].Named === param){
                        vm.get_info_municipio(vm.municipios[k].Named, vm.municipios[k].Id);
                        return;
                    }
                }
                //El nombre del municipio es invalido, y por ende se carga el primer municipio
                vm.get_info_municipio(vm.municipios[0].Named, vm.municipios[0].Id);
            });
            
            vm.get_listado_municipios();//INICIALIZAR TODOS LOS DATOS SOLO CUANDO LA API DE GOOGLE MAPS ESTE LISTA PARA EVITAR ERRORES DE CARGA
        })*/
                
            },
            templateUrl : 'webroot/registros/submodules/form_registro.html',
        }).then(function() {
            
        }, function() {
//            vm.lista_paquetes();
        }); 
    }
    
}]);