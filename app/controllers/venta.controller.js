var mongoose = require('mongoose');
var bodyParser  = require('body-parser');

//Modelos usados
var servicio_model  = require('./../models/servicios.model');
var Servicio = mongoose.model('Servicio');
var venta_model  = require('./../models/venta.model');
var Venta = mongoose.model('Venta');

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
    console.log('Registrando tarjeta');
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
//    openpay.customers.cards.get(cliente_id, param.card, function(error,card){
//        console.log(error);
//        console.log(card);
//        if(error.error_code == 1005){
            openpay.customers.cards.create(cliente_id, cardRequest, function(error, card){
                console.log(error);
//                console.log(card);
                if(error){
                    res.json({ success: false });
                }else{
                    console.log('Tarjeta registrada!');
                    res.json({ success: true , card_id : card.id });
                }
            });
//        }else{
//            console.log('Tarjeta ya registrada!');
//            res.json({ success: false});
//        }
//    });
    
        
}

exports.get_tarjetas = function(req, res){
    var param = req.body.conditions;
    var cliente_id = param.uid;
    console.log(param);
    openpay.cards.list(cliente_id, function(error, list){
        console.log(error);
        console.log(list);
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
    console.log('Registrando venta!');
    var venta = new Venta();
    var param = req.body.conditions;
    var tipo = param.tipo; //Tarjeta, efectivo
    venta.costo = param.cargo;
    venta.createdBy = param.uid;
    venta.tipo_compra = param.tipo_compra;
    venta.compra = param.compra;
    venta.metodo_pago = tipo;
    if(tipo = 'tarjeta'){
        console.log('Pago con tarjeta!');
        var tarjeta = param.tarjeta;
        var cliente_id = param.cliente;
        var chargeRequest = {
            method : 'card',
            source_id : tarjeta.id,
            amount : param.cargo,
            description : param.descripcion,
            device_session_id : tarjeta.device_session,
            customer : param.customer,
        }
        openpay.customers.charges.create(cliente_id, chargeRequest, function(error, charge) {
            if(!error){
                venta.sale_id = charge.id;
                venta.save(function(err) {
                    if(err){
                        res.json(err);
                    }else{
                        res.json({ success: true });
                    }
                });
            }else{
                res.json({ success: false });
            }
            console.log('Creando cargo');
            console.log('error',error);
            console.log('cargo',charge);
        });
    }else{
        venta.sale_id = '0';
        venta.save(function(err) {
            console.log(err);
            if(err){
                res.json({ success: false });
            }else{
                res.json({ success: true });
            }
        });
        res.json({ success: true });
    }
}

exports.get_ventas = function(req, res){
    Venta.find({},function(err, result){
        console.log(result);
        res.json({ success: true, items : result });
    });
}

/*
{
    "_id": {
        "$oid": "5768329332e9613a10818a02"
    },
    "sale_id": "trc3q9vtd8wnjhhvx9l8",
    "metodo_pago": "tarjeta",
    "compra": [
        "576450b83af204a41d275720",
        "576450423af204a41d27571e"
    ],
    "tipo_compra": "paquete",
    "costo": 110,
    "created": {
        "$date": "2016-06-20T18:14:43.135Z"
    },
    "__v": 0
}
*/



