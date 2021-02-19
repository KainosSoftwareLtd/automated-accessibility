import archiver, { Archiver } from 'archiver'
import { createWriteStream, ensureDir, WriteStream } from 'fs-extra'
import { join } from 'path'
import { REPORT_DIRECTORY } from './config'
const htmlReporter = require('pa11y-reporter-html')
import { SnapshotResult } from './types'
import { generateReportFileName } from './utils'

export async function prepareFailureReport(failures: SnapshotResult[]): Promise<void> {
  const report: Archiver = await initFailureReport()

  await Promise.all(failures.map(failure => appendFailureToReport(failure, report)))

  await report.finalize()
}

async function initFailureReport(): Promise<Archiver> {
  await ensureDir(REPORT_DIRECTORY)

  const reportPath: string = join(REPORT_DIRECTORY, 'report.zip')

  const report: Archiver = archiver('zip')

  const output: WriteStream = createWriteStream(reportPath)

  report.pipe(output)

  return report
}

async function appendFailureToReport(failure: SnapshotResult, report: Archiver): Promise<void> {
  const htmlResults: string = await htmlReporter.results(failure)
  report.append(htmlResults, { name: generateReportFileName(failure.pageUrl) })
  return Promise.resolve()
}
