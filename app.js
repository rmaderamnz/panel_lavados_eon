const express = require('express');
const app = express();

var config = require('./config/config');
var routes = require('./app/routes')(app);
var mongoose = require('mongoose');

var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

mongoose.connect(config.db,options);

mongoose.connection.on('connected', function () {
    console.log('Conexion exitosa!');
});

mongoose.connection.on('error',function (err) {  
    console.log('Ocurrio un error al conectar a la base de datos: ' + err);
}); 

mongoose.connection.on('disconnected', function () {  
    console.log('Desconexion');
});
 
app.use(express.static('public'));
app.get('/', function(req, res){
    res.sendfile('default.html');
}); 

app.post('/test/function', function(req, res){
    console.log(req.body);
    res.json({success: true, request : req.body });
});

app.listen(config.port, function(){
    console.log('Aplicacion inicializada en el puerto ' + config.port)
});
