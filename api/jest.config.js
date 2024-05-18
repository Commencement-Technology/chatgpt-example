/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	collectCoverage: true,
	coverageDirectory: "./coverage",
	verbose: true,
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
	roots: ["<rootDir>/src"],
};
