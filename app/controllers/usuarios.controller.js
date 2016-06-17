var servicio_model  = require('./../models/servicios.model');
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var bodyParser  = require('body-parser');

exports.create = function(req, res) {
    
}

exports.authenticate = function(req, res){
    Usuario.find({}, function(err, result) {
        res.json({ success: true, items : result });  
    })
}