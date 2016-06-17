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
  venta               :   { type: Schema.Types.ObjectId, ref: 'Story' },
})

mongoose.model('Servicio', servicio_schema);