const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const privateMessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    recipient: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    participants: {
      type: [Schema.Types.ObjectId],
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PrivateMessage', privateMessageSchema);
