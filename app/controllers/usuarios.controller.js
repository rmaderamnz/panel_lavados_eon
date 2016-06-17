var servicio_model  = require('./../models/servicios.model');
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var bodyParser  = require('body-parser');

exports.create = function(req, res) {
    
}

exports.authenticate = function(req, res){
	var params = req.body.conditions;
    Usuario.find({ uid : params.uid }, function(err, result) {
        console.log(result);
    })
}