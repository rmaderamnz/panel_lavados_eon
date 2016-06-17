var bodyParser  = require('body-parser');

//ARCHIVO DE RUTEOS
module.exports = function(app) {
    var servicios = require('./controllers/servicios.controller');
    var paquetes = require('./controllers/paquetes.controller');
    var usuarios = require('./controllers/usuarios.controller');
    
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
    
}
