var servicio_model  = require('./../models/usuarios.model');
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var bodyParser  = require('body-parser');
var Openpay = require('openpay');
var config = require('./../../config/config');
var openpay = new Openpay(config.merchant, config.private_key, false);

exports.authenticate = function(req, res){
    console.log('Autenticando usaurio');
	var params = req.body.conditions;
//    console.log(params);
    Usuario.find({ uid : params.uid }, function(err, result) {
        console.log('usuario autenticado');
    	if (err) {
    		res.send(err);
    	}else{
	        if (result.length > 0) {
                console.log(result);
                console.log(result[0].id_openpay);
                openpay.cards.list(result[0].id_openpay, function(error, list){
                    if(!error){
                        res.json({ 
                                success: true , 
                                new_user : false,   
                                customer_id : result[0].id_openpay, 
                                cards : list});  
                    }else{
                        res.send(error);
                    }
                });
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
    var ext_id = 'EON/'+(new Date()).getTime();
    console.log(ext_id);
    openpay.customers.create({
        external_id : ext_id,
        name : params.nombre,
        email : params.mail,
        requires_account: true
    }, function(error, customer){
        console.log('cliente creado!');
        console.log(customer);
        console.log(error);
        if(customer){
            console.log(customer.id);
            usuario.id_openpay = customer.id;
            usuario.save(function(err) {
                console.log('Usuario guardado en base de datos');
                console.log(err);
                if(err){
                    res.send(err);
                }else{
                    res.json({ success: true, new_user : true, customer_id : customer.id, cards : [] });  
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
        {nombre : 1, url_imagen : 1, created : 1, '_id' : 1, id_openpay : 1}, //Campos
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
    var open_id = param.customer_id;
    console.log('Borrando usuario');
    openpay.customers.delete(open_id, function(error) {
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
