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
    console.log(
      "    ✓ user call etherlab token to approve dao services to transfer an amount of tokens for him"
    );
    let balance1 = (await etherlab.balanceOf(accountB)).toString();
    console.log("    ✓ accountB balance1 : " + balance1);

    await sender.transferTokens("ELT", accountB, amount, {
      from: accountA
    });
    console.log(
      "    ✓ dao service make ELT transfer from accountA to accountB"
    );
    let balance2 = (await etherlab.balanceOf(accountB)).toString();
    console.log("    ✓ accountB balance2 : " + balance2);

    balance2.should.equal(amount.toString());
  });

  it("should NOT be able to transfer sender token to another wallet", async () => {
    let amount = new BigNumber(100000);
    console.log("  ");

    await etherlab.approve(sender.address, amount, { from: accountA });
    console.log(
      "    ✓ user call etherlab token to approve dao services to transfer an amount of tokens for him"
    );

    let balance1 = (await casaw.balanceOf(accountB)).toString();
    console.log("    ✓ accountB balance1 : " + balance1);
    console.log(
      "    ✓ dao service make CWT instead of ELT transfer from accountA to accountB"
    );
    try {
      await sender.transferTokens("CWT", accountB, amount, {
        from: accountA
      });
    } catch (e) {
      console.log("    ✓ revert cant transfer CTW");
    }

    let balance2 = (await casaw.balanceOf(accountB)).toString();
    console.log("    ✓ accountB balance2 : " + balance2);
    balance1.should.equal(balance2);
  });
});
