import mongoose from 'mongoose';
//import { MONGO_URI } from '../secret';
//import secret from '../secret'
const MONGO_URI = 'mongodb+srv://ekho:MQmP3Zfzj5lT6Yd2@ekhoms.5w0kgxu.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'EkhoMS'
})
  .then(() => console.log('Connected to Mongo DB.'))
  .catch(err => console.log(err));

const Schema = mongoose.Schema;

const resultSchema = new mongoose.Schema({
    experimentName: {
    type:String,
    required: true
  } ,
    Context: {
    type:Object,
    required: true
  },
    results: {
    type:Object,
    required: true
  },
    legacyTime: {
    type:String,
    required: true
  } ,
    msTime: {
    type:String,
    required: true
  } ,
    mismatch: {
    type:Boolean,
    required: true
  },

})
const Results = mongoose.model('Results', resultSchema);
export default { Results };
