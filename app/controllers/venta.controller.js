var servicio_model  = require('./../models/servicios.model');
var mongoose = require('mongoose');
var Servicio = mongoose.model('Servicio');
var bodyParser  = require('body-parser');

//get_servicios
exports.get_servicios = function(req, res) {
    //Traer listado de usuarios
    Servicio.find({ activo : {$eq : true} }, function(err, result) {
//        console.log(result);
        var data_format = []
        for(var k in result){
//            format[k]['_id'] = { 
//                nombre : result[k].nombre
//            };
            data_format.push({'nombre' : result[k].nombre});
        }
        console.log(data_format);
        res.json({ success: true});
    })
//    res.json({success : true, items : venta_servicios});
    //
}

exports.register_sale = function(req, res) {
    
}