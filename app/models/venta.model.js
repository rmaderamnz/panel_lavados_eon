var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var venta_schema = new Schema({
    antes           :   String,
    despues         :   String,
    costo           :   Number,
    cometario       :   String,
    calificacion    :   String,
    tipo_compra     :   String,
    metodo_pago     :   String,
    sale_id         :   String,
    createdBy       :   String,
    modifiedBy      :   String,
    descuento       :   {type: Boolean, default: false},
//    compra          :   Object,
//    compra          :   [{ type: Schema.Types.ObjectId }],
    compra          : { servicios : [{ type: Schema.Types.ObjectId, ref: 'Servicio' }],
                        paquetes : [{ type: Schema.Types.ObjectId, ref: 'Paquete' }]},
    created         :   { type: Date, default: Date.now},
})

mongoose.model('Venta', venta_schema);