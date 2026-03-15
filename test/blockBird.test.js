const { expect } = require('chai');

describe('BlockBird', function () {
  let BlockBird;
  let blockBird;
  let owner;

  beforeEach(async function () {
    BlockBird = await ethers.getContractFactory('BlockBird');
    const MessageCounter = await ethers.getContractFactory('MessageCounter');
    [owner] = await ethers.getSigners();
    counter = await MessageCounter.deploy();
    await counter.deployed();
    blockBird = await BlockBird.deploy(counter.address);
    await blockBird.deployed();
  });

  it('should start with zero messages', async function () {
    expect((await blockBird.getMessageCount()).toNumber()).to.equal(0);
  });

  it('should allow posting a message, emit event and increment counter', async function () {
    const tx = await blockBird.writeMessage('Hello BlockBird');
    const receipt = await tx.wait();
    const event = receipt.events.find(e => e.event === 'MessagePosted');
    expect(event).to.not.be.undefined;
    expect(event.args.sender).to.equal(owner.address);
    expect(event.args.message).to.equal('Hello BlockBird');

    expect((await blockBird.getMessageCount()).toNumber()).to.equal(1);
    expect((await counter.getCount()).toNumber()).to.equal(1);
    expect((await blockBird.getTotalMessages()).toNumber()).to.equal(1);
  });

  it('should retrieve messages and include timestamp', async function () {
    await blockBird.writeMessage('msg1');
    const msgs = await blockBird.readAllMessages();
    expect(msgs.length).to.equal(1);
    expect(msgs[0].text).to.equal('msg1');
    expect(msgs[0].sender).to.equal(owner.address);
    expect(msgs[0].timestamp.toNumber()).to.be.greaterThan(0);
  });

  it('readUnreadMessages returns unread and marks them read', async function () {
    await blockBird.writeMessage('a');
    await blockBird.writeMessage('b');
    let unread = await blockBird.readUnreadMessages();
    expect(unread.length).to.equal(2);

    // calling again should return 0 unread
    unread = await blockBird.readUnreadMessages();
    expect(unread.length).to.equal(0);
    // counter should have incremented twice
    expect((await counter.getCount()).toNumber()).to.equal(2);
  });
});
