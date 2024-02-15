const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({}, { collection: "Order_Item", timestamps: true, strict: false });

dataSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
});

const Order_Item = mongoose.model('Order_Item', dataSchema);

module.exports = Order_Item;