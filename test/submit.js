const { expect } = require("chai");

describe("Submit & execute", function () {
  it("Should executed", async function () {

    const [owner1, owner2] = await ethers.getSigners();

    const MultiSigWallet = await ethers.getContractFactory("EverPay");
    const multiSigWallet = await MultiSigWallet.deploy([owner1.address, owner2.address], 2);

    await multiSigWallet.deployed();

    const tx1 = {
      proposalID: 1,
      everHash: '0xfb9707d944acfb729f20f61f0505d3c5c8c0311d2e7d3bda40bb2e8d31948275',
      to: "0x474392Dea266BE98780C7Dfd33E620d7845cb641",
      value: 0,
      data: "0x",
    };

    // const chainid = await multiSigWallet.chainID();
    // console.log("111111", multiSigWallet.address, chainid)
    // test txHash
    let hash = await multiSigWallet.txHash(tx1.proposalID, tx1.everHash, tx1.to, tx1.value, tx1.data);
    expect(hash).to.equal("0xde8b03721434629fac0f0015ad102e8787dbfc5b51bda07bc09716c77181e05f");
    
    // test ecAddress
    const tx1Owner1Sig = await owner1.signMessage(ethers.utils.arrayify(hash));
    expect(tx1Owner1Sig).to.equal("0xbd20cfdcd11cd04a5ce0843dbd1a82ca2461aec8e38acc04b49bf4fea2138a86242d332005b2ddc438bec4b779996dc09f4a0e4da54fba82a1367ca1d773bbfe1c")
    const owner1Addr = await multiSigWallet.ecAddress(hash, tx1Owner1Sig);
    expect(owner1Addr).to.equal(owner1.address);

    // test submit tx1
    await multiSigWallet.connect(owner1).submit(
      tx1.proposalID,
      tx1.everHash,
      tx1.to,
      tx1.value,
      tx1.data,
      [tx1Owner1Sig]
    );
    let tx1res = await multiSigWallet.executed(hash);
    expect(tx1res).to.equal(false);

    // test execute tx1
    const tx1Owner2Sig = await owner2.signMessage(ethers.utils.arrayify(hash));
    await multiSigWallet.connect(owner1).submit(
      tx1.proposalID,
      tx1.everHash,
      tx1.to,
      tx1.value,
      tx1.data,
      [tx1Owner2Sig]
    );
    tx1res = await multiSigWallet.executed(hash);
    expect(tx1res).to.equal(true);

    // test extcuted tx1
    // await multiSigWallet.connect(owner1).submit(
    //   tx1.proposalID,
    //   tx1.to,
    //   tx1.value,
    //   tx1.data,
    //   [tx1Owner2Sig]
    // );

  });
});
