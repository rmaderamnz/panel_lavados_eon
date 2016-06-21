var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var paquete_schema = new Schema({
  nombre                :   String,
  precio                :   Number,
  servicios             :   Object,//{ _id, nombre, costo}
  createdBy             :   String,
  modifiedBy            :   String,
  created               :   {type: Date, default: Date.now},
  activo                :   {type: Boolean, default: true},
})

mongoose.model('Paquete', paquete_schema); 