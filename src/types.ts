import { Browser, Page } from 'puppeteer'

export interface SnapshotResult {
  documentTitle: string
  pageUrl: string
  issues: SnapshotIssue[]
}

export interface SnapshotIssue {
  code: string
  context: string
  message: string
  selector: string
  type: string
  typeCode: number
  runner: string
  runnerExtras: {}
}

export interface FormattedIssue {
  Selector: string
  Code: string
  Message: string
}

export interface Pa11yOptions {
  browser: Browser
  page: Page
  includeNotices: boolean
  includeWarnings: boolean
  level: string
  standard: string
  rules: string[]
}
