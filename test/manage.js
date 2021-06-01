const { expect } = require("chai");

describe("Manage", function () {
  it("Should be changed", async function () {

    const [owner1, owner2, owner3] = await ethers.getSigners();

    const MultiSigWallet = await ethers.getContractFactory("EverPay");
    const multiSigWallet = await MultiSigWallet.deploy([owner1.address], 1);

    await multiSigWallet.deployed();
    const interface = multiSigWallet.interface;

    let owners = await multiSigWallet.getOwners();
    expect(owners[0]).to.equal(owner1.address);
    expect(await multiSigWallet.isOwner(owner2.address)).to.equal(false);
    expect(await multiSigWallet.getRequire()).to.equal(1);

    // add owner2
    let data = interface.encodeFunctionData(interface.getFunction("addOwner"), [owner2.address]);
    let tx = {
      proposalID: 1,
      everHash: '0xfb9707d944acfb729f20f61f0505d3c5c8c0311d2e7d3bda40bb2e8d31948275',
      to: multiSigWallet.address,
      value: 0,
      data: data,
    };
    let hash = await multiSigWallet.txHash(tx.proposalID, tx.everHash, tx.to, tx.value, tx.data);
    let sig = await owner1.signMessage(ethers.utils.arrayify(hash));
    await multiSigWallet.connect(owner1).submit(
      tx.proposalID,
      tx.everHash,
      tx.to,
      tx.value,
      tx.data,
      [sig]
    );

    owners = await multiSigWallet.getOwners();
    expect(owners.length).to.equal(2);
    expect(owners[1]).to.equal(owner2.address);
    expect(await multiSigWallet.isOwner(owner2.address)).to.equal(true);

    // change requirement
    tx.proposalID = 2;
    tx.data = interface.encodeFunctionData(interface.getFunction("changeRequirement"), [2]);
    hash = await multiSigWallet.txHash(tx.proposalID, tx.everHash, tx.to, tx.value, tx.data);
    sig = await owner2.signMessage(ethers.utils.arrayify(hash));
    await multiSigWallet.connect(owner1).submit(
      tx.proposalID,
      tx.everHash,
      tx.to,
      tx.value,
      tx.data,
      [sig]
    );
    expect(await multiSigWallet.getRequire()).to.equal(2);

    // remove owner1 with mulit sig
    tx.proposalID = 3;
    tx.data = interface.encodeFunctionData(interface.getFunction("removeOwner"), [owner1.address]);
    hash = await multiSigWallet.txHash(tx.proposalID, tx.everHash, tx.to, tx.value, tx.data);
    sig = await owner1.signMessage(ethers.utils.arrayify(hash));
    let sig2 = await owner2.signMessage(ethers.utils.arrayify(hash));
    await multiSigWallet.connect(owner1).submit(
      tx.proposalID,
      tx.everHash,
      tx.to,
      tx.value,
      tx.data,
      [sig, sig2]
    );

    owners = await multiSigWallet.getOwners();
    expect(owners.length).to.equal(1);
    expect(owners[0]).to.equal(owner2.address);
    expect(await multiSigWallet.isOwner(owner1.address)).to.equal(false);
    expect(await multiSigWallet.getRequire()).to.equal(1);

    // replace owner2 to owner3
    tx.proposalID = 4;
    tx.data = interface.encodeFunctionData(interface.getFunction("replaceOwner"), [owner2.address, owner3.address]);
    hash = await multiSigWallet.txHash(tx.proposalID, tx.everHash, tx.to, tx.value, tx.data);
    sig = await owner2.signMessage(ethers.utils.arrayify(hash));
    await multiSigWallet.connect(owner1).submit(
      tx.proposalID,
      tx.everHash,
      tx.to,
      tx.value,
      tx.data,
      [sig]
    );

    owners = await multiSigWallet.getOwners();
    expect(owners.length).to.equal(1);
    expect(owners[0]).to.equal(owner3.address);
    expect(await multiSigWallet.isOwner(owner2.address)).to.equal(false);
    expect(await multiSigWallet.isOwner(owner3.address)).to.equal(true);

    // set operator
    tx.proposalID = 5;
    tx.data = interface.encodeFunctionData(interface.getFunction("setOperator"), [owner1.address]);
    hash = await multiSigWallet.txHash(tx.proposalID, tx.everHash, tx.to, tx.value, tx.data);
    sig = await owner3.signMessage(ethers.utils.arrayify(hash));
    await multiSigWallet.connect(owner1).submit(
      tx.proposalID,
      tx.everHash,
      tx.to,
      tx.value,
      tx.data,
      [sig]
    );

    let operator = await multiSigWallet.getOperator();
    expect(operator).to.equal(owner1.address);
    let paused = await multiSigWallet.getPaused();
    expect(paused).to.equal(false);

    // set paused
    await multiSigWallet.connect(owner1).setPaused(true);
    paused = await multiSigWallet.getPaused();
    expect(paused).to.equal(true);

    // revert paused test
    await multiSigWallet.connect(owner1).setPaused(false);
    paused = await multiSigWallet.getPaused();
    expect(paused).to.equal(false);

    // executes: 1. set operator to 0x0...01; 2. add owner; 3. change requirement
    abi1 = interface.encodeFunctionData(interface.getFunction("setOperator"), ["0x0000000000000000000000000000000000000001"]);
    abi2 = interface.encodeFunctionData(interface.getFunction("addOwner"), [owner2.address]);
    abi3 = interface.encodeFunctionData(interface.getFunction("changeRequirement"), [2]);
    tx.proposalID = 6;
    tx.data = interface.encodeFunctionData(interface.getFunction("executes"),[
      [tx.to, tx.to, tx.to],
      [0, 0, 0],
      [abi1, abi2, abi3],
    ]);
    hash = await multiSigWallet.txHash(tx.proposalID, tx.everHash, tx.to, tx.value, tx.data);
    sig = await owner3.signMessage(ethers.utils.arrayify(hash));
    await multiSigWallet.connect(owner3).submit(
      tx.proposalID,
      tx.everHash,
      tx.to,
      tx.value,
      tx.data,
      [sig]
    );
    operator = await multiSigWallet.getOperator();
    expect(operator).to.equal("0x0000000000000000000000000000000000000001");
    expect(await multiSigWallet.isOwner(owner2.address)).to.equal(true);
    expect(await multiSigWallet.getRequire()).to.equal(2);
  });
});
