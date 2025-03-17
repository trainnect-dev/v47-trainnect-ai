module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/tests/**/*.test.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { configFile: './babel.config.test.js' }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|vfile|unist|unified|bail|is-plain-obj|trough|remark|micromark|decode-named-character-reference|character-entities|property-information|hast|space-separated-tokens|comma-separated-tokens|mdast|markdown-table|trim-lines|string-width|strip-ansi|ansi-regex|is-fullwidth-code-point|emoji-regex|character-entities-legacy|character-reference-invalid|@ai-sdk|ai))',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/lib/models$': '<rootDir>/__mocks__/lib/models.js',
    '^@/lib/posthog$': '<rootDir>/__mocks__/lib/posthog.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^react-markdown$': '<rootDir>/__mocks__/react-markdown.js',
    '^framer-motion$': '<rootDir>/__mocks__/framer-motion.js',
    '^@ai-sdk/react$': '<rootDir>/__mocks__/@ai-sdk/react.js',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  // Use different test environments based on the test file
  projects: [
    {
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: ['**/__tests__/**/*.test.ts'],
      transform: {
        '^.+\\.(ts|tsx)$': ['babel-jest', { configFile: './babel.config.test.js' }],
      },
      transformIgnorePatterns: [
        '/node_modules/(?!(.pnpm|vfile|unist|unified|bail|is-plain-obj|trough|remark|micromark|decode-named-character-reference|character-entities|property-information|hast|space-separated-tokens|comma-separated-tokens|mdast|markdown-table|trim-lines|string-width|strip-ansi|ansi-regex|is-fullwidth-code-point|emoji-regex|character-entities-legacy|character-reference-invalid|@ai-sdk|ai))',
      ],
    },
    {
      displayName: 'jsdom',
      testEnvironment: 'jsdom',
      testMatch: ['**/tests/**/*.test.tsx'],
      transform: {
        '^.+\\.(ts|tsx)$': ['babel-jest', { configFile: './babel.config.test.js' }],
      },
      transformIgnorePatterns: [
        '/node_modules/(?!(.pnpm|vfile|unist|unified|bail|is-plain-obj|trough|remark|micromark|decode-named-character-reference|character-entities|property-information|hast|space-separated-tokens|comma-separated-tokens|mdast|markdown-table|trim-lines|string-width|strip-ansi|ansi-regex|is-fullwidth-code-point|emoji-regex|character-entities-legacy|character-reference-invalid|@ai-sdk|ai))',
      ],
    },
  ],
};
