const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Post = require('../models/post');

const User = require('../models/user');

router.post('/mainsearch/:terms', auth, async (req, res) => {
  let posts = [];
  let users = [];

  let termsArray = req.params.terms.split(' ');
  if (termsArray.includes('')) {
    termsArray = termsArray.filter(term => term !== '');
  }

  let counter = termsArray.length;

  termsArray.forEach((term, index) => {
    const searchMongo = async () => {
      User.find({
        name: { $regex: `${term}`, $options: '$i' }
      })
        .select('-password')
        .then(result => {
          if (result.length > 0) {
            let index = users.findIndex(user => user._id === result._id);
            if (index === -1) {
              users.push(result);
            } else console.log('user already exists');
          }

          Post.find({
            $or: [
              { title: { $regex: `${term}`, $options: '$i' } },
              { content: { $regex: `${term}`, $options: '$i' } },
              { authorName: { $regex: `${term}`, $options: '$i' } },
              { tags: { $regex: `${term}`, $options: '$i' } }
            ]
          }).then(postResult => {
            if (postResult.length > 0) {
              postResult.forEach(resultPost => {
                let index = posts.findIndex(postArrayPost => {
                  return postArrayPost._id === resultPost._id;
                });

                if (index === -1) {
                  posts.push(resultPost);
                } else console.log('post already exists');
              });
            }
            counter -= 1;
            if (counter === 0) {
              const filteredPostArray = [];
              const map = new Map();
              for (const post of posts) {
                if (!map.has(post._id.toString())) {
                  map.set(post._id.toString(), true);
                  filteredPostArray.push({
                    _id: post._id.toString(),
                    authorName: post.authorName,
                    likes: post.likes,
                    dislikes: post.dislikes,
                    comments: post.comments,
                    authorId: post.authorId,
                    title: post.title,
                    content: post.content,
                    contentImageId: post.contentImageId,
                    hasImage: post.hasImage,
                    lastEdited: post.lastEdited,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    tags: post.tags
                  });
                }
              }

              res.send({ posts: filteredPostArray, users });
            }
          });
        });
    };

    searchMongo();
  });
});

module.exports = router;
