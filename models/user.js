
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    required: true
  },
  local: {
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String
    }
  },
  google: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  facebook: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  }
});


// this function fired automatically when user signup pefore user's save to encrypt password
userSchema.pre('save', async function (next) {
  try {
    // this if block to ensure that function not fire except with local strategy 
    if (this.method !== 'local') {
      next();
    }
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash (salt + hash)
    const passwordHash = await bcrypt.hash(this.local.password, salt);
    // Re-assign hashed version over original, plain text password
    this.local.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});
// // to check password
// userSchema.methods.isValidPassword = async function (newPassword) {
//   try {
//     return await bcrypt.compare(newPassword, this.password);
//   } catch (error) {
//     throw new Error(error);
//   }
// }


module.exports = mongoose.model('Users', userSchema, 'Users');