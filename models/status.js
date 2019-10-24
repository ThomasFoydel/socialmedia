const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statusSchema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    statusContent: {
      type: String,
      required: true
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: 'User'
    },
    dislikes: {
      type: [Schema.Types.ObjectId],
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Status', statusSchema);
