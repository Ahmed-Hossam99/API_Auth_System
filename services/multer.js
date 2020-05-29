const fs = require('fs')
const multer = require('multer')
const path = require('path');
const uuid = require('uuid');//to genirate unique Id for any img 

// stores file on disk
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {

    let dest = 'uploads';
    // create destination if don't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest)
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    // generate a unique random name with file extension
    cb(null, uuid.v4() + path.extname(file.originalname));
  }
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

exports.multerConfigImage = multer({
  storage: fileStorage,
  limits: {
    fileSize: 1024 * 1024 * 10 // limit 10mb
  }
}).single('img')
