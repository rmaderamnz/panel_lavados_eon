angular.module('panel').controller('DashboardController',['$http','$mdDialog', function($http,$mdDialog){
//    console.log('Estoy en el controlador del dashboard');
    var vm = this;
    vm.fecha = 0;
    vm.vista = 1
    
    vm.chartServicios = {
        title: {
            text: ''
        },
        useHighStocks: false,
    }
    
    vm.chartPaquetes = {
        title: {
            text: ''
        },
        useHighStocks: false,
    }
    
    vm.chartClientes = {
        title: {
            text: ''
        },
        useHighStocks: false,
    }
    
    vm.estadisticas = function(){
        var condiciones = {date : vm.fecha};
//        console.log(condiciones);
        $http.post('/ventas/resumen', {conditions : condiciones } ).success(function(response) {
            console.log(response);
            var categories = {
                servicios : [],
                paquetes : [],
            };
            
            var labels = {
                servicios : [],
                paquetes : [],
            };
            
            //Servicio
            vm.servicios = response.items.servicios;
            for (var k in vm.servicios){
                categories.servicios.push({
                    name: vm.servicios[k].nombre,
                    y: vm.servicios[k].ventas,
                })
            }
            vm.chartServicios = {
                options :{
                    chart:{
                        type : 'column'
                    },
                    credits: { 
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                },
                series: [{
                    colorByPoint: true,
                    name : 'Ventas',
                    threshold: null,
                    data : categories.servicios
                }],
                title: {
                    text : 'Servicios mas vendidos'
                },
                yAxis: {
                    min: 0,
                },
                xAxis: {
                    categories: labels.servicios
                }
            }
            //Paquetes
            vm.paquetes = response.items.paquetes;
            for (var k in vm.paquetes){
                categories.paquetes.push({
                    name: vm.paquetes[k].nombre,
                    y: vm.paquetes[k].ventas,
                })
            }
            vm.chartPaquetes = {
                options :{
                    chart:{
                        type : 'column'
                    },
                    credits: { 
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                },
                series: [{
                    colorByPoint: true,
                    name : 'Ventas',
                    threshold: null,
                    data : categories.paquetes
                }],
                title: {
                    text : 'Paquetes mas vendidos'
                },
                yAxis: {
                    min: 0,
                },
                xAxis: {
                    categories: labels.servicios
                }
            }
            //Pendientes
            vm.pendientes = response.items.pendientes;
        });
    }
    
    vm.confirmar_venta = function(ev, data, ope){
        console.log(data);
        var confirm = $mdDialog.confirm();
        if(ope == 'confirm'){
            confirm.title('Confirmar pago');
            confirm.textContent('¿Desea confirmar que el pago fue realizado?');
        }else{
            confirm.title('Cancelar venta');
            confirm.textContent('¿Desea cancelar la venta?');
        }
        confirm.ok('Aceptar');
        confirm.cancel('Cancelar');
        confirm.targetEvent(ev);
        confirm.clickOutsideToClose(true);
        $mdDialog.show(confirm).then(function() {
            var condiciones = {venta_id : data['_id'], operacion : ope};
            $http.post('/ventas/confirm', {conditions : condiciones } ).success(function(response) {
                console.log(response);
                vm.estadisticas();
                if(vm.pendientes.length == 1){
                    vm.vista = 1;
                }
            });
        }, function() {
            //Cancel
        });
    }
    
    vm.inicializar = function(){
//        console.log('Inicializando!');
        vm.estadisticas();
    }

}]);