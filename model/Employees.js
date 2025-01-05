const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const employeesSchema = new Schema({
   firstname:{
    type:String,
    required: true,
    unique: true
   },
   lastname:{
    type: String,
    required: true
   },
   address:{
    city: {
      type:String,
    },
    phone:{
      type: [Number],
      required: true 
    }
   }
})

const Employees = mongoose.model('Employees', employeesSchema); 

module.exports = Employees;