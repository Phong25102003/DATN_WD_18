const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({}, { collection: "Product_Incoming", timestamps: true, strict: false });

dataSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
});

const Product_Incoming = mongoose.model('Product_Incoming', dataSchema);

module.exports = Product_Incoming;