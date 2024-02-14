const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({}, { collection: "Review", timestamps: true, strict: false });

dataSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
});

const Review = mongoose.model('Review', dataSchema);

module.exports = Review;