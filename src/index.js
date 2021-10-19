const mongoose = require('mongoose')
const app= require('./expressServer.js');

mongoose.connect("", {useNewUrlParser: true})
    .then(() => console.log('mongodb running on 27017'))
    .catch(err => console.log(err))
