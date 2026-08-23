import { expect, test } from '@jest/globals'
import * as CreateSettingsSchema from '../src/parts/CreateSettingsSchema/CreateSettingsSchema.ts'

test('creates a schema from distributed settings contributions', () => {
  expect(
    CreateSettingsSchema.createSettingsSchema([
      [
        {
          description: 'The font family of the editor',
          id: 'editor.fontFamily',
          type: 2,
          value: 'Fira Code',
        },
        {
          description: 'The font size of the editor',
          id: 'editor.fontSize',
          maximum: 100,
          minimum: 10,
          type: 5,
          value: 15,
        },
        {
          description: 'Controls how lines should wrap',
          id: 'editor.wordWrap',
          options: [
            { id: 'editor.on', label: 'On' },
            { id: 'editor.off', label: 'Off' },
          ],
          type: 1,
          value: 'off',
        },
        {
          description: 'Controls editor rulers',
          id: 'editor.rulers',
          type: 4,
          value: [],
        },
      ],
      [
        {
          description: 'Configures excluded files',
          id: 'files.exclude',
          type: 4,
          value: { '**/.git': true },
        },
      ],
    ]),
  ).toEqual({
    properties: {
      'editor.fontFamily': {
        default: 'Fira Code',
        description: 'The font family of the editor',
        enum: undefined,
        maximum: undefined,
        minimum: undefined,
        type: 'string',
      },
      'editor.fontSize': {
        default: 15,
        description: 'The font size of the editor',
        enum: undefined,
        maximum: 100,
        minimum: 10,
        type: 'number',
      },
      'editor.wordWrap': {
        default: 'off',
        description: 'Controls how lines should wrap',
        enum: ['on', 'off'],
        maximum: undefined,
        minimum: undefined,
        type: 'string',
      },
      'editor.rulers': {
        default: [],
        description: 'Controls editor rulers',
        enum: undefined,
        maximum: undefined,
        minimum: undefined,
        type: 'array',
      },
      'files.exclude': {
        default: { '**/.git': true },
        description: 'Configures excluded files',
        enum: undefined,
        maximum: undefined,
        minimum: undefined,
        type: 'object',
      },
    },
    type: 'object',
  })
})
