let EtherlabToken = artifacts.require("./EtherlabToken.sol");

module.exports = function(deployer) {
  deployer.deploy(EtherlabToken);
};
