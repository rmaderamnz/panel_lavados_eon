var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var usuario_schema = new Schema({
  nombre                :   String,
  access_token           :   String,
//  tipo                  :   String,
  precio                :   Number,
  createdBy             :   String,
  modifiedBy             :   String,
  created            :   {type: Date, default: Date.now},
  deleted               :   {type: Boolean, default: true},
})

mongoose.model('Usuario', usuario_schema); 