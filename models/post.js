const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authorName: {
      type: String
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    contentImageId: {
      type: String
    },
    hasImage: {
      type: Boolean,
      required: true
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: 'User'
    },
    dislikes: {
      type: [Schema.Types.ObjectId],
      ref: 'User'
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment'
    },
    tags: {
      type: [String]
    },
    lastEditedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
