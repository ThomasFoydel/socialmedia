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
  checkSchema,
} = require('express-validator');
const bcrypt = require('bcryptjs');
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

const conn = mongoose.createConnection(process.env.MONGO_URI);
// Init gfs
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});
// create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

// USER ROUTES

// get all users
router.get('/users', async (req, res) => {
  const allUsers = await User.find().select('-password');
  res.send(allUsers);
});

// get user by id
router.get('/getuser/:userid', async (req, res) => {
  const userById = await User.findOne({
    _id: req.params.userid.toString(),
  }).select('-password');
  res.send(userById);
});

// get auth info
router.get('/getauth', auth, async (req, res) => {
  User.findOne({ _id: mongoose.Types.ObjectId(req.tokenUser.userId) })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(444).send(error);
    });
});

// register new user
router.post('/register', async (req, res) => {
  if (req.body.password.length < 6) {
    return res.json({ err: 'Password must be at least 6 characters' });
  }
  if (req.body.name.length < 4 || req.body.name.length > 12) {
    return res.json({ err: 'Name must be between 4 and 12 characters' });
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.json({ err: 'Passwords do not match' });
  }
  if (!req.body.email.includes('@') || !req.body.email.includes('.')) {
    return res.json({ err: 'Email input invalid' });
  }
  if (req.body.city.length > 15) {
    return res.json({ err: 'City must be 14 characters or less' });
  }

  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res.json({ err: 'Profile with this email already exists' });
  }

  // hash password
  const hashedPw = await bcrypt.hash(req.body.password, 12);

  // create new user, plug registration form data into mongoose model
  const newUser = new User({
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    city: req.body.city,
    age: req.body.age,
    password: hashedPw,
    profilePicId: req.body.profilePicId,
  });

  // save new user to mongo

  newUser
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// user login

router.post('/login', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.send({ err: 'all fields required' });
  }
  User.findOne({ email: req.body.email }, async function (err, user) {
    if (err) {
      return res.json({
        err:
          'Sorry, there is an issue with connecting to the database. We are working on fixing this.',
      });
    } else {
      if (!user) {
        return res.json({ err: 'No user found with this email' });
      }
      const passwordsMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (passwordsMatch) {
        const token = jwt.sign(
          {
            tokenUser: {
              userId: user._id,
              email: user.email,
            },
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
          _id: user._id,
        };

        res.json({
          status: 'success',
          message: 'Login successful',
          data: {
            user: userInfo,
            token,
          },
        });
      } else {
        return res.json({ err: 'Incorrect password' });
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

router.post('/edituser', auth, async (req, res) => {
  const { name, email, city, age, password, bio } = req.body;
  const { userId } = req.tokenUser;

  const foundUser = await User.findOne({
    _id: mongoose.Types.ObjectId(userId),
  });
  const passwordsMatch = await bcrypt.compare(password, foundUser.password);
  if (!passwordsMatch) {
    const error = new Error('Not authenticated');
    error.code = 401;
    res.status(401).send(error);
  } else if (passwordsMatch) {
    User.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(userId),
      },
      {
        $set: {
          name: name,
          email: email.toLowerCase(),
          city: city,
          age: age,
          bio: bio,
        },
      },
      { new: true }
    ).then((result) => {
      res.send(result);
    });
  }
});

//
//
//            get user
//
//

router.get('/user/:id', async (req, res) => {
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
//////// edit profile pic //////
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
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.tokenUser.userId },
        {
          profilePicId: file._id,
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
          coverPicId: file._id,
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
  if (
    req.params.id === undefined ||
    req.params.id === 'null' ||
    req.params.id === 'undefined'
  ) {
    return null;
  } else {
    try {
      const file = await gfs.files.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (!file || file.length === 0) {
        return res.status(404).json({ err: 'no file exists' });
      } else {
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
      }
    } catch (err) {
      console.log('get image error: ', err);
    }
  }
});

// GET IMAGE FROM POST AUTHORID flag
router.get('/authorprofilepic/:authorId', async (req, res) => {
  const foundUser = await User.findOne({ _id: req.params.authorId });
  const file = await gfs.files.findOne({
    _id: mongoose.Types.ObjectId(foundUser.profilePicId),
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
    recipient: recipientId,
  });
  if (foundFriendRequest) {
    return res.status(400).send();
  }

  const newFriendRequest = new FriendRequest({
    sender: userId,
    recipient: recipientId,
    status: 'pending',
  });

  newFriendRequest
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// get friend requests of current user
router.get('/getfriendrequests/:id', async (req, res) => {
  const requests = await FriendRequest.find({
    recipient: req.params.id,
  });
  res.status(200).send(requests);
});

// get single friend request by id, returns true or false
// determines if current user has pending or existing
// friend request with owner of profile being viewed
router.get('/getfriendrequest/', auth, async (req, res) => {
  const { profileUserId } = req.query;
  const { userId } = req.tokenUser;

  const foundFriendRequest1 = await FriendRequest.findOne({
    sender: userId,
    recipient: profileUserId,
  });
  const foundFriendRequest2 = await FriendRequest.findOne({
    sender: profileUserId,
    recipient: userId,
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
      $push: { friendList: senderId },
    },
    { new: true }
  );
  if (updatedRecipient) {
    const updatedFriendRequest = await FriendRequest.findOneAndUpdate(
      {
        sender: senderId,
        recipient: recipientId,
      },
      {
        $set: { status: 'accepted' },
        $push: { friendshipParticipants: [senderId, recipientId] },
      },
      { new: true }
    );

    const updatedRequests = await FriendRequest.find({
      recipient: req.tokenUser.userId,
      status: 'pending',
    });
    res.status(200).send({
      updatedRequests: updatedRequests,
      updatedUserFriendList: updatedRecipient.friendList,
    });
  }
});

router.post('/rejectfriendrequest', auth, async (req, res) => {
  const recipientId = req.tokenUser.userId;
  const senderId = req.body.sender;
  const deletedFriendRequest = await FriendRequest.findOneAndDelete({
    sender: senderId,
    recipient: recipientId,
  });

  const updatedRequests = await FriendRequest.find({
    recipient: req.tokenUser.userId,
    status: 'pending',
  });

  res.status(200).send({
    updatedRequests: updatedRequests,
  });
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
      { friendshipParticipants: { $in: [userId] } },
    ],
  });

  res.status(200).send({ updatedUser, updatedFriend });
});

module.exports = router;
