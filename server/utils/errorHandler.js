const createErr = (file, method, err) => ({
  log: `Error in ${file}.${method}. Error: ${err}`,
});

module.exports = createErr;
