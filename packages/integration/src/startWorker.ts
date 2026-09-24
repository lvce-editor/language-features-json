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
  const JsonSyntaxDiagnostics = await import(
    getModuleUrl('JsonSyntaxDiagnostics')
  )
  const JsonCompletion = await import(getModuleUrl('JsonCompletion'))
  const DiagnosticProvider = await import(getModuleUrl('DiagnosticProvider'))
  const JsonHover = await import(getModuleUrl('JsonHover'))
  const Selection = await import(getModuleUrl('Selection'))
  const commandMap = {
    'Completion.getCompletion': JsonCompletion.jsonCompletion,
    'Completion.resolve': JsonCompletion.resolve,
    'Diagnostic.getDiagnostics': DiagnosticProvider.provideDiagnostics,
    'Diagnostic.getSyntaxDiagnostics': JsonSyntaxDiagnostics.getDiagnostics,
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
