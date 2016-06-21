var app = angular.module('panel',[
    'ui.router',
    'ngAnimate',
    'ngMaterial',
    'highcharts-ng'
]);

app.config(['$stateProvider','$urlRouterProvider', '$locationProvider', function ( $stateProvider, $urlRouterProvider, $locationProvider){
    $stateProvider
        .state('dashboard',{
            url         : '/',
            controller  : 'DashboardController as vm',
            templateUrl : 'webroot/dashboard/dashboard.html',
            resolve     :{}
        })
        .state('admin_servicios',{
            url         : '/servicios',
            controller  : 'ServiciosController as vm',
            templateUrl : 'webroot/admin_servicios/servicios.html',
            resolve     :{}
        })
        .state('admin_paquetes',{
            url         : '/paquetes',
            controller  : 'PaquetesController as vm',
            templateUrl : 'webroot/admin_paquetes/paquetes.html',
            resolve     :{}
        })
        .state('usuarios',{
            url         : '/usuarios',
            controller  : 'UsuariosController as vm',
            templateUrl : 'webroot/usuarios/usuarios.html',
            resolve     :{}
        })
        .state('registros',{
            url         : '/registro',
            controller  : 'UsuariosController as vm',
            templateUrl : 'webroot/bitacoras/bitacoras.html',
            resolve     :{}
        })
}]);

angular.element(document).ready(function() {
    angular.bootstrap(document, ['panel']);
});
