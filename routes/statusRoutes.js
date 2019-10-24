const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');

const Status = require('../models/status');
const User = require('../models/user');

router.post('/poststatus', auth, async (req, res) => {
  const { statusContent } = req.body;
  const { userId } = req.tokenUser;
  const newStatus = new Status({
    authorId: userId,
    statusContent: statusContent,
    likes: [],
    dislikes: []
  });
  newStatus
    .save()
    .then(result => res.send(result))
    .catch(error => res.send(error));
});

router.get('/getuserstatuses/:id', async (req, res) => {
  const userid = req.params.id;
  const foundStatusesArray = await Status.find({ authorId: userid }).sort({
    createdAt: -1
  });
  res.send(foundStatusesArray);
});

// like status
router.post('/likestatus/:id', auth, async (req, res) => {
  const foundStatus = await Status.findOne({ _id: req.params.id });
  if (foundStatus.likes.includes(req.tokenUser.userId)) {
    console.log('already includes like from this user');
    res.status(422).send('error: post already liked by this user');
  } else {
    const updatedStatus = await Status.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { likes: req.tokenUser.userId } },
      { new: true }
    );
    console.log('Updated status with like: ', updatedStatus);

    res.status(200).send(updatedStatus);
  }
});

// dislike status
router.post('/dislikestatus/:id', auth, async (req, res) => {
  const foundStatus = await Status.findOne({ _id: req.params.id });
  if (foundStatus.dislikes.includes(req.tokenUser.userId)) {
    console.log('already includes dislike from this user');
    res.status(422).send('error: status already liked by this user');
  } else {
    const updatedStatus = await Status.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { dislikes: req.tokenUser.userId } },
      { new: true }
    );
    console.log('Updated status with dislike: ', updatedStatus);
    res.status(200).send(updatedStatus);
  }
});

// REMOVE LIKE
router.post('/removelikestatus/:id', auth, async (req, res) => {
  const foundStatus = await Status.findOne({ _id: req.params.id });
  if (foundStatus.likes.includes(req.tokenUser.userId)) {
    const updatedStatus = await Status.findOneAndUpdate(
      { _id: req.params.id },
      { $pullAll: { likes: [req.tokenUser.userId] } },
      { new: true }
    );
    console.log('Updated status, removed like: ', updatedStatus);
    res.status(200).send(updatedStatus);
  } else {
    res.status(422).send('error: status not yet liked by this user');
  }
});

// REMOVE DISLIKE
router.post('/removedislikestatus/:id', auth, async (req, res) => {
  const foundStatus = await Status.findOne({ _id: req.params.id });
  if (foundStatus.dislikes.includes(req.tokenUser.userId)) {
    const updatedStatus = await Status.findOneAndUpdate(
      { _id: req.params.id },
      { $pullAll: { dislikes: [req.tokenUser.userId] } },
      { new: true }
    );
    console.log('Updated status, removed dislike: ', updatedStatus);
    res.status(200).send(updatedStatus);
  } else {
    res.status(422).send('error: status not yet disliked by this user');
  }
});

// delete status
router.post('/deletestatus', auth, async (req, res) => {
  const deletedStatus = await Status.findOneAndDelete({
    _id: req.body.statusId,
    authorId: req.tokenUser.userId
  });
  if (deletedStatus) {
    const foundStatusesArray = await Status.find({
      authorId: req.tokenUser.userId
    }).sort({
      createdAt: -1
    });
    res.send(foundStatusesArray);
  } else {
    res.status(400).send('no status found');
  }
});

router.post('/getfriendstatuses', auth, async (req, res) => {
  const { friendList } = req.body;
  let totalStatusArray = [];
  let counter = friendList.length;

  friendList.forEach(friend => {
    const getStatusesForIndividualFriend = async () => {
      Status.find({ authorId: friend })
        .limit(15)
        .then(friendStatuses => {
          friendStatuses.forEach(status => {
            totalStatusArray.push(status);
          });
          counter -= 1;
          if (counter === 0) {
            res.send(totalStatusArray);
          }
        });
    };
    getStatusesForIndividualFriend();
  });
});

module.exports = router;
