const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({}, { collection: "Return_Request", timestamps: true, strict: false });

dataSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

const Return_Request = mongoose.model('Return_Request', dataSchema);

module.exports = Return_Request;