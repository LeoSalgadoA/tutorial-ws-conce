const DAOServices = artifacts.require("./DAOServices.sol");
const CasaWToken = artifacts.require("./CasaWToken.sol");
const EtherlabToken = artifacts.require("./EtherlabToken.sol");

const BigNumber = web3.BigNumber;

const should = require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

let sender, casaw, etherlab;

contract("token_transfer", async accounts => {
  let [accountA, accountB] = accounts;

  beforeEach(async () => {
    sender = await DAOServices.new();
    casaw = await CasaWToken.new();
    etherlab = await EtherlabToken.new();
    await sender.addNewToken("CWT", casaw.address);
    await sender.addNewToken("ELT", etherlab.address);
  });

  it("should be able to transfer sender token to another wallet", async () => {
    let amount = new BigNumber(100000);
    await etherlab.approve(sender.address, amount, { from: accountA });
    await sender.transferTokens("ELT", accountB, amount, {
      from: accountA
    });
    let balance2 = (await etherlab.balanceOf(accountB)).toString();
    balance2.should.equal(amount.toString());
  });

  it("should NOT be able to transfer sender token to another wallet", async () => {
    let amount = new BigNumber(100000);
    await etherlab.approve(sender.address, amount, { from: accountA });
    let balance1 = (await casaw.balanceOf(accountB)).toString();
    try {
      await sender.transferTokens("CWT", accountB, amount, {
        from: accountA
      });
    } catch (e) {}

    let balance2 = (await casaw.balanceOf(accountB)).toString();
    balance1.should.equal(balance2);
  });
});
