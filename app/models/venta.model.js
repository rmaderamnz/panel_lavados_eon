var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var venta_schema = new Schema({
    antes           :   Number,
    despues         :   Number,
    costo           :   Number,
    cometario       :   String,
    calificacion    :   String,
    tipo_compra     :   String,
    metodo_pago     :   String,
    sale_id         :   String,
    createdBy       :   String,
    modifiedBy      :   String,
//    compra          :   Object,
    compra          :   [{ type: Schema.Types.ObjectId }],
    created         :   { type: Date, default: Date.now},
})

mongoose.model('Venta', venta_schema);