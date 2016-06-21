var mongoose = require('mongoose');
var bodyParser  = require('body-parser');

//Modelos usados
var servicio_model  = require('./../models/servicios.model');
var Servicio = mongoose.model('Servicio');
var venta_model  = require('./../models/venta.model');
var Venta = mongoose.model('Venta');
var paquete_model  = require('./../models/paquetes.model');
var Paquete = mongoose.model('Paquete');

//Librerias externas
var Openpay = require('openpay');
var config = require('./../../config/config');
var openpay = new Openpay(config.merchant, config.private_key, false);
var async = require('async');

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
    openpay.customers.cards.create(cliente_id, cardRequest, function(error, card){
        console.log(error);
        if(error){
            res.json({ success: false });
        }else{
            console.log('Tarjeta registrada!');
            res.json({ success: true , card_id : card.id });
        }
    });
}

exports.get_tarjetas = function(req, res){
    var param = req.body.conditions;
    var cliente_id = param.uid;
    openpay.customers.cards.list(cliente_id, function(error, list){
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
    var venta = new Venta();
    var param = req.body.conditions;
    var tipo = param.tipo; //Tarjeta, efectivo
    venta.costo = param.cargo;
    venta.antes = param.antes;
    venta.createdBy = param.uid;
    venta.tipo_compra = param.tipo_compra;
//    venta.compra = param.compra;
    if(venta.tipo_compra == 'servicio'){
        venta.compra.servicios = param.compra;
    }else{
        venta.compra.paquetes = param.compra;
    }
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
    async.parallel(
        {//LLAMAR SERVICIOS Y PAQUETES
            paquetes : function(callback){
                Paquete.find({},function(err,result) {
                    if(err){
                        return callback(err);
                    }else{
                        var obj = {};
                        for (var k in result) {
                            var key = result[k]['_id'];
                            var paquete = result[k];
                            obj[key] = {
                                id : paquete['_id'],
                                nombre : paquete.nombre,
                                costo  : paquete.precio,
                                ventas : 0,
                            };
                        }
                        callback(null, obj);
                    }
                })
            },
            servicios : function(callback){
                Servicio.find({}, function(err, result) {
                    if(err){
                        return callback(err);
                    }else{
                        var obj = {};
                        var array = [];
                        for (var k in result) {
                            var key = result[k]['_id'];
                            var servicio = result[k];
                            obj[key] = {
                                id : servicio['_id'],
                                nombre : servicio.nombre,
                                costo : servicio.precio,
                                ventas : 0,
                            };
                        }
                        callback(null, obj);
                    }
                });
            }
        }, function(err, response) {
            if(err){
                res.json({ success: false });
            }
            var param = req.body.conditions;
            console.log(end);
            var conditions = {}; 
            console.log(param.date);
            if(param.date != '0'){
                var start = new Date(new Date().getFullYear(), (param.date -1), 1);
                var end = new Date(new Date().getFullYear(), (param.date -1), 31);
                conditions = {created: {$gte: start, $lt: end}};
                console.log(conditions);
            }
            Venta.find( conditions ,function(err, result){
                if(err){
                    res.json({ success: false });
                }else{
                    for (var k in result) {
                        var venta = result[k];
                        for (i = 0; i < venta.compra.length; i++){
                            if(venta.tipo_compra == 'servicio'){
                                response.servicios[venta.compra.servicios[i]].ventas++;
                            }else{
                                response.paquetes[venta.compra.paquetes[i]].ventas++;
                            }
                        }
                    }
                    res.json({ success: true, items : {
                        servicios : response.servicios,
                        paquetes : response.paquetes,
                    } });
                }
            });
        });
}

//REGISTROS
exports.get_registros = function(req, res){
    var param = req.body.conditions;
    console.log(param);
    var conditions = {}; 
    if(param.date != '0'){
        var start = new Date(new Date().getFullYear(), (param.date -1), 1);
        var end = new Date(new Date().getFullYear(), (param.date -1), 31);
        conditions = {created: {$gte: start, $lt: end}};
    }
 
    if (param.usuario_id != undefined) {
        conditions.createdBy = param.usuario_id;
    }
    Venta.find({},function(err, ventas){
        if(err){
            res.json({ success: false });
        }
        //Populate
        async.parallel({
            servicios : function(callback){
                Servicio.populate( ventas, {path: 'compra.servicios', select : 'nombre'},function(err, servicios){
                    if(!err){
                        callback(null, servicios);
                    }else{
                        return callback(err);
                    }
                });
            },
            paquetes : function(callback){
                Paquete.populate( ventas, {path: 'compra.paquetes', select : 'nombre'},function(err, paquetes){
                    if(!err){
                        callback(null, paquetes);
                    }else{
                        return callback(err);
                    }
                })
            }
        }, function(err, response) {
            if(err){
                res.json({ success: false });
            }else{
                res.json({ success: false, items : ventas });
            }
        })

    });
}



