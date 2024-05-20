import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchJsonWorker from '../LaunchJsonWorker/LaunchJsonWorker.js'

const { invoke } = GetOrCreateWorker.getOrCreateWorker(
  LaunchJsonWorker.launchJsonWorker
)

export { invoke }
