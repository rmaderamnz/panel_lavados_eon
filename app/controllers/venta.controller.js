var mongoose = require('mongoose');
var bodyParser  = require('body-parser');

//Modelos usados
var servicio_model  = require('./../models/servicios.model');
var Servicio = mongoose.model('Servicio');
var venta_model  = require('./../models/venta.model');
var Venta = mongoose.model('Venta');
var paquete_model  = require('./../models/paquetes.model');
var Paquete = mongoose.model('Paquete');
var usuario_model  = require('./../models/usuarios.model');
var Usuario = mongoose.model('Usuario');

//Librerias externas
var Openpay = require('openpay');
var config = require('./../../config/config');
var openpay = new Openpay(config.merchant, config.private_key, false);
var async = require('async');

//OPERACIONES CON TARJETAS
exports.registrar_tarjeta = function(req, res){
    console.log('Registrando tarjeta');
    var param = req.body.conditions;
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
    var cliente_id = param.cliente_id;
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

exports.confirmar_venta = function(req, res){
    var param = req.body.conditions;
    var id  = param.venta_id;
    var operacion = param.operacion;
    Venta.findOne({ _id : id }, function(err, venta) {
        console.log(venta);
        if(operacion == 'confirm'){ 
            venta.confirmada = true;
        }else{
            console.log('Rechazando!');
            venta.rechazado = true;
        }
        venta.save(function(err){
            if(err){
                res.send(err);
            }else{
                res.json({ success: true });  
            }
        });
    });
}

//VENTAS
exports.verificar_descuento = function(){
    var param = req.body.conditions;
    var usuario = param.usuario_id;
    Usuario.find({'_id' : usuario},function(err,result){
        if(err){
            res.json({ success: false }); 
        }else{
            res.json({ success: true, descuento : result.descuento }); 
        }
    });
}

exports.registrar_venta = function(req, res) {
    var venta = new Venta();
    var param = req.body.conditions;
    console.log(param);
    var tipo = param.tipo; //Tarjeta, efectivo
    venta.costo = param.cargo;
    venta.antes = param.antes;
    venta.direccion = param.direccion;
    venta.createdBy = param.user_id;
    venta.tipo_compra = param.tipo_compra;
    venta.descuento = param.descuento;
//    venta.compra = param.compra;
    if(venta.tipo_compra == 'servicio'){
        venta.compra.servicios = param.compra;
    }else{
        venta.compra.paquetes = param.compra;
    }
    venta.metodo_pago = tipo;
    venta.telefono = param.telefono;
//    console.log(tipo);
    if(tipo == 'tarjeta'){
        console.log('Pago con tarjeta!');
        var tarjeta = param.tarjeta;
        var cliente_id = param.cliente;
        var cargo = param.cargo
        if(param.descuento){
            cargo = cargo*0.9;
        }
        var chargeRequest = {
            method : 'card',
            source_id : tarjeta.id,
            amount : cargo,
            description : param.descripcion,
            device_session_id : tarjeta.device_session,
            customer : param.customer,
        }
        openpay.customers.charges.create(cliente_id, chargeRequest, function(error, charge) {
            if(!error){
                venta.sale_id = charge.id;
//                venta.confirmada = true;
                venta.save(function(err, vnt) {
                    console.log('venta guardada', vnt);
                    if(err){
                        res.json(err);
                    }else{
                        if(param.descuento){
                            
                        }
                        res.json({ success: true, venta_id : vnt['_id'] });
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
        console.log('Efectivo!');
        venta.sale_id = '0';
        venta.save(function(err, vnt) {
            console.log(err);
            if(err){
                res.json({ success: false });
            }else{
                res.json({ success: true, venta_id : vnt['_id'] });
            }
        });
    }
}

exports.ventas_usuario = function(req, res){
    var param = req.body.conditions;
    var usuario_id = param.usuario_id;
    var conditions = {};
    if(usuario_id != undefined){
        conditions = {createdBy : usuario_id}
    }else{
        conditions = {comentario : {$exists : true}}
    }
    Venta.find(conditions, function(err,ventas){
        if(err){
            res.json({ success: false });
        }else{
            async.parallel({
                paquetes : function(callback){
                    Servicio.populate( ventas, {path: 'compra.servicios', select : 'nombre'},function(err, servicios){
                        if(!err){
                            callback(null, servicios);
                        }else{
                            return callback(err);
                        }
                    });
                },
                servicios : function(callback){
                    Paquete.populate( ventas, {path: 'compra.paquetes', select : 'nombre'},function(err, paquetes){
                        if(!err){
                            callback(null, paquetes);
                        }else{
                            return callback(err);
                        }
                    });
                },
                usuarios : function(callback){
                    Usuario.populate( ventas, {path: 'createdBy', select : 'nombre url_imagen'},function(err, usuarios){
                        if(!err){
                            callback(null, usuarios);
                        }else{
                            return callback(err);
                        }
                    });
                }
            },function(error,response){
                if(error){
                    res.json({ success: false });
                }else{
                    res.json({ success: true, items : ventas });
                }
            })
        }
            
    })
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
                Servicio.find({ activo : {$eq : true} }, function(err, result) {
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
            var conditions = { /*confirmada : {$eq : true}*/ };
            if(param.date != '0'){
                var start = new Date(new Date().getFullYear(), (param.date -1), 1);
                var end = new Date(new Date().getFullYear(), (param.date -1), 31);
                conditions = {created: {$gte: start, $lt: end}};
                console.log(conditions);
            }
            conditions.rechazado = {'$ne' : true};
            Venta.find( conditions ,function(err, result){
                if(err){
                    res.json({ success: false });
                }else{
//                    console.log(result);
                    async.parallel({
                        usuarios : function(callback){
                            Usuario.populate( result, {path: 'createdBy', select : 'nombre url_imagen'},function(err, usuarios){
                                if(!err){
                                    callback(null, usuarios);
                                }else{
                                    return callback(err);
                                }
                            })
                        }
                    },function(err, ventas){
                        console.log(result);
                        var v_pendientes = [];
                        for (var k in result) {
                            var venta = result[k];
                            if(venta.confirmada){
                                var tam = 0;
                                if(venta.tipo_compra == 'servicio'){
                                    tam = venta.compra.servicios.length;
                                }else{
                                    tam = venta.compra.paquetes.length;
                                }
                                for (i = 0; i < tam; i++){
                                    if(venta.tipo_compra == 'servicio'){
                                        response.servicios[venta.compra.servicios[i]].ventas++;
                                    }else{
                                        response.paquetes[venta.compra.paquetes[i]].ventas++;
                                    }
                                }
                            }else{
                                v_pendientes.push(venta);
                            }   
                        }
                        res.json({ success: true, items : {
                            servicios : response.servicios,
                            paquetes : response.paquetes,
                            pendientes : v_pendientes,
                        } });
                    })
                        
                }
            });
        });
}

//REGISTROS
exports.get_registros = function(req, res){
    var param = req.body.conditions;
    var conditions = {}; 
    if(param.date != '0'){
        var start = new Date(new Date().getFullYear(), (param.date -1), 1);
        var end = new Date(new Date().getFullYear(), (param.date -1), 31);
        conditions = {created: {$gte: start, $lt: end}};
    }
    conditions.rechazado = {'$eq' : false};
    Venta.find(conditions, function(err, ventas){
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
            },
            usuarios : function(callback){
                Usuario.populate( ventas, {path: 'createdBy', select : 'nombre url_imagen'},function(err, usuarios){
                    if(!err){
                        callback(null, usuarios);
                    }else{
                        return callback(err);
                    }
                })
            }
        }, function(err, response) {
            if(err){
                res.json({ success: false });
            }else{
                res.json({ success: true, items : ventas });
            }
        })

    });
}

exports.update_despues = function(req, res) {

    console.log('llego a update despues');
    var params = req.body.conditions;
    console.log(params);

    Venta.findById(params.id, function (err, venta) {
        if (err) {
            console.log('error update despues', err);
            res.json({ success : false, error : err})
        }else {
            venta.despues = params.despues;
            venta.save(function (err) {
                if (err) {
                    res.json({ success : false, error : err})
                }else {
                    Venta.update(
                        { createdBy : venta.createdBy, _id :{ $ne: venta['_id'] } },
                        { $set: { despues: 'no-foto' }}, function(err){
                            if (err) {
                                res.json({ success : false});
                            }else{
                                res.json({ success : true});
                            }
                        });
                }
            });
        }

    });
}

exports.registrar_comentario = function(req, res) {
    console.log('llego a registro comentario');

    var params = req.body.conditions;
    console.log(params);

    Venta.findById(params.id, function (err, venta) {
        if (err) {
            console.log('error registrar_comentario', err);
            res.json({ success : false, error : err})
        }else {
            venta.comentario = params.comentario;
            venta.calificacion = params.calificacion;
            venta.save(function (err) {
                if (err) {
                    console.log('error registrar_comentario', err);
                    res.json({ success : false, error : err})
                }else {
                    res.json({ success : true});
                }
            });
        }

    });
}


