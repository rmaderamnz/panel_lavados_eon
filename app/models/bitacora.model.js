var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var bitacora_schema = new Schema({
  tipo                  :   String,
  servicios             :   { type : Schema.Types.Mixed},
//  tipo                  :   String,
  comentarios           :   String,
  pagado                :   Boolean,
  costo_final           :   Number,
  createdBy             :   String,
  modifiedBy            :   String,
  created            :   {type: Date, default: Date.now},
  activo                :   {type: Boolean, default: true},
})


/*
ofMixed:    [Schema.Types.Mixed],
  ofObjectId: [Schema.Types.ObjectId],

    id : 1,
    tipo : 'servicio',
    tipo_id : [
        {servicio : 12},
        {servicio : 122},
        {servicio : 142},
        {servicio : 132}
    ],
    createdBy : 123,
    modifiedBy : 123,
    foto_antes : 1234wsfdasdf1223432,
    foro_despues : 1234wsfdasdf1223432,
    comentarios : 'muy bueno',
    calificacion : 5,
    tipo_pago : 'paypal,
    costo_final : 55000,
    pagado : true,
}

*/
mongoose.model('Bitacora', bitacora_schem