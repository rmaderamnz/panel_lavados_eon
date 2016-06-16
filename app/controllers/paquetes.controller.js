var paquete_model  = require('./../models/paquetes.model');
var mongoose = require('mongoose');
var Paquete = mongoose.model('Paquete');
var bodyParser  = require('body-parser');


exports.create = function(req, res) {
    var param = req.body.conditions;
    var paquete = new Paquete();
    console.log(param);
    if(param['_id'] != undefined){
        paquete['_id'] = param['_id'];
        paquete.isNew = false;
    }
    paquete.nombre = param.nombre;
    paquete.precio = param.precio;
    paquete.servicios = param.servicios;
    paquete.createdBy = 'Admin';
    paquete.modifiedBy = 'Admin';
    paquete.save(function(err) {
        if(err){
            res.send(err);
        }else{
            res.json({ success: true });  
        }
    });
}

exports.read = function(req, res){
    Paquete.find({}, function(err, result) {
        res.json({ success: true, items : result });  
    })
}