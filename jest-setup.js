// import regeneratorRuntime from 'regenerator-runtime';

module.exports = async () => {
  global.testServer = await require('./server/server.js');
  // console.log(global.testServer);
  console.log(global.testServer.close);
};
