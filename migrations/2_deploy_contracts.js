var Escrow = artifacts.require("./escrow.sol");

module.exports = function(deployer) {
  deployer.deploy(Escrow);
};
