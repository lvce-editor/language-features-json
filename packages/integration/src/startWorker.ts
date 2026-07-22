import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = `${__dirname}/../../..`

const getModuleUrl = (name: string): string => {
  const modulePath = join(
    root,
    'packages',
    'extension',
    'src',
    'parts',
    name,
    `${name}.ts`,
  )
  return pathToFileURL(modulePath).toString()
}

export const startWorker = async () => {
  const JsonSchemaContributions = await import(
    getModuleUrl('JsonSchemaContributions')
  )
  await JsonSchemaContributions.initialize()
  const JsonCompletion = await import(getModuleUrl('JsonCompletion'))
  const JsonDiagnostic = await import(getModuleUrl('JsonDiagnostic'))
  const GetSchema = await import(getModuleUrl('GetSchema'))
  const JsonHover = await import(getModuleUrl('JsonHover'))
  const Selection = await import(getModuleUrl('Selection'))
  const commandMap = {
    'Completion.getCompletion': JsonCompletion.jsonCompletion,
    'Completion.resolve': JsonCompletion.resolve,
    async 'Diagnostic.getDiagnostics'(textDocument: any) {
      const schema = await GetSchema.getSchema(textDocument.uri)
      return JsonDiagnostic.getDiagnostics(
        textDocument.text,
        textDocument.uri,
        schema,
      )
    },
    'Hover.getHover': JsonHover.getHover,
    'Selection.expand': Selection.expand,
  }
  return {
    execute(commandId: string, ...args: any[]) {
      const command = commandMap[commandId]
      if (!command) {
        throw new Error(`command not found ${commandId}`)
      }
      return command(...args)
    },
  }
}
