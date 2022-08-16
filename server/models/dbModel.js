const mongoose = require('mongoose');
const { MONGO_URI } = require('../secrets');

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'EkhoMS'
})
  .then(() => console.log('Connected to Mongo DB.'))
  .catch(err => console.log(err));

const Schema = mongoose.Schema;

const resultSchema = new mongoose.Schema({
    experimentName: ,
    Context: ,
    legacyResult: ,
    microserviceResult: ,
    legacyTime: ,
    msTime: ,
    mismatch: ,

})
const Results = mongoose.model('Results', resultSchema);
export default { Results };
