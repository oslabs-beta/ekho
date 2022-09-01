const mongoose = require('mongoose');
require('dotenv').config()
// getting error "Cannot use import statement outside a module" with the following two lines - replaced with two lines above
// import mongoose from 'mongoose';
// import "dotenv/config.js";

//dotenv.config();
//import { MONGO_URI } from '../secret';
//import secret from '../secret'
mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // dbName: 'EkhoMS'
})
  .then(() => console.log('Connected to Mongo DB.'))
  .catch(<Input> (err: Input) => console.log(err));

const Schema = mongoose.Schema;


const resultSchema = new mongoose.Schema({
    experimentName: {
    type:String,
    required: true
  } ,
    context: {
    type:Object,
    required: true
  },
    resultLegacy: {
    type:String,
    required: true
  },
    resultMS: {
    type:String,
    required: true
  },
    legacyTime: {
    type:Number,
    required: true
  } ,
    msTime: {
    type:Number,
    required: true
  } ,
    mismatch: {
    type:Boolean,
    required: true
  },
    ignoredMismatch: {
    type:Boolean,
  },
  mismatchName: {
    type:String
  },
 createdAt: {
  type: String,
  required: true
 }
})
const Results = mongoose.model('Results', resultSchema);
module.exports = { Results };
// getting error "SyntaxError: Unexpected token 'export'" with the following two line - replaced with line above
// export default { Results };

