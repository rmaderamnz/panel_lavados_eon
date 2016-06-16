var servicio_model  = require('./../models/servicios.model');
var mongoose = require('mongoose');
var Servicio = mongoose.model('Servicio');
var bodyParser  = require('body-parser');

exports.create = function(req, res) {
    var param = req.body.conditions;
    var servicio = new Servicio();
    console.log(param);
    if(param['_id'] != undefined){
        servicio['_id'] = param['_id'];
        servicio.isNew = false;
    }
    servicio.nombre = param.nombre;
    servicio.descripcion = param.descripcion;
    servicio.precio = param.precio;
    servicio.createdBy = 'Admin';
    servicio.modifiedBy = 'Admin';
    servicio.save(function(err) {
        if(err){
            res.send(err);
        }else{
            res.json({ success: true });  
        }
    });
}

exports.read = function(req, res){
    Servicio.find({}, function(err, result) {
        res.json({ success: true, items : result });  
    })
}

exports.read_active = function(req, res){
    Servicio.find({ activo : {$eq : true} }, function(err, result) {
        res.json({ success: true, items : result });  
    })
}

exports.toggle = function(req, res){
    var param = req.body.conditions;
    var id = param.id;
    Servicio.findOne({ _id : id }, function(err, serv) {
        serv.activo = !serv.activo;
        serv.save(function(err){
            if(err){
                res.send(err);
            }else{
                res.json({ success: true });  
            }
        });
    })
}

exports.delete = function(req, res){
    var param = req.body.conditions;
    var id = param.id;
    Servicio.findOneAndRemove({ _id : id }, function (err, response){
        if(err){
            res.send(err);
        }else{
            res.json({ success: true });  
        }
    })
}