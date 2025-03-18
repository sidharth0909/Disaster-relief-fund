const DisasterReliefFund = artifacts.require("DisasterReliefFund");

module.exports = function (deployer) {
  deployer.deploy(DisasterReliefFund);
};
