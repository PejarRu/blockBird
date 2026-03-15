// Try to load build artifact (legacy) otherwise fallback to Hardhat artifact path
try {
	module.exports.blockBird = require('./build/blockBird');
} catch (e) {
	try {
		module.exports.blockBird = require('./artifacts/contracts/BlockBird.sol/BlockBird.json');
	} catch (err) {
		module.exports.blockBird = null;
	}
}