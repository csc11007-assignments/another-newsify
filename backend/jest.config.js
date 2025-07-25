module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
        '**/*.(t|j)s',
        '!**/migrations/**', // Exclude migrations folder
        '!**/seeders/**',
        '!**/node_modules/**',
        '!**/dist/**',
    ],
    coverageDirectory: '../coverage',
    coverageReporters: ['text', 'lcov', 'json-summary', 'html'],
    testEnvironment: 'node',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/$1',
    },
    testPathIgnorePatterns: ['/node_modules/', '/migrations/', '/seeders/'],
};