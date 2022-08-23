const createErr = (file, method, err) => (`Error in ${file}.${method}. ${err}`);

module.exports = createErr;
