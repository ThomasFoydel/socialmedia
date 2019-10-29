const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = require('../models/user');
const FriendRequest = require('../models/friendRequest');

// validation & authorization
const {
  check,
  validationResult,
  body,
  checkSchema
} = require('express-validator');
const brcypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

// USER ROUTES

// get all users
router.get('/users', async (req, res, next) => {
  const allUsers = await User.find().select('-password');
  res.send(allUsers);
});

// get user by id
router.get('/getuser/:userid', async (req, res, next) => {
  const userById = await User.findOne({
    _id: req.params.userid.toString()
  }).select('-password');
  res.send(userById);
});

// get auth info
router.get('/getauth', auth, async (req, res) => {
  User.findOne({ _id: mongoose.Types.ObjectId(req.tokenUser.userId) })
    .then(result => {
      // console.log(result);
      res.status(200).send(result);
    })
    .catch(error => {
      // console.log('get auth error: ', error);
      res.status(444).send(error);
    });
});

// register new user
router.post(
  '/register',
  [
    check('email').isEmail(),
    check('password').isLength({ min: 5 }),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
    body('email').custom(value => {
      return User.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject('Email already in use');
        }
      });
    }),
    checkSchema({
      name: {
        isLength: {
          errorMessage: 'Name should be at least 5 characters long',
          options: { min: 5 }
        }
      }
    })
  ],
  async (req, res, next) => {
    let errors;

    errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // hash password
    const hashedPw = await brcypt.hash(req.body.password, 12);

    // create new user, plug registration form data into mongoose model
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      city: req.body.city,
      age: req.body.age,
      password: hashedPw,
      profilePicId: req.body.profilePicId
    });

    // save new user to mongo

    newUser
      .save()
      .then(result => {
        res.status(201).send(result);
        // console.log('success new user created, result: ', result);
      })
      .catch(err => {
        res.status(400).send(err);
        // console.log('error! user not created. error: ', err);
      });
  }
);

// user login

router.post('/login', async (req, res, next) => {
  User.findOne({ email: req.body.email }, async function(err, user) {
    if (err) {
      // next(err);
      const error = new Error('No user found with this email');
      error.code = 401;
      throw error;
    } else {
      const passwordsMatch = await brcypt.compare(
        req.body.password,
        user.password
      );
      if (passwordsMatch) {
        const token = jwt.sign(
          {
            tokenUser: {
              userId: user._id,
              email: user.email
            }
          },
          process.env.SECRET,
          { expiresIn: '3hr' }
        );

        const userInfo = {
          age: user.age,
          city: user.city,
          name: user.name,
          email: user.email,
          profilePicId: user.profilePicId,
          coverPicId: user.coverPicId,
          _id: user._id
        };

        res.json({
          status: 'success',
          message: 'Login successful',
          data: {
            user: userInfo,
            token
          }
        });
      }
    }
  });
});

////////
//

//    update user
//
//
/////////

router.post('/edituser', auth, async (req, res, next) => {
  const { name, email, city, age, password, bio } = req.body;
  // console.log('edit user req body: ', req.body);
  // gets tokenUser from auth
  const { userId } = req.tokenUser;

  const foundUser = await User.findOne({
    _id: mongoose.Types.ObjectId(userId)
  });
  // console.log('edit user found user: ', foundUser);
  const passwordsMatch = await brcypt.compare(password, foundUser.password);
  if (!passwordsMatch) {
    const error = new Error('Not authenticated');
    error.code = 401;
    res.status(401).send(error);
  } else if (passwordsMatch) {
    // console.log('userid: ', userId);
    User.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(userId)
      },
      { $set: { name: name, email: email, city: city, age: age, bio: bio } },
      { new: true }
    ).then(result => {
      // console.log('RESULT: ', result);
      res.send(result);
    });
  }
});

//
//
//            get user
//
//

router.get('/user/:id', async (req, res, next) => {
  const userId = req.params;
  const foundUser = await User.findOne({ _id: userId });
  if (!foundUser) {
    res.status(404).send('User not found');
  } else {
    res.status(200).send(foundUser);
  }
});

//
//
//
//////// EDIT PROFILE PIC //////
//
//
//

router.post(
  '/editprofilepic/',
  auth,
  upload.single('image'),
  async (req, res) => {
    gfs.files.findOne({ _id: req.file.id }, async (err, file) => {
      if (!file || file.length === 0) {
        return res
          .status(404)
          .json({ err: 'no file exists, file upload failed' });
      }
      // console.log('FILE: ', file);
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.tokenUser.userId },
        {
          profilePicId: file._id
        },
        { new: true }
      );
      return res.json(updatedUser);
    });
  }
);

//////// EDIT PROFILE PIC //////
//
//
//

router.post(
  '/editcoverpic/',
  auth,
  upload.single('image'),
  async (req, res) => {
    gfs.files.findOne({ _id: req.file.id }, async (err, file) => {
      if (!file || file.length === 0) {
        return res
          .status(404)
          .json({ err: 'no file exists, file upload failed' });
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.tokenUser.userId },
        {
          coverPicId: file._id
        },
        { new: true }
      );
      return res.json(updatedUser);
    });
  }
);

//
// GET IMAGE BY ID FROM MONGODB GRIDFS
//

router.get('/image/:id', async (req, res) => {
  if (req.params.id === undefined) {
    return res.status(404).send('undefined)');
  } else if (req.params.id !== 'undefined') {
    const file = await gfs.files.findOne({
      _id: mongoose.Types.ObjectId(req.params.id)
    });
    if (!file || file.length === 0) {
      return res.status(404).json({ err: 'no file exists' });
    } else {
      const readStream = gfs.createReadStream(file.filename);
      readStream.pipe(res);
    }
  }
});

// GET IMAGE FROM POST AUTHORID flag: not in use?
router.get('/authorprofilepic/:authorId', async (req, res) => {
  const foundUser = await User.findOne({ _id: req.params.authorId });
  const file = await gfs.files.findOne({
    _id: mongoose.Types.ObjectId(foundUser.profilePicId)
  });
  if (!file || file.length === 0) {
    return res.status(404).json({ err: 'no file exists' });
  } else {
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  }
});

/////// GET PROFILE IMAGE BY AUTHOR ID for posts flag: not in use?
router.get('/image/author/:authorId', async (req, res) => {
  // let id = mongoose.Types.ObjectId(`req.params.id`);
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

// Send friend request
router.post('/sendfriendrequest', auth, async (req, res) => {
  const { userId } = req.tokenUser;
  const { recipientId } = req.body;

  const foundFriendRequest = await FriendRequest.findOne({
    sender: userId,
    recipient: recipientId
  });
  if (foundFriendRequest) {
    return res.status(400).send();
  }

  const newFriendRequest = new FriendRequest({
    sender: userId,
    recipient: recipientId,
    status: 'pending'
  });

  newFriendRequest
    .save()
    .then(result => {
      res.status(201).send(result);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

// get friend requests of current user
router.get('/getfriendrequests/:id', async (req, res) => {
  const requests = await FriendRequest.find({
    recipient: req.params.id
  });
  res.status(200).send(requests);
});

// get single friend request by id, returns true or false
router.get('/getfriendrequest/', auth, async (req, res) => {
  const { profileUserId } = req.query;
  const { userId } = req.tokenUser;

  const foundFriendRequest1 = await FriendRequest.findOne({
    sender: userId,
    recipient: profileUserId
  });
  const foundFriendRequest2 = await FriendRequest.findOne({
    sender: profileUserId,
    recipient: userId
  });
  let friendRequestAlreadyExists = false;
  if (foundFriendRequest1 || foundFriendRequest2) {
    friendRequestAlreadyExists = true;
  }
  res.send(friendRequestAlreadyExists);
});

router.post('/acceptfriendrequest', auth, async (req, res) => {
  const recipientId = req.tokenUser.userId;
  const senderId = req.body.sender;
  const updatedSender = await User.findOneAndUpdate(
    { _id: senderId, friendList: { $nin: [recipientId] } },
    { $push: { friendList: recipientId } },
    { new: true }
  );
  const updatedRecipient = await User.findOneAndUpdate(
    { _id: recipientId, friendList: { $nin: [senderId] } },
    {
      $push: { friendList: senderId }
    },
    { new: true }
  );
  const updatedFriendRequest = await FriendRequest.findOneAndUpdate(
    {
      sender: senderId,
      recipient: recipientId
    },
    {
      $set: { status: 'accepted' },
      $push: { friendshipParticipants: [senderId, recipientId] }
    },
    { new: true }
  );
  const updatedRequests = await FriendRequest.find({
    recipient: req.tokenUser.userId,
    status: 'pending'
  });
  res.status(200).send({
    updatedRequests: updatedRequests,
    updatedUserFriendList: updatedRecipient.friendList
  });
});

router.post('/rejectfriendrequest', auth, async (req, res) => {
  const recipientId = req.tokenUser.userId;
  const senderId = req.body.sender;
  const deletedFriendRequest = await FriendRequest.findOneAndDelete({
    sender: senderId,
    recipient: recipientId
  });
  res.status(200).send(deletedFriendRequest);
});

router.post('/unfriend', auth, async (req, res) => {
  const { userId } = req.tokenUser;
  const { friendId } = req.body;

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { $pullAll: { friendList: [friendId] } },
    { new: true }
  ).select('-password');
  const updatedFriend = await User.findOneAndUpdate(
    { _id: friendId },
    { $pullAll: { friendList: [userId] } },
    { new: true }
  ).select('-password');

  const deletedFriendRequest = await FriendRequest.findOneAndDelete({
    $and: [
      { friendshipParticipants: { $in: [friendId] } },
      { friendshipParticipants: { $in: [userId] } }
    ]
  });

  res.status(200).send({ updatedUser, updatedFriend });
});

module.exports = router;
