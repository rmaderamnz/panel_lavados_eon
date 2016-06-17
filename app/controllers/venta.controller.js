var servicio_model  = require('./../models/servicios.model');
var mongoose = require('mongoose');
var Servicio = mongoose.model('Servicio');
var bodyParser  = require('body-parser');
var Openpay = require('openpay');
var config = require('./../../config/config');
var openpay = new Openpay(config.merchant, config.private_key, false);

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
    
}

exports.registrar_tarjeta = function(){
    var param = req.body.conditions;
    var cliente_id = param.uid;
    var cardRequest = {
        card_number : param.card,
        holder_name : param.usuario,
        expiration_year : param.exp_y,
        expiration_month : param.exp_m,
        expiration_month : param.ccv,
    }
    
    openpay.customers.cards.create(cliente_id, cardRequest, , function(error, card){
        console.log(card);
        if(err){
            res.json({ success: false });
        }else{
            res.json({ success: true });
        }
    });
}

exports.get_tarjetas = function(){
//    openpay.cards.list(callback);
    var param = req.body.conditions;
    var cliente_id = param.uid;
    openpay.cards.list(cliente_id, function(){
        
    });
}

exports.registrar_venta = function(req, res) {
    var param = req.body.conditions;
}