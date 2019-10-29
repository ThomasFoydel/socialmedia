const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Comment = require('../models/comment');
const Post = require('../models/post');

const auth = require('../middlewares/auth');

//          comment routes          //
//          comment routes          //
//          comment routes          //

router.post('/newcomment', auth, async (req, res) => {
  const { userId } = req.tokenUser;
  const { commentContent, postId, authorName } = req.body;
  const newComment = new Comment({
    commentContent,
    postId,
    authorName,
    authorId: userId,
    lastEditedAt: null
  });
  // save comment object to database
  newComment
    .save()
    .then(result => {
      // res.send(result);
      // update post, add comment id to array of comment ids
      Post.findOneAndUpdate(
        { _id: postId },
        { $push: { comments: result._id } },
        { new: true }
      )
        .then(result => {
          res.status(201).send(result);
        })
        .catch(err => console.log('postupdate failed. error: ', err));
    })
    .catch(err => console.log(err));

  // new Comment, returns commentId,
  // needs Post ID:
  // then findOneAndUpdate on Post to add commentId to comment array
});

//get comment by id
router.get('/getcomment/:id', async (req, res) => {
  const foundComment = await Comment.findOne({ _id: req.params.id });
  res.status(201).send(foundComment);
});

// edit comment
router.post('/editcomment/:id', auth, async (req, res) => {
  // fetch comment from mongo by id, and tokenUser id = authorid, update with content
  const updatedComment = await Comment.findOneAndUpdate(
    { _id: req.params.id, authorId: req.tokenUser.userId },
    { $set: { commentContent: req.body.newContent, lastEditedAt: Date.now() } },
    { new: true }
  );
  if (updatedComment) {
    res.status(201).send({ updatedComment });
  } else {
    res.status(400).send({ err: 'edit failed' });
  }
});

// delete comment
router.delete('/deletecomment/:id', async (req, res) => {
  try {
    const commentId = req.params.id;
    const { postId } = req.body;
    const deletedComment = await Comment.findOneAndDelete({ _id: commentId });

    // update post that comment belonged to, take id out of comments array
    const { commentAuthorId } = deletedComment.authorId;

    const postToBeUpdated = await Post.findOne({ _id: postId });

    const updatedPost = await Post.findOneAndUpdate(
      // { commentAuthorId },
      { _id: postId },
      { $pullAll: { comments: [mongoose.Types.ObjectId(commentId)] } },
      { new: true }
    );
    res.status(200).send(updatedPost);
  } catch (error) {}
});

// like comment

router.post('/likecomment/:id', auth, async (req, res) => {
  const commentId = req.params.id;

  const updatedComment = await Comment.findOneAndUpdate(
    {
      _id: commentId,
      likes: { $nin: [mongoose.Types.ObjectId(req.tokenUser.userId)] }
    },
    { $push: { likes: req.tokenUser.userId } },
    { new: true }
  );
  if (updatedComment) {
    res.status(200).send(updatedComment);
  } else {
    res
      .status(400)
      .send({ err: 'comment has already been liked by this user!' });
  }
});

// dislike comment
router.post('/dislikecomment/:id', auth, async (req, res) => {
  const commentId = req.params.id;
  const updatedComment = await Comment.findOneAndUpdate(
    {
      _id: commentId,
      dislikes: { $nin: [mongoose.Types.ObjectId(req.tokenUser.userId)] }
    },
    { $push: { dislikes: [req.tokenUser.userId] } },
    { new: true }
  );

  if (updatedComment) {
    res.status(200).send(updatedComment);
  } else {
    res
      .status(400)
      .send({ err: 'comment has already been disliked by this user!' });
  }
});

// remove like comment

router.post('/removelikecomment/:id', auth, async (req, res) => {
  const commentId = req.params.id;

  const updatedComment = await Comment.findOneAndUpdate(
    {
      _id: commentId,
      likes: { $in: [mongoose.Types.ObjectId(req.tokenUser.userId)] }
    },
    { $pullAll: { likes: [req.tokenUser.userId] } },
    { new: true }
  );
  if (updatedComment) {
    res.status(200).send(updatedComment);
  } else {
    res.status(400).send({ err: 'comment has not been liked by this user!' });
  }
});

// remove dislike comment
router.post('/removedislikecomment/:id', auth, async (req, res) => {
  const commentId = req.params.id;
  const updatedComment = await Comment.findOneAndUpdate(
    {
      _id: commentId,
      dislikes: { $in: [mongoose.Types.ObjectId(req.tokenUser.userId)] }
    },
    { $pullAll: { dislikes: [req.tokenUser.userId] } },
    { new: true }
  );
  if (updatedComment) {
    res.status(200).send(updatedComment);
  } else {
    res
      .status(400)
      .send({ err: 'comment has not been disliked by this user!' });
  }
});

module.exports = router;
