var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var servicio_schema = new Schema({
  nombre                :   String,
  descripcion           :   String,
//  tipo                  :   String,
  precio                :   Number,
  createdBy             :   String,
  modifiedBy             :   String,
  created            :   {type: Date, default: Date.now},
  activo               :   {type: Boolean, default: true},
})

mongoose.model('Servicio', servicio_schema); 