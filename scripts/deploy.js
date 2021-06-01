async function main() {
  const ContractName = "EverPay";

  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Contract = await ethers.getContractFactory(ContractName);
  const contract = await Contract.deploy([deployer.address], 1);

  console.log("Contract address:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });