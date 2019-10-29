const express = require('express');
const router = express.Router();

// TODO: abstract out the image stuff to gridFs and then import it back in
// const upload = require('../gridfs/gridFs');

const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

const {
  check,
  validationResult,
  body,
  checkSchema
} = require('express-validator');

const auth = require('../middlewares/auth');

// image parsing / storing
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const methodOverride = require('method-override');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

///////////// IMAGE STUFF
router.use(methodOverride('_method'));
// mongo uri
const mongoURI =
  'mongodb+srv://mongouser:Reelbigfish1@social-media-rest-ifmno.mongodb.net/test?retryWrites=true&w=majority';
const conn = mongoose.createConnection(mongoURI);
// Init gfs
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});
// create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

//          post routes          //
//          post routes          //
//          post routes          //

//get all posts
router.get('/posts', auth, async (req, res) => {
  const allPosts = await Post.find().sort({ updatedAt: -1 });
  res.send(allPosts);
});

router.get('/scrollposts', async (req, res) => {
  let { count, start } = req.query;
  count = Number(count);
  start = Number(start);
  const page = await Post.find()
    .sort({ updatedAt: -1 })
    .skip(count * (start - 1))
    .limit(count);
  res.send(page);
});

// get post by id
router.get('/post/:postid', auth, async (req, res) => {
  const postById = await Post.findOne({ _id: req.params.postid });
  res.send(postById);
});

// get posts by author id
router.get('/getpostsbyuser/:id', async (req, res) => {
  Post.find({ authorId: req.params.id }).then(result => {
    res.send(result);
  });
});

// get image by contentImageId
router.get('/contentimage/:id', async (req, res) => {
  const file = await gfs.files.findOne({
    _id: mongoose.Types.ObjectId(req.params.id)
  });
  if (!file || file.length === 0) {
    return res.status(404).json({ err: 'no file exists' });
  } else {
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  }
});

// create post
router.post(
  '/createpost',
  [auth, upload.single('contentImage')],

  async (req, res) => {
    let errors;

    // get file from req if there is one, to pass in to new Post below
    let reqFileId;
    let { hasImage } = req.body;
    // //TODO if has Image, set contentImage to be accessed in new Post
    if (hasImage) {
      reqFileId = req.file.id;
    }
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      const userInDB = await User.findOne({ _id: req.tokenUser.userId });
      if (!userInDB) {
        return res.status(401).json({ msg: 'Not authenticated' });
      } else {
        // create new post object
        const { title, content, authorName, tags } = req.body;

        let tagsArray = tags.split(',');

        tagsArray = tagsArray.map(tag => tag.trim());

        const newPost = new Post({
          authorId: req.tokenUser.userId,
          authorName: authorName,
          title: title,
          content: content,
          contentImageId: reqFileId,
          hasImage: hasImage,
          lastEditedAt: null,
          tags: tagsArray
        });

        // save post object to database

        newPost
          .save()
          .then(result => {
            res.send(result);
          })
          .catch(err => console.log(err));
      }
    }
  }
);

//
//
//
// update post
//
//
//

router.post('/editpost/:postid', auth, async (req, res) => {
  const { postid } = req.params;
  let { authorId, authorName, newTitle, newContent, newTags } = req.body;
  let tagsArray;
  if (newTags) {
    if (typeof newTags === 'string') {
      tagsArray = newTags.split(',');
      tagsArray = tagsArray.map(tag => tag.trim());
    } else if (newTags === [] || newTags.length === 0) {
      tagsArray = null;
    }
  }

  const existingPost = await Post.findOne({ _id: postid });

  // Get tokenUser ID from auth
  const { userId } = req.tokenUser;

  if (!existingPost) {
    const error = new Error('Post not found!');
    error.code = 401;
    throw error;
  }
  if (
    !existingPost.authorId.toString() === userId.toString() ||
    existingPost.authorName !== req.body.authorName
  ) {
    const error = new Error('Not authenticated!');
    error.code = 401;
    throw error;
  } else {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postid, authorId: authorId, authorName: authorName },
      {
        $set: {
          title: newTitle,
          content: newContent,
          tags: tagsArray,
          lastEditedAt: Date.now()
        }
      },
      { new: true }
    );

    res.status(201).send(updatedPost);
  }
});

/// edit post with new image
router.post(
  '/editpostwithimage/:postid',
  auth,
  upload.single('contentImage'),
  async (req, res, next) => {
    const { postid } = req.params;
    const { authorId, authorName, newTitle, newContent } = req.body;
    const existingPost = await Post.findOne({ _id: postid });
    // Get tokenUser ID from auth
    const { userId } = req.tokenUser;
    if (!existingPost) {
      const error = new Error('Post not found!');
      error.code = 401;
      throw error;
    }
    if (
      !existingPost.authorId.toString() === userId.toString() ||
      existingPost.authorName !== req.body.authorName
    ) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    } else {
      const updatedPost = await Post.updateOne(
        { _id: postid, authorId: authorId, authorName: authorName },
        {
          $set: {
            title: newTitle,
            content: newContent,
            contentImageId: req.file.id,
            lastEditedAt: Date.now()
          }
        }
      );

      res.status(201).send(updatedPost);
    }
  }
);

/*
 **
 ** delete post
 **
 */

router.post('/deletepost/:id', auth, async (req, res, next) => {
  // Get tokenUser ID from auth
  const { userId } = req.tokenUser;

  const foundPost = await Post.findOne({
    _id: mongoose.Types.ObjectId(req.params.id)
  });
  if (!foundPost) {
    const error = new Error('No post found!');
    error.code = 404;
    throw error;
  }

  if (foundPost.authorId.toString() !== userId) {
    const error = new Error('Not authenticated!');
    error.code = 401;
    throw error;
  } else {
    const deletedPost = await Post.findOneAndDelete({
      _id: mongoose.Types.ObjectId(req.params.id)
    });
    console.log(deletedPost);
    if (deletedPost.hasImage) {
      gfs.files.deleteOne({
        _id: mongoose.Types.ObjectId(deletedPost.contentImageId)
      });

      gfs.db
        .collection('uploads' + '.chunks')
        .remove(
          { files_id: mongoose.Types.ObjectId(deletedPost.contentImageId) },
          function(err) {
            if (err) console.log('ERROR! ', err);
          }
        );
    }
    Comment.deleteMany({ postId: req.params.id })
      .then(result => null)
      .catch(error =>
        console.log('delete post, delete many comments error: ', error)
      );

    res.send(deletedPost);
    // console.log('DELETED POST: ', deletedPost);
  }
});

// / LIKE POST
router.post('/likepost/:id', auth, async (req, res) => {
  const foundPost = await Post.findOne({ _id: req.params.id });
  if (foundPost.likes.includes(req.tokenUser.userId)) {
    res.status(422).send('error: post already liked by this user');
  } else {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { likes: req.tokenUser.userId } },
      { new: true }
    );
    res.status(200).send(updatedPost);
  }
});

// / DISLIKE POST
router.post('/dislikepost/:id', auth, async (req, res) => {
  const foundPost = await Post.findOne({ _id: req.params.id });
  if (foundPost.dislikes.includes(req.tokenUser.userId)) {
    res.status(422).send('error: post already liked by this user');
  } else {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { dislikes: req.tokenUser.userId } },
      { new: true }
    );
    res.status(200).send(updatedPost);
  }
});

// REMOVE LIKE
router.post('/removelikepost/:id', auth, async (req, res) => {
  const foundPost = await Post.findOne({ _id: req.params.id });
  if (foundPost.likes.includes(req.tokenUser.userId)) {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $pullAll: { likes: [req.tokenUser.userId] } },
      { new: true }
    );
    res.status(200).send(updatedPost);
  } else {
    res.status(422).send('error: post not yet liked by this user');
  }
});

// REMOVE DISLIKE
router.post('/removedislikepost/:id', auth, async (req, res) => {
  const foundPost = await Post.findOne({ _id: req.params.id });
  if (foundPost.dislikes.includes(req.tokenUser.userId)) {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $pullAll: { dislikes: [req.tokenUser.userId] } },
      { new: true }
    );
    res.status(200).send(updatedPost);
  } else {
    res.status(422).send('error: post not yet disliked by this user');
  }
});

module.exports = router;
