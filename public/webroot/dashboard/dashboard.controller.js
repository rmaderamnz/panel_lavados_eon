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
        var condiciones = {};
        $http.post('/ventas/servicios', {conditions : condiciones } ).success(function(response) {
//            console.log(response);
            //Tabla
            vm.servicios = response.items
            
            //Grafica
            
        });
    }
    
    vm.inicializar = function(){
        console.log('Inicializando!');
        vm.estadisticas_servicios();
    }
    
    /*
        vm.grafica_candidatos = function(){
        var condiciones = { modelo : vm.modelo , modelo_id : vm.modelo_id, ubicacion : vm.ubicacion };
        $http.post(GLOBAL_PATH +'api/PrepContendientes/get_votos_candidato', {conditions : condiciones } ).success(function(response) {
            loading(false);
            vm.total_votos = 0;
            for(var k in response.candidatos){
                vm.graficas.candidatos.series.push({
//                        color : color,   
                        color : '#d31580',
                        name : response.candidatos[k].candidato,
                        y : parseInt(response.candidatos[k].votos),
                        partidos : response.candidatos[k].partidos.join(',')
                    });
                vm.total_votos += parseInt(response.candidatos[k].votos);
                var data = response.candidatos[k].votos+'/'+response.candidatos[k].imagen+'/'+response.candidatos[k].candidato;  //+'/'+ response.candidatos[k].partidos.join('.');
                vm.graficas.candidatos.candidatos.push(data);
            }
            vm.chartCandidatos = {
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
                xAxis: {
                    categories: vm.graficas.candidatos.candidatos,
                    labels: { 
                        useHTML: true,
                        formatter: function () {
                            var val = this.value.split('/');
                            var porcentaje;
                            if(vm.total_votos > 0){
                                porcentaje = (val[0]*100)/vm.total_votos;
                                porcentaje = porcentaje.toFixed(2);
                            }else{
                                porcentaje = '0.00';
                            }
                            var strLabel = '<div style="text-align: center; height: 45px;" ><span style="white-space: pre-line;"><b>'+val[2]+'</b></span></div><br>'
                            strLabel += '<div style="margin-top: 8px;margin-bottom: 16px; text-align: center;">';
                            strLabel += '<img style="float:center;width:40px;height:40px;"; src="/img/partidos/'+val[1]+'"></img><br></div>';
                            strLabel += '<div style="text-align: center">';
                            strLabel += '<span>'+val[0]+'</span><br><br>';
                            strLabel += '<span style="color:#d31580" >'+porcentaje+'%</span>';
                            strLabel += '</div>';
                            return strLabel;
                        }
                    }
                }, 
                yAxis: {
                    min: 0,
//                    max: vm.total_votos,
                    title: {
                        text: ''
                    },
                },
                series: [{
                    colorByPoint: true,
                    name : 'Votos',
                    threshold: null,
                    data : vm.graficas.candidatos.series
                }],
                title: {
                     text: ''
                  },
                useHighStocks: false,
            };
        });
    }
    */
}]);