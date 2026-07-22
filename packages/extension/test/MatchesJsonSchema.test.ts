import { expect, test } from '@jest/globals'
import * as MatchesJsonSchema from '../src/parts/MatchesJsonSchema/MatchesJsonSchema.ts'

test('matches an exact package.json file name', () => {
  expect(
    MatchesJsonSchema.matchesJsonSchema('file:///workspace/package.json', {
      fileMatch: 'package.json',
      url: '/schema.json',
    }),
  ).toBe(true)
})

test('does not match a different file name', () => {
  expect(
    MatchesJsonSchema.matchesJsonSchema('file:///workspace/package-lock.json', {
      fileMatch: 'package.json',
      url: '/schema.json',
    }),
  ).toBe(false)
})

test('matches wildcard patterns', () => {
  expect(
    MatchesJsonSchema.matchesJsonSchema(
      'file:///workspace/tsconfig.test.json',
      {
        fileMatch: 'tsconfig.*.json',
        url: '/schema.json',
      },
    ),
  ).toBe(true)
})

test('matches any pattern in an array', () => {
  expect(
    MatchesJsonSchema.matchesJsonSchema(
      'file:///workspace/.prettierrc.json?raw=1',
      {
        fileMatch: ['.prettierrc', '.prettierrc.json'],
        url: '/schema.json',
      },
    ),
  ).toBe(true)
})
