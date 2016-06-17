var servicio_model  = require('./../models/usuarios.model');
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var bodyParser  = require('body-parser');

exports.create = function(req, res) {
    
}

exports.authenticate = function(req, res){
	var params = req.body.conditions;
    Usuario.find({ uid : params.uid }, function(err, result) {
    	if (err) {
    		res.send(err);
    	}else{
	        if (res.length > 0) {
	        	res.json({ success: true , new_user : false});  
	        } else {
	        	new_user(params);
	        }
    	}
    })
}

function new_user(params) {
	var usuario = new Usuario();

	usuario.nombre = params.nombre;
	usuario.uid = params.uid;
	usuario.url_imagen = param.picture_url;
	usuario.createdBy = 'Admin';
	usuario.modifiedBy = 'Admin';


	usuario.save(function(err) {
	    if(err){
	        res.send(err);
	    }else{
	        res.json({ success: true, new_user : true});  
	    }
	});
}