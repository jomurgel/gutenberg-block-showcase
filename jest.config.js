module.exports = {
	rootDir: '.',
	preset: '@wordpress/jest-preset-default',
	setupFilesAfterEnv: [ '<rootDir>/jest.setup.js' ],
	transformIgnorePatterns: [ 'node_modules' ],
	testEnvironment: 'jsdom',
	verbose: true,
	globals: {
		window: {},
	},
	transform: {
		'^.+\\.(js|jsx)$': 'babel-jest',
	},
	moduleNameMapper: {
		// Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
		uuid: require.resolve( 'uuid' ),
		'@wordpress/private-apis': require.resolve( '@wordpress/private-apis' ),
	},
};
