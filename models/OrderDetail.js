const { Schema, model, models } = require("mongoose");

const OrderDetailSchema = new Schema({
    order: {type: Schema.Types.ObjectId, ref: 'Order'},
    line_items: Object,
}, {
    timestamps: true
})

export const OrderDetail = models?.OrderDetail || model('OrderDetail',OrderDetailSchema)