const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  isClown: {
    type: Boolean,
    required: false,
    default: false,
  },
  birthday: {
    type: String,
    required: false,
    default: null,
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

const User = model('User', userSchema);

module.exports = User;
