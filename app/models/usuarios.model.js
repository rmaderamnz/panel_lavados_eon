var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var usuario_schema = new Schema({
  nombre                :   String,
  uid                   :   String,
  url_imagen            :   String,
//  tipo                  :   String,
  createdBy             :   String,
  modifiedBy            :   String,
  created               :   {type: Date, default: Date.now},
  deleted               :   {type: Boolean, default: true},
})

mongoose.model('Usuario', usuario_schema); 