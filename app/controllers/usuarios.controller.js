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
	        	var usuario = new_user(params);
                res.json(usuario);
	        }
    	}
    })
}

function new_user(params) {
	var usuario = new Usuario();

	usuario.nombre = params.nombre;
	usuario.uid = params.uid;
	usuario.url_imagen = params.picture_url;
	usuario.createdBy = 'Admin';
	usuario.modifiedBy = 'Admin';


	usuario.save(function(err) {
	    if(err){
//	        res.send(err);
            return err;
	    }else{
            console.log('usuario creado!');
            return { success: true, new_user : true};
//	        res.json({ success: true, new_user : true});  
	    }
	});
}

exports.get_userlist = function(req, res){
    //db.users.find( { status: "A" }, { name: 1, status: 1, _id: 0 } )
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
    Usuario.findOneAndRemove({ _id : id }, function (err, response){
        if(err){
            res.send(err);
        }else{
            res.json({ success: true });  
        }
    })
}
