import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      'fixtures/**/*',
    ],
  },
  {
    rules: {
      'test/consistent-test-it': ['error', {
        fn: 'test',
      }],
    },
  },
)
