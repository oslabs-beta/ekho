import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(process.env.MONGO_URI, {
})
  .then(() => console.log('Connected to Mongo DB.'))
  .catch(<Input> (err: Input) => console.log(err));

const resultSchema = new mongoose.Schema({
  experimentName: {
    type: String,
    required: true,
  },
  context: {
    type: Object,
  },
  resultLegacy: {
    type: String,
    required: true,
  },
  resultMS: {
    type: String,
    required: true,
  },
  legacyTime: {
    type: Number,
    required: true,
  },
  msTime: {
    type: Number,
    required: true,
  },
  mismatch: {
    type: Boolean,
    required: true,
  },
  ignoredMismatch: {
    type: Boolean,
  },
  mismatchName: {
    type: String,
  },

});
const Results = mongoose.model('Results', resultSchema);
export default Results;
