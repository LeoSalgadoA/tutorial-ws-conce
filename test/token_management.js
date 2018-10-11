const DAOServices = artifacts.require("./DAOServices.sol");
const CasaWToken = artifacts.require("./CasaWToken.sol");
const EtherlabToken = artifacts.require("./EtherlabToken.sol");

const should = require("chai")
  .use(require("chai-as-promised"))
  .should();

let sender;
let casawAddress;
let etherlabAddress;

contract("token_management", async accounts => {
  beforeEach(async () => {
    sender = await DAOServices.new();
    casaw = await CasaWToken.new();
    etherlab = await EtherlabToken.new();
    casawAddress = casaw.address;
    etherlabAddress = etherlab.address;
    await sender.addNewToken("CWT", casawAddress);
    await sender.addNewToken("ELT", etherlabAddress);
  });

  it("should add new ELT token", async () => {
    console.log("");
    let address = await sender.tokens.call("ELT");
    address.should.equal(etherlabAddress);
  });

  it("should add new CWT token", async () => {
    console.log("");
    let address = await sender.tokens.call("CWT");
    address.should.equal(casawAddress);
  });

  it("should update supported token address", async () => {
    console.log("");
    await sender.addNewToken("ELT", casawAddress);
    let address = await sender.tokens.call("ELT");
    address.should.equal(casawAddress);
  });

  it("should remove unused supported token address ELT has CWT address we need to remove it", async () => {
    console.log("");
    await sender.removeToken("ELT");
    let address = await sender.tokens.call("ELT");
    address.should.equal("0x0000000000000000000000000000000000000000");
  });
});
