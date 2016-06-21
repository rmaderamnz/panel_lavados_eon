var bodyParser  = require('body-parser');

//ARCHIVO DE RUTEOS
module.exports = function(app) {
    var servicios = require('./controllers/servicios.controller');
    var paquetes = require('./controllers/paquetes.controller');
    var usuarios = require('./controllers/usuarios.controller');
    var venta = require('./controllers/venta.controller');
    var imagenes = require('./controllers/imagenes.controller');
    
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    
    //SERVICIOS
    app.route('/servicios/get_list').post(servicios.read);
    app.route('/servicios/get_active').post(servicios.read_active);
    app.route('/servicios/create').post(servicios.create);
    app.route('/servicios/toogle').post(servicios.toggle);
    app.route('/servicios/delete').post(servicios.delete);
    
    //PAQUETES
    app.route('/paquetes/get_list').post(paquetes.read);
    app.route('/paquetes/create').post(paquetes.create);
    app.route('/paquetes/update').post(paquetes.update);
    app.route('/paquetes/delete').post(paquetes.delete);
    
    //USUARIOS
    app.route('/usuarios/authenticate').post(usuarios.authenticate);
    app.route('/usuarios/list').post(usuarios.get_userlist);
    app.route('/usuarios/delete').post(usuarios.delete);
    
    //VENTAS 
    app.route('/ventas/resumen').post(venta.get_ventas);
    app.route('/ventas/get_list').post(venta.get_registros);
    app.route('/ventas/charge').post(venta.registrar_venta);
    app.route('/ventas/new_card').post(venta.registrar_tarjeta);
    app.route('/ventas/get_cards').post(venta.get_tarjetas);
    app.route('/ventas/remove_card').post(venta.remover_tarjeta);

    //IMAGENES
    app.route('/imagenes/verifica_conexion').post(imagenes.verifica_conexion);
    app.route('/imagenes/guardar_imagen').post(imagenes.guardar_imagen);

}
