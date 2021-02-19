import { green, red } from 'chalk'
import { Browser } from 'puppeteer'
import { prepareFailureReport } from './report'
import { testSnapshots } from './testRunner'
import { SnapshotResult } from './types'
import { prepareBrowser } from './utils'

(async () => {
  const browser: Browser = await prepareBrowser()

  const failures: SnapshotResult[] = await testSnapshots(browser)

  await browser.close()

  await handleTestResult(failures)
})()

async function handleTestResult(failures: SnapshotResult[]): Promise<void> {
  if (failures.length > 0) {
    console.log(`Accessibility tests ${red('FAILED :(')}`)
    await prepareFailureReport(failures)
    process.exitCode = 1
  } else {
    console.log(`Accessibility tests ${green('PASSED :)')}`)
    process.exitCode = 0
  }
}
