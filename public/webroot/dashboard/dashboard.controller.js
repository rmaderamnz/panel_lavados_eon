angular.module('panel').controller('DashboardController',['$http', function($http){
//    console.log('Estoy en el controlador del dashboard');
    var vm = this;
    vm.fecha = 0;
    
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
    
    vm.estadisticas_servicios = function(){
        var condiciones = {date : vm.fecha};
//        console.log(condiciones);
        $http.post('/ventas/resumen', {conditions : condiciones } ).success(function(response) {
            console.log(response);
            var categories = {
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
                }
            }
            //Pendientes
            vm.pendientes = response.items.pendientes;
        });
    }
    
    vm.inicializar = function(){
        console.log('Inicializando!');
        vm.estadisticas_servicios();
    }

}]);