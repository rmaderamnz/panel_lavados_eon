var servicio_model  = require('./../models/servicios.model');
var mongoose = require('mongoose');
var Servicio = mongoose.model('Servicio');
var bodyParser  = require('body-parser');

//get_servicios
exports.get_servicios = function(req, res) {
    //Traer listado de usuarios
    Servicio.find({ activo : {$eq : true} }, function(err, result) {
        console.log(result);
        var format = {}
        for(var k in result){
            format['_id'] = { 
                nombre : result[k].nombre
            };
        }
//        res.json({ success: true, items : result });  
    })
//    res.json({success : true, items : venta_servicios});
}