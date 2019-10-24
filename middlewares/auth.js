const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');
  //   console.log('token: ', token);
  if (!token) {
    return res.status(401).json({ msg: 'Authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, 'speakfriendandenter');
    // console.log('DECODED: ', decoded);
    req.tokenUser = decoded.tokenUser;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).send({ msg: 'token expired' });
    }
    res.status(401).json({ msg: 'Authorizaton denied' });
  }
};
