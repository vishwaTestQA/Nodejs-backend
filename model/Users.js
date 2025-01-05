const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const usersSchema = new Schema({
   username:{
    type:String,
    required: true,
    unique: true
   },
   roles:{
    User:{
      type:Number,
      default: 2001
    },
    Editor: Number,
    Admin: Number,
   },
   password:{
    type: String,
    required: true
   }
})

module.exports = mongoose.model('Users', usersSchema)