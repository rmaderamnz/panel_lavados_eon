var mongoose = require('mongoose');
var bodyParser  = require('body-parser');

//Modelos usados
var servicio_model  = require('./../models/servicios.model');
var Servicio = mongoose.model('Servicio');

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
//        console.log(data_format);
        res.json({ success: true});
    })
    
}

//OPERACIONES CON TARJETAS
exports.registrar_tarjeta = function(req, res){
    var param = req.body.conditions;
    console.log(param);
    var cliente_id = param.cliente_id;
    var cardRequest = {
        card_number : param.card,
        holder_name : param.usuario,
        expiration_year : param.exp_y,
        expiration_month : param.exp_m,
        cvv2 : param.ccv,
    }
    console.log('Registrando tarjeta');
    console.log('cliente');
    console.log(cliente_id);
    openpay.customers.cards.create(cliente_id, cardRequest, function(error, card){
        console.log(error);
        console.log(card);
        if(error){
            res.json({ success: false });
        }else{
            res.json({ success: true });
        }
    });
}

exports.get_tarjetas = function(req, res){
    var param = req.body.conditions;
    var cliente_id = param.uid;
    console.log(param);
    openpay.cards.list(cliente_id, function(error, list){
        if(!error){
            res.json({ success: true, items : list});
        }else{
            res.send(error);
        }
    });
}

exports.remover_tarjeta = function(req, res) {
    var param = req.body.conditions;
    var cliente_id = param.uid;
    var tarjeta_id = param.card;
    openpay.customers.cards.delete(cliente_id, tarjeta_id, function(error){
        if(!error){
            res.json({ success: true });
        }else{
            res.send(error);
        }
    });
}

//VENTAS
exports.registrar_venta = function(req, res) {
    var param = req.body.conditions;
    var tipo = param.tipo; //Tarjeta, efectivo
    if(tipo = 'tarjeta'){
        var tarjeta = param.tarjeta;
        var cliente_id = param.uid;
        var chargeRequest = {
            method : 'card',
            source_id : tarjeta.id,
            amount : param.cargo,
            description : 'Cargo por operacion',
            device_session_id : tarjeta.device_session,
            customer : param.customer,
        }
        openpay.customers.charges.create(cliente_id, chargeRequest, function(error, charge) {
            console.log(charge);
            res.json({ success: true });
        });
    }else{
        res.json({ success: false });
    }
}

/*
conditions : {
    tipo : 'tarjeta'
    tarjeta : {
        id : 'id_tarjeta',//Id de la tarjeta
        device_session : 'id_tarjeta', //Device session
    }
    cargo : 100,
    cliente : 12346,//Id del cliente
}
*/





