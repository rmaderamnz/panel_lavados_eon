var servicio_model  = require('./../models/usuarios.model');
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var bodyParser  = require('body-parser');
var Openpay = require('openpay');
var config = require('./../../config/config');
var openpay = new Openpay(config.merchant, config.private_key, false);

exports.authenticate = function(req, res){
	var params = req.body.conditions;
    Usuario.find({ uid : params.uid }, function(err, result) {
    	if (err) {
    		res.send(err);
    	}else{
	        if (result.length > 0) {
	        	res.json({ success: true , new_user : false});  
	        } else {
	        	var usuario = new_user(req, res ,params);
	        }
    	}
    })
}

function new_user(req, res, params) {
	var usuario = new Usuario();

	usuario.nombre = params.nombre;
	usuario.uid = params.uid;
	usuario.mail = params.mail;
	usuario.url_imagen = params.picture_url;
	usuario.createdBy = 'Admin';
	usuario.modifiedBy = 'Admin';
    console.log('creando cliente');
//    console.log(usuario);
    console.log(params.mail);
    openpay.customers.create({
        external_id : params.uid,
        name : params.nombre,
        email : params.mail,
        requires_account: true
    }, function(error, customer){
        console.log(customer);
        console.log(error);
        if(customer){
            usuario.save(function(err) {
                console.log(err);
                if(err){
                    res.send(err);
                }else{
                    res.json({ success: true, new_user : true});  
                }
            })
        }else{
            res.send(error);
        }
    });
}

exports.get_userlist = function(req, res){
    Usuario.find(
        { deleted : false },//restriccion
        {nombre : 1, url_imagen : 1, created : 1, '_id' : 1}, //Campos
        function(err, result) {
        if(err){
            res.send(err);
        }else{
            res.json({ success: true, items : result }); 
        }
    });
}

exports.delete = function(req, res){
    var param = req.body.conditions;
    var id = param.id;
    console.log('Borrando usuario');
    openpay.customers.delete(id, function(error) {
        console.log();
        if(!error){
            Usuario.findOneAndRemove({ _id : id }, function (err, response){
            if(err){
                res.send(err);
            }else{
                res.json({ success: true });  
            }
        })
        }else{
            res.send(error);
        }
    });
}
