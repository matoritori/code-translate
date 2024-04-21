/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { compilerOptions } = require('./tsconfig')
const { pathsToModuleNameMapper } = require('ts-jest')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: '<rootDir>/',
	}),
	rootDir: './',
}
