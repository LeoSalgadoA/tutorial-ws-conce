let CasaWToken = artifacts.require("./CasaWToken.sol");

module.exports = function(deployer) {
  deployer.deploy(CasaWToken);
};
