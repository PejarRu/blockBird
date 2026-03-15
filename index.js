// LEGACY COMPATIBILITY ENTRYPOINT.
// Main workflow is Hardhat artifacts under ./artifacts.
// This file is kept for old scripts that import from project root.
try {
	module.exports.blockBird = require('./build/BlockBird.json');
} catch (e) {
	try {
		module.exports.blockBird = require('./artifacts/contracts/BlockBird.sol/BlockBird.json');
	} catch (err) {
		module.exports.blockBird = null;
	}
}