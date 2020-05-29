const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')
const keys = require('./config/keys')
const bodyParser = require('body-parser')
const userRouter = require('./routes/user')



const app = express();

//   middlewares
// ========================
// morgan middleware
app.use(morgan('dev'))

// bodyParser Mideddleware
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));


app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
// make the file publically accessable 
app.use('/uploads', express.static('uploads'));



// routes
app.use('/users', userRouter)

// Mongoose Connect
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


// start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`app run on port${port}`)
})

