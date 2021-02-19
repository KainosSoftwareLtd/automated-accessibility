import { green, red } from 'chalk'
import pLimit, { Limit } from 'p-limit'
const pa11y = require('pa11y')
import { Browser, Page } from 'puppeteer'
import { CONCURRENT_TESTS } from './config'
import { FormattedIssue, SnapshotIssue, SnapshotResult } from './types'
import { generatePa11yOptions, readSnapshots } from './utils'

export async function testSnapshots(browser: Browser): Promise<SnapshotResult[]> {
  const startTime: number = Date.now()

  const snapshots: string[] = await readSnapshots()

  console.log(`${snapshots.length} snapshots found...`)

  const limit: Limit = pLimit(CONCURRENT_TESTS)

  const allResults: SnapshotResult[] = await Promise.all(snapshots.map(snapshot => limit(() => testSnapshot(browser, snapshot))))

  const failures: SnapshotResult[] = allResults.filter(result => result.issues.length > 0)

  console.log(`Processing ${snapshots.length} snapshots took ${Date.now() - startTime}ms and found ${failures.length} failures`)

  return failures
}

async function testSnapshot(browser: Browser, snapshotPath: string): Promise<SnapshotResult> {
  const page: Page = await browser.newPage()

  const result: SnapshotResult = await pa11y(snapshotPath, generatePa11yOptions(browser, page))

  await page.close()

  logSnapshotResult(result)

  return result
}

function logSnapshotResult(result: SnapshotResult): void {
  const snapshotOutput: string = result.issues.length > 0 ?
    red(`** FAIL **: ${result.documentTitle} \n ${result.pageUrl} \n ${formatIssues(result.issues)} \n`) :
    green(`** PASS **: ${result.documentTitle} \n ${result.pageUrl} \n`)

  console.log(snapshotOutput)
}

function formatIssues(issues: SnapshotIssue[]): string {
  const formattedIssues: FormattedIssue[] = issues.map(issue => ({
    Selector: issue.selector,
    Code: issue.code,
    Message: issue.message
  }))

  return JSON.stringify(formattedIssues, null, 2)
}
