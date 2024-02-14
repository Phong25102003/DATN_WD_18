const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({}, { collection: "Galery", timestamps: true, strict: false });

dataSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
});

const Galery = mongoose.model('Galery', dataSchema);

module.exports = Galery;