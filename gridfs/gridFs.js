// const multer = require('multer');
// const path = require('path');
// const crypto = require('crypto');
// const methodOverride = require('method-override');
// const GridFsStorage = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');

// ///////////// IMAGE STUFF
// app.use(methodOverride('_method'));
// // mongo uri
// const mongoURI =
//   'mongodb+srv://mongouser:Reelbigfish1@social-media-rest-ifmno.mongodb.net/test?retryWrites=true&w=majority';
// const conn = mongoose.createConnection(mongoURI);
// // Init gfs
// let gfs;
// conn.once('open', () => {
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('uploads');
// });
// // create storage engine
// const storage = new GridFsStorage({
//   url: mongoURI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });

// const upload = multer({ storage });

// module.exports = upload;
