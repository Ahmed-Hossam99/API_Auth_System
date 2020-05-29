const cloudinary = require('cloudinary')
const keys = require('../config/keys')


cloudinary.config({
  cloud_name: keys.cloud_name,
  api_secret: keys.cloud_API_secret
})

exports.uploads = (file) => {
  return new Promise(resolve => {
    cloudinary.uploader.upload(file, (result) => {
      resolve({ url: result.url, id: result.public_id })
    }, { resource_type: "auto" })
  })
}

exports.destroy = (file) => {
  return new Promise(resolve => {
    cloudinary.uploader.destroy(file, (result) => {
      resolve({ result })
    }, { resource_type: "auto" })
  })
}

// https://cloudinary.com/documentation/image_upload_api_reference#upload_method
// https://cloudinary.com/documentation/upload_video