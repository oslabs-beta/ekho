const createErr = (file, method, err, status) => ({
  log: `Error in ${file}.${method}. Error: ${err}`,
  status,
  message: `${err}`,
});

module.exports = createErr;
