var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var usuario_schema = new Schema({
  nombre                :   String,
  uid                   :   String,
  id_openpay            :   String,
  url_imagen            :   String,
  mail                  :   String,
//  tipo                  :   String,
  createdBy             :   String,
  modifiedBy            :   String,
  created               :   {type: Date, default: Date.now},
  deleted               :   {type: Boolean, default: false},
})

mongoose.model('Usuario', usuario_schema); 