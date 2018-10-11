let DAOServices = artifacts.require("./DAOServices.sol");

module.exports = function(deployer) {
  deployer.deploy(DAOServices);
};
