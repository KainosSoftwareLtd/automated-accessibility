import { readdir } from 'fs-extra'
import { basename, join } from 'path'
import puppeteer, { Browser, Page } from 'puppeteer'
import { ADDITIONAL_RULES, PUPPETEER_EXECUTABLE_PATH, SNAPSHOTS_DIRECTORY, STANDARD } from './config'
import { Pa11yOptions } from './types'

export async function readSnapshots(): Promise<string[]> {
  return (await readdir(SNAPSHOTS_DIRECTORY)).map(snapshot => join(SNAPSHOTS_DIRECTORY, snapshot))
}

export function prepareBrowser(): Promise<Browser> {
  return puppeteer.launch({
    headless: true,
    executablePath: PUPPETEER_EXECUTABLE_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless', '--disable-gpu', '--window-size=1280,800']
  })
}

export function generatePa11yOptions(browser: Browser, page: Page): Pa11yOptions {
  return {
    browser: browser,
    page: page,
    includeNotices: false,
    includeWarnings: false,
    level: 'error',
    standard: STANDARD,
    rules: ADDITIONAL_RULES,
    runners: [
      'axe',
      'htmlcs'
    ]
  }
}

export function generateReportFileName(pageUrl: string): string {
  return `${basename(pageUrl).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`
}
