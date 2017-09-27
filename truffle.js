// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
    ropsten: {
      host: "localhost",
      port: 8545,
      network_id: "3",
      gas: 2900000
    },
    rinkeby: {
      host: "localhost",
      port: 8545,
      network_id: "4",
      gas: 4612388
    }
  }
};
