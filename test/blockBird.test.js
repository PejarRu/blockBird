const { expect } = require('chai');

describe('BlockBird', function () {
  let BlockBird;
  let MessageCounter;
  let blockBird;
  let counter;
  let owner;
  let otherUser;

  async function expectRevert(promise, expectedMessage) {
    try {
      await promise;
      expect.fail('Expected transaction to revert');
    } catch (error) {
      expect(error.message).to.include(expectedMessage);
    }
  }

  beforeEach(async function () {
    BlockBird = await ethers.getContractFactory('BlockBird');
    MessageCounter = await ethers.getContractFactory('MessageCounter');
    [owner, otherUser] = await ethers.getSigners();
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
    const event = receipt.events.find((currentEvent) => currentEvent.event === 'MessagePosted');

    expect(event).to.not.be.undefined;
    expect(event.args.sender).to.equal(owner.address);
    expect(event.args.message).to.equal('Hello BlockBird');
    expect(event.args.timestamp.toNumber()).to.be.greaterThan(0);

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

    let unread = await blockBird.callStatic.readUnreadMessages();
    expect(unread.length).to.equal(2);
    expect(unread[0].text).to.equal('a');
    expect(unread[1].text).to.equal('b');

    await blockBird.readUnreadMessages();

    const firstMessage = await blockBird.getMessage(0);
    const secondMessage = await blockBird.getMessage(1);
    expect(firstMessage.read).to.equal(true);
    expect(secondMessage.read).to.equal(true);

    unread = await blockBird.callStatic.readUnreadMessages();
    expect(unread.length).to.equal(0);
    await blockBird.readUnreadMessages();

    expect((await counter.getCount()).toNumber()).to.equal(2);
  });

  it('should revert when message is empty', async function () {
    await expectRevert(blockBird.writeMessage(''), 'Message cannot be empty');
  });

  it('should revert when message exceeds 300 characters', async function () {
    const tooLongMessage = 'a'.repeat(301);
    await expectRevert(blockBird.writeMessage(tooLongMessage), 'Message exceeds 300 characters');
  });

  it('should revert getMessage for out of bounds index', async function () {
    await expectRevert(blockBird.getMessage(0), 'Index out of bounds');
  });

  it('should allow only owner to set counter address', async function () {
    const newCounter = await MessageCounter.deploy();
    await newCounter.deployed();

    await expectRevert(
      blockBird.connect(otherUser).setCounter(newCounter.address),
      'Only owner'
    );

    await blockBird.setCounter(newCounter.address);
    expect(await blockBird.counter()).to.equal(newCounter.address);
  });

  it('should reject zero address in setCounter', async function () {
    await expectRevert(
      blockBird.setCounter(ethers.constants.AddressZero),
      'Invalid counter address'
    );
  });
});
