// import regeneratorRuntime from 'regenerator-runtime';

module.exports = async () => {
  global.testServer = await require('./server/server.ts');
  // console.log(global.testServer);
  console.log(global.testServer.close);
};
