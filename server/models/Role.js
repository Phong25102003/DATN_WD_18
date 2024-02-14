const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({}, { collection: "Role", timestamps: true, strict: false });

dataSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
});

const Role = mongoose.model('Role', dataSchema);

module.exports = Role;