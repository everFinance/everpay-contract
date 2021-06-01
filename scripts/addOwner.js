const json = require ('../artifacts/contracts/EverPay.sol/EverPay.json')

async function main() {
  const [owner] = await ethers.getSigners();

  console.log("Account balance:", (await owner.getBalance()).toString());

  const contract = new ethers.Contract("0xC38FbF9987f056D25E6eF40D973Ee65c25c95070", json.abi, owner);
  const interface = contract.interface;

  let data = interface.encodeFunctionData(interface.getFunction("addOwner"), ["0x61EbF673c200646236B2c53465bcA0699455d5FA"]);
    let tx = {
      proposalID: 2,
      everHash: '0xfb9707d944acfb729f20f61f0505d3c5c8c0311d2e7d3bda40bb2e8d31948275',
      to: contract.address,
      value: 0,
      data: data,
    };

    let hash = await contract.txHash(tx.proposalID, tx.everHash, tx.to, tx.value, tx.data);
    let sig = await owner.signMessage(ethers.utils.arrayify(hash));
    await contract.connect(owner).submit(
      tx.proposalID,
      tx.everHash,
      tx.to,
      tx.value,
      tx.data,
      [sig]
    );

    tx.proposalID = 2;
    tx.data = interface.encodeFunctionData(interface.getFunction("changeRequirement"), [2]);
    hash = await contract.txHash(tx.proposalID, tx.everHash, tx.to, tx.value, tx.data);
    sig = await owner.signMessage(ethers.utils.arrayify(hash));
    await contract.connect(owner).submit(
      tx.proposalID,
      tx.everHash,
      tx.to,
      tx.value,
      tx.data,
      [sig]
    );

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });