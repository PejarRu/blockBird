async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with account:', deployer.address);

  const MessageCounter = await ethers.getContractFactory('MessageCounter');
  const counter = await MessageCounter.deploy();
  await counter.deployed();
  console.log('MessageCounter deployed to:', counter.address);

  const BlockBird = await ethers.getContractFactory('BlockBird');
  const blockBird = await BlockBird.deploy(counter.address);
  await blockBird.deployed();

  console.log('BlockBird deployed to:', blockBird.address);

  console.log('Integration: counter at', counter.address, 'used by BlockBird at', blockBird.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
