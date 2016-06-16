var bodyParser  = require('body-parser');

//ARCHIVO DE RUTEOS
module.exports = function(app) {
    var servicios = require('./controllers/servicios.controller');
    var paquetes = require('./controllers/paquetes.controller');
    
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    
    //SERVICIOS
    app.route('/servicios/get_list').post(servicios.read);
    app.route('/servicios/get_active').post(servicios.read_active);
    app.route('/servicios/create').post(servicios.create);
    app.route('/servicios/toogle').post(servicios.toggle);
    app.route('/servicios/delete').post(servicios.delete);
    
    //PAQUETES
    app.route('/paquetes/get_list').post(paquetes.read);
    app.route('/paquetes/create').post(paquetes.create);
//    app.route('/paquetes/toogle').post(paquetes.toggle);
//    app.route('/paquetes/delete').post(paquetes.delete);
    
}
