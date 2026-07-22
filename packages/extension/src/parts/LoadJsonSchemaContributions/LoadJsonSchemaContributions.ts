import type { JsonSchemaContribution } from '@lvce-editor/api'
import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'
import * as JsonSchemaContributions from '../JsonSchemaContributions/JsonSchemaContributions.ts'
import * as MatchesJsonSchema from '../MatchesJsonSchema/MatchesJsonSchema.ts'

interface JsonSchemaContributionWithSchema extends JsonSchemaContribution {
  readonly schema?: JsonSchema
}

const loadJson = async (
  contribution: JsonSchemaContributionWithSchema,
): Promise<JsonSchema> => {
  if (contribution.schema) {
    return contribution.schema
  }
  const schemaUrl = new URL(contribution.url, import.meta.url).href
  const response = await fetch(schemaUrl)
  if (!response.ok) {
    throw new Error(
      `Failed to load JSON schema ${schemaUrl}: ${response.statusText}`,
    )
  }
  return response.json() as Promise<JsonSchema>
}

export const loadJsonSchemaContributions = async (
  uri: string,
): Promise<readonly JsonSchema[]> => {
  const contributions = await JsonSchemaContributions.get()
  const matching = contributions.filter((contribution) =>
    MatchesJsonSchema.matchesJsonSchema(uri, contribution),
  )
  const results = await Promise.allSettled(
    matching.map((contribution) => loadJson(contribution)),
  )
  const schemas: JsonSchema[] = []
  for (const result of results) {
    if (result.status === 'fulfilled') {
      schemas.push(result.value)
    } else {
      console.warn(result.reason)
    }
  }
  return schemas
}
