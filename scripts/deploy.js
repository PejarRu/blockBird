async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('=== BlockBird deployment ===');
  console.log('Deployer:', deployer.address);

  const MessageCounter = await ethers.getContractFactory('MessageCounter');
  const counter = await MessageCounter.deploy();
  await counter.deployed();
  console.log('1) MessageCounter:', counter.address);

  const BlockBird = await ethers.getContractFactory('BlockBird');
  const blockBird = await BlockBird.deploy(counter.address);
  await blockBird.deployed();
  console.log('2) BlockBird:', blockBird.address);

  console.log('Integration ready: BlockBird -> MessageCounter');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
