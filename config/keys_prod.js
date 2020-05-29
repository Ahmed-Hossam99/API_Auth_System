module.exports = {
  // this values used on production 
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  facebookClientID: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  cloudinay_name: process.env.CLOUDINARY_API_NAME,
  cloudinay_key: process.env.CLOUDINARY_API_KEY,
  cloudinay_secret: process.env.CLOUDINARY_API_SECRET,

}

